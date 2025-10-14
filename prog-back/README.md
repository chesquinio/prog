# programcion-backend

Backend en Go con estructura escalable y mantenible.

## Estructura de carpetas

- `cmd/` - Comandos principales (entrypoints)
- `internal/controllers/` - Controladores de la lógica de negocio
- `internal/services/` - Servicios de aplicación
- `internal/repositories/` - Acceso a datos y persistencia
- `internal/models/` - Definición de modelos y entidades
- `internal/routes/` - Definición de rutas y middlewares
- `pkg/config/` - Configuración y carga de variables de entorno
- `pkg/utils/` - Utilidades y helpers

## Dependencias principales

- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Router HTTP
- [joho/godotenv](https://github.com/joho/godotenv) - Variables de entorno
- [sirupsen/logrus](https://github.com/sirupsen/logrus) - Logging

## Uso rápido

1. Instala las dependencias:
   ```sh
   go mod tidy
   ```
2. Copia el archivo `.env` y ajusta los valores según tu entorno.
3. Ejecuta el servidor:
   ```sh
   go run main.go
   ```

¡Listo para empezar a desarrollar tu backend en Go!
