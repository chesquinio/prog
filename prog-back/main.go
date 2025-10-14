package main

import (
	"programcion-backend/internal/routes"
	"programcion-backend/internal/seeder"
	"programcion-backend/pkg/config"
	"programcion-backend/pkg/db"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func main() {
	// Cargar configuración y variables de entorno
	config.LoadConfig()

	// Inicializar la base de datos (Postgres + GORM)
	if err := db.InitDB(); err != nil {
		log.WithError(err).Fatal("No se pudo inicializar la base de datos")
	}

	// Ejecutar seeder para crear admin inicial si no existe
	if err := seeder.SeedAdmin(); err != nil {
		log.WithError(err).Fatal("Seeder falló")
	}

	r := gin.Default()

	// CORS - permitir cookies desde frontend en desarrollo
	r.Use(func() gin.HandlerFunc {
		return func(c *gin.Context) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			if c.Request.Method == "OPTIONS" {
				c.AbortWithStatus(200)
				return
			}
			c.Next()
		}
	}())

	// Configurar rutas
	routes.SetupRoutes(r)

	log.Info("Servidor iniciado en :8080")
	r.Run(":8080")
}
