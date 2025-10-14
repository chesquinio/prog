package config

import (
	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
)

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Warn("No se pudo cargar el archivo .env, usando variables de entorno del sistema")
	}
}
