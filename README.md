# Plataforma de Reservas de Aulas Universitarias

Sistema completo de gestión y reservas de aulas universitarias con backend en Go y frontend en Next.js.

## 🚀 Inicio Rápido con Docker

### Prerequisitos

- Docker Desktop instalado
- Docker Compose

### Levantar todo el stack

Desde la raíz del proyecto:

```bash
docker-compose up --build
```

Esto levantará:

- **PostgreSQL**: `localhost:5433`
- **Backend API**: `http://localhost:8080`
- **Frontend Web**: `http://localhost:3000`

### Detener los servicios

```bash
docker-compose down
```

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo base de datos
docker-compose logs -f db
```

## 📁 Estructura del Proyecto

```
prog/
├── docker-compose.yml       # Configuración de Docker para todo el stack
├── prog-back/              # Backend en Go
│   ├── Dockerfile
│   ├── main.go
│   ├── internal/           # Código de la aplicación
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── seeder/
│   ├── pkg/                # Paquetes reutilizables
│   └── README.md
└── prog-front/             # Frontend en Next.js
    └── README.md
```

## 🔑 Credenciales por Defecto

### Usuario Administrador (creado automáticamente)

- **Email**: admin@example.com
- **Password**: ChangeMe123!

### Base de Datos

- **Host**: localhost
- **Puerto**: 5433
- **Usuario**: postgres
- **Password**: postgres
- **Database**: progdb

## 🛠️ Desarrollo Local (sin Docker)

### Backend

```bash
cd prog-back

# Instalar dependencias
go mod download

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales locales

# Ejecutar
go run main.go
```

El backend estará en `http://localhost:8080`

### Frontend

Ver `prog-front/README.md` para instrucciones específicas del frontend.

## 📚 Documentación de API

### Endpoints Principales

#### Autenticación

- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/logout` - Logout

#### Usuarios (ADMIN)

- `GET /api/users` - Listar usuarios
- `PATCH /api/users/:id/confirm` - Confirmar usuario

#### Edificios

- `GET /api/buildings` - Listar edificios
- `POST /api/buildings` - Crear edificio (ADMIN)

#### Aulas

- `GET /api/rooms` - Listar aulas
- `POST /api/rooms` - Crear aula (ADMIN)

#### Clases (PROFESSOR)

- `POST /api/classes` - Crear clase
- `GET /api/classes` - Listar clases
- `POST /api/classes/:id/students` - Añadir estudiante

#### Reservas (PROFESSOR)

- `POST /api/reservations` - Crear reserva
- `GET /api/reservations` - Listar reservas

#### Público

- `GET /api/public/reservations` - Ver calendario público

Ver documentación completa en `prog-back/PLANNING-BACKEND.md`

## 🎯 Roles del Sistema

- **ADMIN**: Gestión completa del sistema
- **PROFESSOR**: Gestión de clases y reservas
- **STUDENT**: Ver clases asignadas

## 🔧 Configuración Avanzada

### Variables de Entorno

Editar `docker-compose.yml` para cambiar:

- Credenciales de base de datos
- Credenciales del admin inicial
- Puertos expuestos
- JWT secret

### Reconstruir imágenes

```bash
docker-compose build --no-cache
```

### Limpiar volúmenes

```bash
docker-compose down -v
```

## 🐛 Troubleshooting

### El backend no conecta a la base de datos

- Asegurarse de que el servicio `db` esté corriendo: `docker-compose ps`
- Ver logs: `docker-compose logs db`
- El backend espera que la DB esté en `db:5432` (nombre del servicio en Docker)

### Puerto ya en uso

Si algún puerto (3000, 8080, 5433) está ocupado:

1. Detener el proceso que lo usa
2. O cambiar el puerto en `docker-compose.yml`

### Reiniciar solo un servicio

```bash
docker-compose restart backend
```

## 📝 Notas

- El seeder se ejecuta automáticamente al iniciar el backend
- Los datos de la base de datos persisten en un volumen Docker
- Para resetear la base de datos: `docker-compose down -v`

## 📄 Licencia

Este proyecto es para uso académico/educativo.
