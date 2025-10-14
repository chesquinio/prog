package seeder

import (
	"embed"
	"fmt"
	"io/fs"
	"os"
	"strings"
	"time"

	"programcion-backend/internal/models"
	"programcion-backend/pkg/db"

	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var seedFS embed.FS

// SeedAdmin performs the following steps in order:
// 1. Create admin user if ADMIN_* env vars are provided (keeps existing behavior)
// 2. Create several sample users (professors and students) with hashed passwords
// 3. Execute embedded SQL files (buildings, rooms)
// 4. Create sample reservations programmatically linking real user and room IDs
func SeedAdmin() error {
	dbConn := db.GetDB()
	if dbConn == nil {
		log.Error("DB no inicializada en seeder")
		return nil
	}

	// 1) Admin (existing behavior)
	adminEmail := os.Getenv("ADMIN_EMAIL")
	adminPassword := os.Getenv("ADMIN_PASSWORD")
	adminName := os.Getenv("ADMIN_NAME")
	if adminEmail == "" || adminPassword == "" {
		log.Warn("No se proporcionaron credenciales de admin en variables de entorno; se omitirá la creación del admin (si no existe)")
	} else {
		var existing models.User
		res := dbConn.Where("email = ?", adminEmail).First(&existing)
		if res.Error == nil && existing.ID != 0 {
			log.Infof("Usuario admin ya existe: %s", adminEmail)
		} else {
			hash, err := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)
			if err != nil {
				log.WithError(err).Error("Error al hashear la contraseña del admin")
				return err
			}
			admin := models.User{
				Name:         adminName,
				Email:        adminEmail,
				PasswordHash: string(hash),
				Role:         "ADMIN",
				IsConfirmed:  true,
			}
			if err := dbConn.Create(&admin).Error; err != nil {
				log.WithError(err).Error("Error al crear usuario admin")
				return err
			}
			log.Infof("Usuario admin creado: %s", adminEmail)
		}
	}

	// 2) Sample users (professors and students) - ensure they exist and have hashed passwords
	sampleUsers := []struct {
		Name     string
		Email    string
		Password string
		Role     string
	}{
		{"Prof. Ana García", "ana.garcia@example.com", "pass123", "PROFESSOR"},
		{"Prof. Carlos Pérez", "carlos.perez@example.com", "pass123", "PROFESSOR"},
		{"Alumno Marta López", "marta.lopez@example.com", "pass123", "STUDENT"},
		{"Alumno Juan Ruiz", "juan.ruiz@example.com", "pass123", "STUDENT"},
	}

	for _, su := range sampleUsers {
		var u models.User
		if err := dbConn.Where("email = ?", su.Email).First(&u).Error; err == nil && u.ID != 0 {
			log.Infof("Usuario ya existe: %s", su.Email)
			continue
		}
		hash, err := bcrypt.GenerateFromPassword([]byte(su.Password), bcrypt.DefaultCost)
		if err != nil {
			log.WithError(err).Error("Error al hashear contraseña de usuario de muestra")
			return err
		}
		newUser := models.User{
			Name:         su.Name,
			Email:        su.Email,
			PasswordHash: string(hash),
			Role:         su.Role,
			IsConfirmed:  true,
		}
		if err := dbConn.Create(&newUser).Error; err != nil {
			log.WithError(err).WithField("email", su.Email).Error("Error creando usuario de muestra")
			return err
		}
		log.Infof("Usuario de muestra creado: %s (%s)", newUser.Email, newUser.Role)
	}

	// 3) Execute embedded SQL files (buildings, rooms, etc.)
	if err := runSQLSeeds(dbConn); err != nil {
		return err
	}

	// 4) Create sample reservations programmatically so we can link real user IDs and room IDs
	if err := createSampleReservations(dbConn); err != nil {
		return err
	}

	return nil
}

