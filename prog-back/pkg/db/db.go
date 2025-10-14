package db

import (
	"fmt"
	"os"

	"programcion-backend/internal/models"

	log "github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() error {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")
	if sslmode == "" {
		sslmode = "disable"
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, pass, name, sslmode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.WithError(err).Error("No se pudo conectar a la base de datos")
		return err
	}

	// Guardar la instancia
	DB = db

	// Auto-migrate modelos esenciales
	err = DB.AutoMigrate(&models.User{}, &models.Building{}, &models.Room{}, &models.Reservation{})
	if err != nil {
		log.WithError(err).Error("Error en AutoMigrate")
		return err
	}

	log.Info("Conexión a la base de datos establecida y migraciones aplicadas")
	return nil
}

func GetDB() *gorm.DB {
	return DB
}
