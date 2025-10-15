# programcion-backend

Backend en Go para plataforma de reservas de aulas universitarias.

## Estructura de carpetas

- `internal/controllers/` - Controladores HTTP (handlers)
- `internal/services/` - Lógica de negocio
- `internal/repositories/` - Acceso a datos y persistencia
- `internal/models/` - Modelos de datos (GORM)
- `internal/routes/` - Definición de rutas y middlewares
- `internal/middleware/` - Middleware de autenticación y autorización
- `internal/seeder/` - Datos iniciales y migraciones
- `pkg/config/` - Configuración de la aplicación
- `pkg/db/` - Conexión a base de datos
- `pkg/utils/` - Utilidades y helpers

## Stack Tecnológico

- **Lenguaje**: Go 1.23+
- **Framework web**: Gin (github.com/gin-gonic/gin)
- **ORM**: GORM (gorm.io/gorm)
- **Base de datos**: PostgreSQL 15+
- **Autenticación**: JWT (github.com/golang-jwt/jwt/v5)
- **Hashing**: bcrypt (golang.org/x/crypto/bcrypt)

## Desarrollo Local

### Prerequisitos

- Go 1.23 o superior
- PostgreSQL 15+ (o usar Docker)

### Configuración

1. Copiar el archivo de ejemplo de variables de entorno:

   ```sh
   cp .env.example .env
   ```

2. Editar `.env` con tus credenciales:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=progdb
   DB_SSLMODE=disable

   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=ChangeMe123!
   ADMIN_NAME=Admin Inicial
   ```

3. Instalar dependencias:

   ```sh
   go mod download
   ```

4. Ejecutar el servidor:
   ```sh
   go run main.go
   ```

El servidor estará disponible en `http://localhost:8080`

## Uso con Docker

### Levantar todo el stack (Backend + Base de datos + Frontend)

Desde la raíz del proyecto (`prog/`):

```sh
docker-compose up --build
```

Esto levantará:

- **PostgreSQL**: Puerto 5433
- **Backend**: Puerto 8080
- **Frontend**: Puerto 3000

### Solo Backend y Base de datos

```sh
docker-compose up --build db backend
```

### Variables de entorno

Las variables de entorno están configuradas en `docker-compose.yml`. Para cambiarlas, editar el archivo directamente.

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login (devuelve JWT + cookie)
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios (Solo ADMIN)

- `GET /api/users` - Listar usuarios con filtros
- `GET /api/users/:id` - Obtener usuario
- `PATCH /api/users/:id/confirm` - Confirmar usuario

### Edificios

- `GET /api/buildings` - Listar edificios
- `POST /api/buildings` - Crear edificio (ADMIN)
- `GET /api/buildings/:id` - Obtener edificio

### Aulas

- `GET /api/rooms` - Listar aulas
- `POST /api/rooms` - Crear aula (ADMIN)
- `GET /api/rooms/:id` - Obtener aula
- `PATCH /api/rooms/:id` - Actualizar aula (ADMIN)
- `DELETE /api/rooms/:id` - Eliminar aula (ADMIN)

### Clases (Nuevo)

- `POST /api/classes` - Crear clase (PROFESSOR)
- `GET /api/classes` - Listar clases
- `GET /api/classes/:id` - Obtener clase
- `PATCH /api/classes/:id` - Actualizar clase
- `DELETE /api/classes/:id` - Eliminar clase
- `POST /api/classes/:id/students` - Añadir estudiante
- `DELETE /api/classes/:id/students/:student_id` - Remover estudiante
- `GET /api/classes/:id/students` - Listar estudiantes de clase

### Reservas

- `POST /api/reservations` - Crear reserva (PROFESSOR)
- `GET /api/reservations` - Listar reservas
- `GET /api/reservations/:id` - Obtener reserva
- `PATCH /api/reservations/:id` - Cancelar reserva (ADMIN)
- `DELETE /api/reservations/:id` - Eliminar reserva (ADMIN)

### Público

- `GET /api/public/reservations` - Listar reservas (sin autenticación)

## Roles y Permisos

- **ADMIN**: Acceso completo, puede confirmar usuarios, gestionar edificios y aulas
- **PROFESSOR**: Puede crear clases, añadir estudiantes y crear reservas
- **STUDENT**: Puede ver sus clases

## Seeder

Al iniciar la aplicación, se ejecuta automáticamente un seeder que:

1. Crea el usuario administrador si no existe (usando variables de entorno)
2. Crea usuarios de ejemplo (profesores y estudiantes)
3. Opcionalmente ejecuta archivos SQL de ejemplo

## Seguridad

- Las contraseñas se hashean con bcrypt
- JWT para autenticación
- Cookies HTTP-only para tokens
- CORS configurado para frontend en localhost:3000
- Soporte dual: Cookie Y header Authorization

## Documentación Adicional

Ver `PLANNING-BACKEND.md` para detalles completos de la arquitectura y planificación.