func runSQLSeeds(dbConn *gorm.DB) error {
	// Primero intentamos leer archivos embebidos (compilados). Si no existen
	// se intentará leer desde el filesystem en /app/sql (copiado en la imagen Docker).
	entries, err := fs.ReadDir(seedFS, "sql")
	if err == nil {
		for _, e := range entries {
			if e.IsDir() {
				continue
			}
			name := e.Name()
			content, err := seedFS.ReadFile("sql/" + name)
			if err != nil {
				log.WithError(err).WithField("file", name).Error("Error leyendo seed SQL embebido")
				return err
			}
			if err := execSQLStatements(dbConn, name, string(content)); err != nil {
				return err
			}
		}
		return nil
	}

	// Fallback a carpeta /app/sql (esta será copiada por Dockerfile)
	log.WithField("err", err).Warn("No hay seeds embebidos; intentando /app/sql")
	files, ferr := os.ReadDir("/app/sql")
	if ferr != nil {
		log.WithError(ferr).Error("No se pudo leer /app/sql")
		return ferr
	}
	for _, f := range files {
		if f.IsDir() {
			continue
		}
		name := f.Name()
		content, rerr := os.ReadFile("/app/sql/" + name)
		if rerr != nil {
			log.WithError(rerr).WithField("file", name).Error("Error leyendo seed SQL desde /app/sql")
			return rerr
		}
		if err := execSQLStatements(dbConn, name, string(content)); err != nil {
			return err
		}
	}
	return nil
}

func execSQLStatements(dbConn *gorm.DB, name, sqlText string) error {
	stmts := splitSQLStatements(sqlText)
	for _, s := range stmts {
		s = strings.TrimSpace(s)
		if s == "" {
			continue
		}
		if err := dbConn.Exec(s).Error; err != nil {
			log.WithError(err).WithField("file", name).Error("Error ejecutando statement SQL")
			return fmt.Errorf("error ejecutando seed %s: %w", name, err)
		}
	}
	log.Infof("Seed SQL ejecutado: %s", name)
	return nil
}

// splitSQLStatements is a simple splitter by semicolon. It won't handle edge-cases like
// semicolons inside strings, but is sufficient for our static seed files.
func splitSQLStatements(sql string) []string {
	parts := strings.Split(sql, ";")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		if strings.TrimSpace(p) != "" {
			out = append(out, p)
		}
	}
	return out
}

func createSampleReservations(dbConn *gorm.DB) error {
	// Find two professor users
	var profs []models.User
	if err := dbConn.Where("role = ?", "PROFESSOR").Find(&profs).Error; err != nil {
		return err
	}
	if len(profs) == 0 {
		log.Warn("No se encontraron profesores para crear reservas de muestra")
		return nil
	}

	// Find some rooms
	var rooms []models.Room
	if err := dbConn.Limit(5).Find(&rooms).Error; err != nil {
		return err
	}
	if len(rooms) == 0 {
		log.Warn("No se encontraron aulas para crear reservas de muestra")
		return nil
	}

	// Create reservations for first professor and two rooms
	now := time.Now().Truncate(time.Hour)
	sample := []models.Reservation{
		{RoomID: rooms[0].ID, UserID: profs[0].ID, StartTime: now.Add(24 * time.Hour).UTC(), EndTime: now.Add(25 * time.Hour).UTC(), Purpose: "Clase de Programación", EstimatedAttendees: 25, Status: "ACTIVE"},
	}
	if len(rooms) > 1 && len(profs) > 1 {
		sample = append(sample, models.Reservation{RoomID: rooms[1].ID, UserID: profs[1].ID, StartTime: now.Add(24 * time.Hour).UTC(), EndTime: now.Add(26 * time.Hour).UTC(), Purpose: "Seminario", EstimatedAttendees: 40, Status: "ACTIVE"})
	}

	for _, r := range sample {
		// Avoid duplicates: check overlapping by exact match on start_time and room_id
		var existing models.Reservation
		if err := dbConn.Where("room_id = ? AND start_time = ?", r.RoomID, r.StartTime).First(&existing).Error; err == nil && existing.ID != 0 {
			log.Infof("Reserva de muestra ya existe para room %d start %s", r.RoomID, r.StartTime)
			continue
		}
		if err := dbConn.Create(&r).Error; err != nil {
			log.WithError(err).Error("Error creando reserva de muestra")
			return err
		}
		log.Infof("Reserva de muestra creada: room %d user %d", r.RoomID, r.UserID)
	}
	return nil
}
