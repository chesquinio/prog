# Plan de desarrollo: Backend - Plataforma de reservas de aulas

Fecha: 15 de octubre de 2025 (Actualizado)

## Propósito

Este documento describe el estado actual y las extensiones necesarias para el backend de la plataforma de reservas de aulas universitarias. El backend está construido en Go con Gin Framework, GORM y PostgreSQL.

## Estado actual del proyecto

### ✅ Ya implementado

El backend actual cuenta con:

1. **Estructura base del proyecto**

   - Arquitectura organizada por capas (controllers, services, repositories, models)
   - Configuración de GORM con PostgreSQL
   - Docker y Docker Compose configurados
   - Seeder de usuario administrador inicial

2. **Autenticación y autorización**

   - ✅ Registro de usuarios (POST /api/auth/register)
   - ✅ Login con JWT (POST /api/auth/login)
   - ✅ Cookie HTTP-only implementada para almacenar JWT
   - ✅ Endpoint para obtener usuario actual (GET /api/auth/me)
   - ✅ Endpoint de logout (POST /api/auth/logout)
   - ✅ Middleware RequireAuthentication()
   - ✅ Middleware RequireRole(role)
   - ✅ Validación de cuenta confirmada en login

3. **Gestión de usuarios**

   - ✅ Modelo User con campos: id, name, email, password_hash, role, is_confirmed
   - ✅ Confirmación de usuarios por admin (PATCH /api/users/:id/confirm)
   - ✅ Roles: ADMIN, PROFESSOR, STUDENT

4. **Gestión de edificios**

   - ✅ Modelo Building con campos: id, name, address, campus
   - ✅ CRUD básico de edificios (solo ADMIN)
   - ✅ Endpoints: GET /api/buildings, POST /api/buildings, GET /api/buildings/:id

5. **Gestión de aulas**

   - ✅ Modelo Room con campos: id, building_id, name, capacity, resources (JSONB), description
   - ✅ CRUD completo de aulas (solo ADMIN)
   - ✅ Endpoints: GET /api/rooms, POST /api/rooms, GET /api/rooms/:id, PATCH /api/rooms/:id, DELETE /api/rooms/:id

6. **Gestión de reservas**
   - ✅ Modelo Reservation con campos: id, room_id, user_id, start_time, end_time, purpose, estimated_attendees, status
   - ✅ Crear reserva (POST /api/reservations) - Solo PROFESSOR
   - ✅ Listar reservas (GET /api/reservations) con filtros básicos
   - ✅ Obtener reserva (GET /api/reservations/:id)
   - ✅ Cancelar reserva (PATCH/DELETE /api/reservations/:id) - ADMIN
   - ✅ Validación de solapamiento de horarios
   - ✅ Validación de capacidad del aula
   - ✅ Endpoint público para listar reservas (GET /api/public/reservations)

### 🚧 Pendiente de implementar

Las siguientes funcionalidades son necesarias para completar el MVP según la especificación del frontend:

1. **Nueva entidad: Clases (Classes)**

   - Modelo Class con relación profesor-clase y clase-estudiantes
   - CRUD completo de clases
   - Gestión de estudiantes en clases (many-to-many)

2. **Extensión de Reservas**

   - Campo class_id en reservas (asociar reserva a una clase)
   - Filtros adicionales por class_id

3. **Extensión de Usuarios**

   - Endpoint para listar usuarios con filtros (role, is_confirmed)
   - Endpoint para obtener estudiantes confirmados (para añadir a clases)

4. **CORS mejorado**

   - Configuración explícita para permitir cookies desde frontend

5. **Autenticación mejorada**
   - Soporte dual: cookie Y header Authorization
   - Devolver información de usuario en login

## Resumen del producto

La plataforma permite:

- **Profesores**: Crear clases, añadir alumnos a clases, reservar aulas para clases específicas
- **Alumnos**: Ser añadidos a clases por profesores
- **Administradores**: Confirmar cuentas de usuarios, gestionar edificios y aulas, supervisar reservas
- **Usuarios no autenticados**: Visualizar calendario público de reservas

## Stack tecnológico

- **Lenguaje**: Go 1.21+
- **Framework web**: Gin (github.com/gin-gonic/gin)
- **ORM**: GORM (gorm.io/gorm)
- **Base de datos**: PostgreSQL 15+
- **Autenticación**: JWT (github.com/golang-jwt/jwt/v5)
- **Hashing**: bcrypt (golang.org/x/crypto/bcrypt)
- **CORS**: gin-contrib/cors
- **Contenedores**: Docker y Docker Compose

## Arquitectura del proyecto

```
prog-back/
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── go.sum
├── main.go                    # Punto de entrada
├── .env.example
├── PLANNING-BACKEND.md
├── README.md
│
├── cmd/                       # Comandos adicionales (futuro)
│
├── internal/                  # Código privado de la aplicación
│   ├── controllers/           # Handlers HTTP (capa de presentación)
│   │   ├── auth_controller.go         ✅ Implementado
│   │   ├── building_controller.go     ✅ Implementado
│   │   ├── public_controller.go       ✅ Implementado
│   │   ├── reservation_controller.go  ✅ Implementado
│   │   ├── room_controller.go         ✅ Implementado
│   │   └── class_controller.go        🚧 PENDIENTE
│   │
│   ├── middleware/            # Middleware de autenticación y autorización
│   │   └── auth_middleware.go         ✅ Implementado (requiere modificación)
│   │
│   ├── models/                # Modelos de datos (GORM)
│   │   ├── user.go                    ✅ Implementado
│   │   ├── building.go                ✅ Implementado
│   │   ├── room.go                    ✅ Implementado
│   │   ├── reservation.go             ✅ Implementado (requiere modificación)
│   │   └── class.go                   🚧 PENDIENTE
│   │
│   ├── repositories/          # Capa de acceso a datos
│   │   ├── user_repo.go               ✅ Implementado
│   │   ├── building_repo.go           ✅ Implementado
│   │   ├── room_repo.go               ✅ Implementado
│   │   ├── reservation_repo.go        ✅ Implementado
│   │   └── class_repo.go              🚧 PENDIENTE
│   │
│   ├── routes/                # Definición de rutas
│   │   └── routes.go                  ✅ Implementado (requiere extensión)
│   │
│   ├── services/              # Lógica de negocio
│   │   ├── auth_service.go            ✅ Implementado (requiere modificación)
│   │   ├── building_service.go        ✅ Implementado
│   │   ├── room_service.go            ✅ Implementado
│   │   ├── reservation_service.go     ✅ Implementado (requiere modificación)
│   │   └── class_service.go           🚧 PENDIENTE
│   │
│   └── seeder/                # Datos iniciales
│       ├── seeder.go                  ✅ Implementado
│       └── sql/                       ✅ Archivos SQL de ejemplo
│
└── pkg/                       # Código reutilizable
    ├── config/                # Configuración de la aplicación
    │   └── config.go                  ✅ Implementado
    ├── db/                    # Conexión a base de datos
    │   └── db.go                      ✅ Implementado (requiere modificación)
    └── utils/                 # Utilidades
        └── hash.go                    ✅ Implementado
```

## Modelos de datos

### 1. User (✅ Implementado)

```go
type User struct {
    ID           uint           `gorm:"primaryKey" json:"id"`
    Name         string         `gorm:"not null" json:"name"`
    Email        string         `gorm:"uniqueIndex;not null" json:"email"`
    PasswordHash string         `gorm:"not null" json:"-"`
    Role         string         `gorm:"not null" json:"role"` // ADMIN|PROFESSOR|STUDENT
    IsConfirmed  bool           `gorm:"default:false" json:"is_confirmed"`
    CreatedAt    time.Time      `json:"created_at"`
    UpdatedAt    time.Time      `json:"updated_at"`
    DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
```

**Archivo**: `internal/models/user.go`

### 2. Building (✅ Implementado)

```go
type Building struct {
    ID        uint           `gorm:"primaryKey" json:"id"`
    Name      string         `gorm:"not null" json:"name"`
    Address   string         `json:"address"`
    Campus    string         `json:"campus"`
    CreatedAt time.Time      `json:"created_at"`
    UpdatedAt time.Time      `json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
```

**Archivo**: `internal/models/building.go`

### 3. Room (✅ Implementado)

```go
type Room struct {
    ID          uint           `gorm:"primaryKey" json:"id"`
    BuildingID  uint           `gorm:"not null" json:"building_id"`
    Building    *Building      `gorm:"foreignKey:BuildingID" json:"building,omitempty"`
    Name        string         `gorm:"not null" json:"name"`
    Capacity    int            `gorm:"not null" json:"capacity"`
    Resources   string         `gorm:"type:jsonb" json:"resources"` // JSONB
    Description string         `json:"description"`
    CreatedAt   time.Time      `json:"created_at"`
    UpdatedAt   time.Time      `json:"updated_at"`
    DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
```

**Archivo**: `internal/models/room.go`

### 4. Class (🚧 PENDIENTE - Nueva entidad)

```go
package models

import (
    "time"
    "gorm.io/gorm"
)

type Class struct {
    ID          uint           `gorm:"primaryKey" json:"id"`
    Name        string         `gorm:"not null" json:"name"`
    Description string         `json:"description"`
    Subject     string         `json:"subject"`
    ProfessorID uint           `gorm:"not null" json:"professor_id"`
    Professor   *User          `gorm:"foreignKey:ProfessorID" json:"professor,omitempty"`
    Students    []User         `gorm:"many2many:class_students;" json:"students,omitempty"`
    CreatedAt   time.Time      `json:"created_at"`
    UpdatedAt   time.Time      `json:"updated_at"`
    DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// Tabla intermedia para relación many-to-many
type ClassStudent struct {
    ClassID    uint      `gorm:"primaryKey" json:"class_id"`
    StudentID  uint      `gorm:"primaryKey" json:"student_id"`
    EnrolledAt time.Time `gorm:"autoCreateTime" json:"enrolled_at"`
}
```

**Crear archivo**: `internal/models/class.go`

**Relaciones**:

- Un profesor (User con role=PROFESSOR) puede tener muchas clases
- Una clase puede tener muchos estudiantes (Users con role=STUDENT)
- Relación many-to-many entre Class y User a través de class_students

### 5. Reservation (✅ Implementado, requiere modificación)

**Estado actual**:

```go
type Reservation struct {
    ID                  uint           `gorm:"primaryKey" json:"id"`
    RoomID              uint           `gorm:"not null" json:"room_id"`
    Room                *Room          `gorm:"foreignKey:RoomID" json:"room,omitempty"`
    UserID              uint           `gorm:"not null" json:"user_id"`
    User                *User          `gorm:"foreignKey:UserID" json:"user,omitempty"`
    StartTime           time.Time      `gorm:"not null" json:"start_time"`
    EndTime             time.Time      `gorm:"not null" json:"end_time"`
    Purpose             string         `json:"purpose"`
    EstimatedAttendees  int            `json:"estimated_attendees"`
    Status              string         `gorm:"default:'ACTIVE'" json:"status"` // ACTIVE|CANCELLED
    CreatedAt           time.Time      `json:"created_at"`
    UpdatedAt           time.Time      `json:"updated_at"`
    DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`
}
```

**Modificación necesaria** (añadir campos relacionados con Class):

```go
type Reservation struct {
    ID                  uint           `gorm:"primaryKey" json:"id"`
    RoomID              uint           `gorm:"not null" json:"room_id"`
    Room                *Room          `gorm:"foreignKey:RoomID" json:"room,omitempty"`
    UserID              uint           `gorm:"not null" json:"user_id"`
    User                *User          `gorm:"foreignKey:UserID" json:"user,omitempty"`
    ClassID             *uint          `json:"class_id,omitempty"` // 🚧 NUEVO: nullable
    Class               *Class         `gorm:"foreignKey:ClassID" json:"class,omitempty"` // 🚧 NUEVO
    StartTime           time.Time      `gorm:"not null" json:"start_time"`
    EndTime             time.Time      `gorm:"not null" json:"end_time"`
    Purpose             string         `json:"purpose"`
    EstimatedAttendees  int            `json:"estimated_attendees"`
    Status              string         `gorm:"default:'ACTIVE'" json:"status"`
    CreatedAt           time.Time      `json:"created_at"`
    UpdatedAt           time.Time      `json:"updated_at"`
    DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`
}
```

**Archivo**: `internal/models/reservation.go`

## Esquema relacional (PostgreSQL)

### Tablas existentes (✅ Implementadas via GORM AutoMigrate)

```sql
-- users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    is_confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- buildings
CREATE TABLE buildings (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    campus TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- rooms
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    building_id INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    resources JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- reservations (requiere migración para añadir class_id)
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    purpose TEXT,
    estimated_attendees INTEGER,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_reservations_room_start_end ON reservations(room_id, start_time, end_time);
```

### Tablas nuevas (🚧 PENDIENTE)

```sql
-- classes
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    professor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- class_students (tabla intermedia many-to-many)
CREATE TABLE class_students (
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (class_id, student_id)
);

CREATE INDEX idx_class_students_class ON class_students(class_id);
CREATE INDEX idx_class_students_student ON class_students(student_id);
```

### Migración para Reservation (🚧 PENDIENTE)

```sql
-- Añadir class_id a reservations
ALTER TABLE reservations ADD COLUMN class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL;
CREATE INDEX idx_reservations_class ON reservations(class_id);
```

## Asunciones razonables

- La app será un API REST escrito en Go (siguiendo la estructura actual del repositorio).
- La persistencia será relacional (Postgres recomendado), con migraciones gestionadas por una herramienta como `migrate` o `prisma`/`gorm` según preferencia.
- Autenticación basada en JWT con refresco opcional y roles (ROLE_ADMIN, ROLE_PROFESSOR, ROLE_STUDENT).
- Validación horaria por franjas (e.g., 30/60 minutos) y reserva por time-slot.

## API REST: Endpoints completos

### Autenticación (✅ Implementados con modificaciones necesarias)

#### POST /api/auth/register

**Estado**: ✅ Implementado

**Request**:

```json
{
  "name": "string",
  "email": "user@example.com",
  "password": "string",
  "role": "PROFESSOR|STUDENT"
}
```

**Response 201 Created**:

```json
{
  "id": 1,
  "email": "user@example.com"
}
```

**Response 400 Bad Request**:

```json
{
  "error": "validation message"
}
```

**Archivo**: `internal/controllers/auth_controller.go`

---

#### POST /api/auth/login

**Estado**: ✅ Implementado (requiere modificación menor)

**Estado actual**: Establece cookie HTTP-only y devuelve token en JSON

**Modificación necesaria**: Devolver también información del usuario

**Request**:

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response 200 OK actual**:

```json
{
  "access_token": "jwt_token",
  "token_type": "bearer"
}
```

**Response 200 OK propuesta** (🚧 modificar):

```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "PROFESSOR",
    "is_confirmed": true
  }
}
```

**Nota**: La cookie HTTP-only se establece automáticamente en la respuesta.

**Modificación en**: `internal/controllers/auth_controller.go`

---

#### GET /api/auth/me

**Estado**: ✅ Implementado

Requiere autenticación (cookie o header Authorization).

**Response 200 OK**:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "role": "PROFESSOR",
  "is_confirmed": true,
  "created_at": "2025-10-15T10:00:00Z",
  "updated_at": "2025-10-15T10:00:00Z"
}
```

---

#### POST /api/auth/logout

**Estado**: ✅ Implementado

Elimina la cookie HTTP-only.

**Response 200 OK**:

```json
{
  "message": "Logged out successfully"
}
```

---

### Usuarios (✅ Parcialmente implementado, requiere extensión)

#### PATCH /api/users/:id/confirm

**Estado**: ✅ Implementado

**Autorización**: Solo ADMIN

**Response 200 OK**:

```json
{
  "status": "confirmed"
}
```

---

#### GET /api/users

**Estado**: 🚧 PENDIENTE

**Autorización**: Solo ADMIN

**Query params**:

- `role` (opcional): ADMIN|PROFESSOR|STUDENT
- `is_confirmed` (opcional): true|false
- `page` (opcional): número de página (default: 1)
- `per_page` (opcional): elementos por página (default: 20)

**Response 200 OK**:

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "PROFESSOR",
      "is_confirmed": true,
      "created_at": "2025-10-15T10:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "per_page": 20,
  "total_pages": 3
}
```

**Crear**: `internal/controllers/user_controller.go` con función `ListUsers`

---

#### GET /api/users/:id

**Estado**: 🚧 PENDIENTE

**Autorización**: ADMIN o el propio usuario

**Response 200 OK**: Devuelve el objeto User completo

---

### Edificios (✅ Implementados)

#### GET /api/buildings

**Estado**: ✅ Implementado

**Response 200 OK**:

```json
[
  {
    "id": 1,
    "name": "Edificio A",
    "address": "Calle Principal 123",
    "campus": "Campus Central",
    "created_at": "2025-10-15T10:00:00Z",
    "updated_at": "2025-10-15T10:00:00Z"
  }
]
```

---

#### POST /api/buildings

**Estado**: ✅ Implementado

**Autorización**: Solo ADMIN

**Request**:

```json
{
  "name": "Edificio B",
  "address": "Av. Universitaria 456",
  "campus": "Campus Norte"
}
```

**Response 201 Created**: Objeto Building creado

---

#### GET /api/buildings/:id

**Estado**: ✅ Implementado

**Response 200 OK**: Objeto Building

---

### Aulas/Rooms (✅ Implementados)

#### GET /api/rooms

**Estado**: ✅ Implementado

**Query params** (opcionales):

- `building_id`: filtrar por edificio

**Response 200 OK**:

```json
[
  {
    "id": 1,
    "building_id": 1,
    "building": {
      "id": 1,
      "name": "Edificio A"
    },
    "name": "Aula 101",
    "capacity": 40,
    "resources": "[\"Proyector\", \"Pizarra digital\"]",
    "description": "Aula estándar",
    "created_at": "2025-10-15T10:00:00Z",
    "updated_at": "2025-10-15T10:00:00Z"
  }
]
```

---

#### POST /api/rooms

**Estado**: ✅ Implementado

**Autorización**: Solo ADMIN

**Request**:

```json
{
  "building_id": 1,
  "name": "Aula 102",
  "capacity": 50,
  "resources": "[\"Proyector\", \"WiFi\", \"Enchufes\"]",
  "description": "Aula multimedia"
}
```

**Response 201 Created**: Objeto Room creado

---

#### GET /api/rooms/:id

**Estado**: ✅ Implementado

**Response 200 OK**: Objeto Room con Building incluido

---

#### PATCH /api/rooms/:id

**Estado**: ✅ Implementado

**Autorización**: Solo ADMIN

**Request**: Campos parciales del Room

**Response 200 OK**: Objeto Room actualizado

---

#### DELETE /api/rooms/:id

**Estado**: ✅ Implementado

**Autorización**: Solo ADMIN

**Response 204 No Content**

---

### Clases/Classes (🚧 PENDIENTE - Nueva funcionalidad)

#### POST /api/classes

**Estado**: 🚧 PENDIENTE

**Autorización**: Solo PROFESSOR

**Request**:

```json
{
  "name": "Programación Avanzada",
  "description": "Curso de algoritmos y estructuras de datos",
  "subject": "Informática"
}
```

**Response 201 Created**:

```json
{
  "id": 1,
  "name": "Programación Avanzada",
  "description": "Curso de algoritmos y estructuras de datos",
  "subject": "Informática",
  "professor_id": 5,
  "professor": {
    "id": 5,
    "name": "Prof. García",
    "email": "garcia@university.edu"
  },
  "created_at": "2025-10-15T10:00:00Z",
  "updated_at": "2025-10-15T10:00:00Z"
}
```

**Implementar en**: `internal/controllers/class_controller.go` - función `CreateClass`

**Lógica**:

- Obtener professor_id del JWT (usuario autenticado)
- Validar que el usuario tenga rol PROFESSOR
- Crear clase asociada al profesor

---

#### GET /api/classes

**Estado**: 🚧 PENDIENTE

**Autorización**: Autenticado

**Query params**:

- `professor_id` (opcional): filtrar por profesor

**Comportamiento**:

- Si usuario es PROFESSOR: devuelve solo sus clases (a menos que sea admin)
- Si usuario es STUDENT: devuelve clases donde está inscrito
- Si usuario es ADMIN: devuelve todas o filtradas por professor_id

**Response 200 OK**:

```json
[
  {
    "id": 1,
    "name": "Programación Avanzada",
    "subject": "Informática",
    "professor_id": 5,
    "professor": {
      "id": 5,
      "name": "Prof. García"
    },
    "created_at": "2025-10-15T10:00:00Z"
  }
]
```

**Implementar en**: `internal/controllers/class_controller.go` - función `ListClasses`

---

#### GET /api/classes/:id

**Estado**: 🚧 PENDIENTE

**Autorización**: Autenticado

**Response 200 OK**:

```json
{
  "id": 1,
  "name": "Programación Avanzada",
  "description": "Curso de algoritmos y estructuras de datos",
  "subject": "Informática",
  "professor_id": 5,
  "professor": {
    "id": 5,
    "name": "Prof. García",
    "email": "garcia@university.edu",
    "role": "PROFESSOR"
  },
  "students": [
    {
      "id": 10,
      "name": "Alumno 1",
      "email": "alumno1@university.edu",
      "role": "STUDENT"
    }
  ],
  "created_at": "2025-10-15T10:00:00Z",
  "updated_at": "2025-10-15T10:00:00Z"
}
```

**Implementar en**: `internal/controllers/class_controller.go` - función `GetClass`

---

#### PATCH /api/classes/:id

**Estado**: 🚧 PENDIENTE

**Autorización**: Profesor dueño de la clase o ADMIN

**Request**: Campos parciales (name, description, subject)

**Response 200 OK**: Objeto Class actualizado

**Implementar en**: `internal/controllers/class_controller.go` - función `UpdateClass`

**Validación**: Verificar que el usuario autenticado sea el profesor de la clase o admin

---

#### DELETE /api/classes/:id

**Estado**: 🚧 PENDIENTE

**Autorización**: Profesor dueño de la clase o ADMIN

**Response 204 No Content**

**Implementar en**: `internal/controllers/class_controller.go` - función `DeleteClass`

**Nota**: Usar soft delete (DeletedAt)

---

#### POST /api/classes/:id/students

**Estado**: 🚧 PENDIENTE

**Autorización**: Profesor dueño de la clase

**Request**:

```json
{
  "student_id": 10
}
```

**Response 200 OK**:

```json
{
  "message": "Student added to class",
  "class_id": 1,
  "student_id": 10
}
```

**Validaciones**:

- student_id debe existir y tener role=STUDENT
- student debe estar confirmado (is_confirmed=true)
- No añadir duplicados

**Implementar en**: `internal/controllers/class_controller.go` - función `AddStudent`

---

#### DELETE /api/classes/:id/students/:student_id

**Estado**: 🚧 PENDIENTE

**Autorización**: Profesor dueño de la clase

**Response 200 OK**:

```json
{
  "message": "Student removed from class"
}
```

**Implementar en**: `internal/controllers/class_controller.go` - función `RemoveStudent`

---

#### GET /api/classes/:id/students

**Estado**: 🚧 PENDIENTE

**Autorización**: Autenticado (profesor de la clase, estudiante inscrito, o admin)

**Response 200 OK**:

```json
[
  {
    "id": 10,
    "name": "Alumno 1",
    "email": "alumno1@university.edu",
    "role": "STUDENT",
    "is_confirmed": true,
    "enrolled_at": "2025-10-14T15:30:00Z"
  }
]
```

**Implementar en**: `internal/controllers/class_controller.go` - función `ListClassStudents`

---

### Reservas/Reservations (✅ Implementadas, requieren extensión)

#### POST /api/reservations

**Estado**: ✅ Implementado (requiere modificación)

**Autorización**: Solo PROFESSOR

**Request actual**:

```json
{
  "room_id": 1,
  "start_time": "2025-10-20T09:00:00Z",
  "end_time": "2025-10-20T10:30:00Z",
  "purpose": "Clase de programación",
  "estimated_attendees": 35
}
```

**Request propuesto** (🚧 añadir class_id):

```json
{
  "room_id": 1,
  "class_id": 1,
  "start_time": "2025-10-20T09:00:00Z",
  "end_time": "2025-10-20T10:30:00Z",
  "purpose": "Clase de programación",
  "estimated_attendees": 35
}
```

**Validaciones existentes**:

- ✅ No solapamiento en la misma aula
- ✅ Capacidad del aula suficiente

**Validaciones a añadir**:

- Verificar que class_id pertenece al profesor autenticado (si se proporciona)
- Si class_id se proporciona, pre-rellenar estimated_attendees con cantidad de estudiantes

**Modificar**: `internal/controllers/reservation_controller.go` y `internal/services/reservation_service.go`

---

#### GET /api/reservations

**Estado**: ✅ Implementado (requiere extensión)

**Autorización**: Autenticado

**Query params actuales**:

- `room_id` (opcional)
- `user_id` (opcional)
- `date_from` (opcional)
- `date_to` (opcional)

**Query params a añadir** (🚧):

- `class_id` (opcional): filtrar por clase
- `building_id` (opcional): filtrar por edificio

**Response 200 OK**:

```json
[
  {
    "id": 1,
    "room_id": 1,
    "room": {
      "id": 1,
      "name": "Aula 101",
      "building": {
        "id": 1,
        "name": "Edificio A"
      }
    },
    "user_id": 5,
    "user": {
      "id": 5,
      "name": "Prof. García"
    },
    "class_id": 1,
    "class": {
      "id": 1,
      "name": "Programación Avanzada"
    },
    "start_time": "2025-10-20T09:00:00Z",
    "end_time": "2025-10-20T10:30:00Z",
    "purpose": "Clase de programación",
    "estimated_attendees": 35,
    "status": "ACTIVE",
    "created_at": "2025-10-15T10:00:00Z"
  }
]
```

**Modificar**: `internal/repositories/reservation_repo.go` para añadir filtros

---

#### GET /api/reservations/:id

**Estado**: ✅ Implementado

**Response 200 OK**: Objeto Reservation completo con relaciones (Room, User, Class si existe)

---

#### PATCH /api/reservations/:id

**Estado**: ✅ Implementado (solo para cancelar)

**Autorización**: Solo ADMIN (actualmente)

**Request** (cancelación):

```json
{
  "status": "CANCELLED"
}
```

**Mejora sugerida**: Permitir que el profesor dueño también pueda cancelar

---

#### DELETE /api/reservations/:id

**Estado**: ✅ Implementado

**Autorización**: Solo ADMIN

**Response 204 No Content**

**Mejora sugerida**: Permitir que el profesor dueño también pueda eliminar

---

### Endpoints públicos (✅ Implementado)

#### GET /api/public/reservations

**Estado**: ✅ Implementado

**Sin autenticación requerida**

**Query params**: Similar a GET /api/reservations (filtros por room, building, date)

**Response**: Lista de reservas sin información sensible (omitir datos personales del profesor)

---

## Alcance mínimo (MVP)

Incluye lo mínimo necesario para permitir uso real:

1. Autenticación y autorización

   - Registro de usuario (email, nombre, contraseña, rol declarado — profesor/alumno).
   - Endpoint para que admin confirme cuentas.
   - Login (devuelve JWT con claims de rol y user_id).
   - Middleware para proteger endpoints por rol.

2. Modelado y gestión de espacio

   - CRUD edificios (solo admin).
   - CRUD aulas (solo admin): nombre, edificio_id, capacidad_maxima, recursos (pizarra, proyector, enchufes), ubicación (opcional).

3. Reservas

   - Crear reserva (solo profesores): aula_id, start_time, end_time, purpose, estimated_attendees.
   - Validaciones:
     - No solapamiento de reservas para la misma aula.
     - estimated_attendees ≤ capacidad_maxima.
     - Rango mínimo/máximo de duración configurable.
   - Listar reservas por aula, por profesor, por edificio y por rango de fechas.
   - Cancelar reserva (profesor que creó la reserva o admin).

4. Operaciones administrativas
   - Confirmar cuentas nuevas.
   - Visualizar todas las reservas y usuarios.

Requisitos funcionales (detallados)---------------------------------

1. Usuarios

   - Campos: id, nombre, email (único), password_hash, role (ADMIN|PROFESSOR|STUDENT), is_confirmed (bool), created_at, updated_at.
   - Flujos:
     - Registro: crea usuario con is_confirmed=false; notifica al admin (por ahora correo simulado o registro en DB).
     - Confirmación por admin: cambia is_confirmed=true.

2. Autorización

   - Endpoints protegidos requieren JWT válido con claim `sub` (user_id) y `role`.
   - Middleware `RequireRole(role)` y `RequireAuthentication`.

3. Edificios y aulas

   - Edificio: id, nombre, dirección, campus (opcional), created_at, updated_at.
   - Aula: id, nombre, edificio_id, capacidad_maxima (int), recursos (JSON array o texto), descripcion, created_at, updated_at.

4. Reservas
   - Reserva: id, aula_id, user_id (profesor), start_time (timestamp), end_time (timestamp), purpose (string), estimated_attendees (int), status (ACTIVE|CANCELLED), created_at, updated_at.
   - Reglas de negocio:
     - Las reservas no pueden solaparse en la misma aula (validar start/end exclusividad).
     - Solo profesores pueden crear reservas.
     - El admin puede crear, modificar o cancelar cualquier reserva.

## Implementaciones específicas necesarias

### 1. Middleware de autenticación mejorado (🚧 Modificación)

**Archivo**: `internal/middleware/auth_middleware.go`

**Estado actual**: Lee JWT solo desde cookie

**Modificación necesaria**: Soporte dual (cookie O header Authorization)

```go
func RequireAuthentication() gin.HandlerFunc {
    return func(c *gin.Context) {
        var token string

        // Primero intentar obtener de cookie
        cookieToken, err := c.Cookie("access_token")
        if err == nil && cookieToken != "" {
            token = cookieToken
        } else {
            // Si no hay cookie, intentar con header Authorization
            authHeader := c.GetHeader("Authorization")
            if authHeader == "" {
                c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
                c.Abort()
                return
            }
            // Extraer token del header "Bearer <token>"
            parts := strings.Split(authHeader, " ")
            if len(parts) != 2 || parts[0] != "Bearer" {
                c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
                c.Abort()
                return
            }
            token = parts[1]
        }

        // Validar JWT (código existente)
        secret := os.Getenv("JWT_SECRET")
        if secret == "" {
            secret = "dev_secret"
        }

        claims := jwt.MapClaims{}
        parsedToken, err := jwt.ParseWithClaims(token, claims, func(t *jwt.Token) (interface{}, error) {
            return []byte(secret), nil
        })

        if err != nil || !parsedToken.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // Extraer claims
        userID := uint(claims["sub"].(float64))
        role := claims["role"].(string)

        // Guardar en contexto
        c.Set("userID", userID)
        c.Set("role", role)

        c.Next()
    }
}
```

**Impacto**: Permite que el frontend use tanto cookies (navegador) como headers (requests desde servidores/testing)

---

### 2. CORS mejorado (🚧 Modificación)

**Archivo**: `main.go`

**Estado actual**: Probablemente sin CORS configurado o básico

**Configuración necesaria**:

```go
import (
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    // Configurar CORS para permitir cookies
    corsConfig := cors.DefaultConfig()
    corsConfig.AllowOrigins = []string{
        "http://localhost:3000",  // Frontend en desarrollo
        // Añadir URLs de producción aquí
    }
    corsConfig.AllowCredentials = true
    corsConfig.AllowHeaders = []string{
        "Origin",
        "Content-Type",
        "Accept",
        "Authorization",
    }
    corsConfig.AllowMethods = []string{
        "GET",
        "POST",
        "PATCH",
        "DELETE",
        "OPTIONS",
    }

    r.Use(cors.New(corsConfig))

    // ... resto de la configuración
}
```

**Dependencia**: Asegurarse de tener `github.com/gin-contrib/cors` en go.mod

---

### 3. Login mejorado (🚧 Modificación menor)

**Archivo**: `internal/controllers/auth_controller.go`

**Función**: `Login`

**Modificación**: Devolver información del usuario junto con el token

```go
func Login(c *gin.Context) {
    var req loginReq
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    token, user, err := authService.LoginWithUser(req.Email, req.Password)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    // Establecer cookie HTTP-only
    c.SetCookie(
        "access_token",  // nombre
        token,           // valor
        60*60*24*7,      // maxAge (7 días en segundos)
        "/",             // path
        "",              // domain
        false,           // secure (true en producción con HTTPS)
        true,            // httpOnly
    )

    c.JSON(http.StatusOK, gin.H{
        "access_token": token,
        "token_type":   "bearer",
        "user":         user, // Nuevo: devolver usuario
    })
}
```

**Modificación en service**: `internal/services/auth_service.go`

```go
// Añadir nueva función o modificar Login
func (s *AuthService) LoginWithUser(email, password string) (string, *models.User, error) {
    u, err := s.repo.GetByEmail(email)
    if err != nil {
        return "", nil, err
    }
    if !utils.CheckPasswordHash(password, u.PasswordHash) {
        return "", nil, errors.New("invalid credentials")
    }
    if !u.IsConfirmed {
        return "", nil, errors.New("account not confirmed")
    }

    // Generar JWT (código existente)
    token, err := s.generateJWT(u)
    if err != nil {
        return "", nil, err
    }

    return token, u, nil
}
```

---

### 4. Implementación completa de Classes (🚧 NUEVO)

#### A. Modelo (crear archivo)

**Archivo**: `internal/models/class.go`

```go
package models

import (
    "time"
    "gorm.io/gorm"
)

type Class struct {
    ID          uint           `gorm:"primaryKey" json:"id"`
    Name        string         `gorm:"not null" json:"name"`
    Description string         `json:"description"`
    Subject     string         `json:"subject"`
    ProfessorID uint           `gorm:"not null" json:"professor_id"`
    Professor   *User          `gorm:"foreignKey:ProfessorID" json:"professor,omitempty"`
    Students    []User         `gorm:"many2many:class_students;" json:"students,omitempty"`
    CreatedAt   time.Time      `json:"created_at"`
    UpdatedAt   time.Time      `json:"updated_at"`
    DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type ClassStudent struct {
    ClassID    uint      `gorm:"primaryKey" json:"class_id"`
    StudentID  uint      `gorm:"primaryKey" json:"student_id"`
    EnrolledAt time.Time `gorm:"autoCreateTime" json:"enrolled_at"`
}
```

---

#### B. Repository (crear archivo)

**Archivo**: `internal/repositories/class_repo.go`

```go
package repositories

import (
    "programcion-backend/internal/models"
    "programcion-backend/pkg/db"
)

type ClassRepository struct{}

func NewClassRepository() *ClassRepository {
    return &ClassRepository{}
}

func (r *ClassRepository) Create(class *models.Class) error {
    return db.DB.Create(class).Error
}

func (r *ClassRepository) FindByID(id uint) (*models.Class, error) {
    var class models.Class
    err := db.DB.Preload("Professor").Preload("Students").First(&class, id).Error
    return &class, err
}

func (r *ClassRepository) FindByProfessorID(professorID uint) ([]models.Class, error) {
    var classes []models.Class
    err := db.DB.Where("professor_id = ?", professorID).Preload("Students").Find(&classes).Error
    return classes, err
}

func (r *ClassRepository) FindAll() ([]models.Class, error) {
    var classes []models.Class
    err := db.DB.Preload("Professor").Find(&classes).Error
    return classes, err
}

func (r *ClassRepository) Update(class *models.Class) error {
    return db.DB.Save(class).Error
}

func (r *ClassRepository) Delete(id uint) error {
    return db.DB.Delete(&models.Class{}, id).Error
}

func (r *ClassRepository) AddStudent(classID, studentID uint) error {
    return db.DB.Exec(
        "INSERT INTO class_students (class_id, student_id) VALUES (?, ?) ON CONFLICT DO NOTHING",
        classID, studentID,
    ).Error
}

func (r *ClassRepository) RemoveStudent(classID, studentID uint) error {
    return db.DB.Exec(
        "DELETE FROM class_students WHERE class_id = ? AND student_id = ?",
        classID, studentID,
    ).Error
}

func (r *ClassRepository) GetStudents(classID uint) ([]models.User, error) {
    var students []models.User
    err := db.DB.
        Joins("JOIN class_students ON users.id = class_students.student_id").
        Where("class_students.class_id = ?", classID).
        Find(&students).Error
    return students, err
}
```

---

#### C. Service (crear archivo)

**Archivo**: `internal/services/class_service.go`

```go
package services

import (
    "errors"
    "programcion-backend/internal/models"
    "programcion-backend/internal/repositories"
)

type ClassService struct {
    repo     *repositories.ClassRepository
    userRepo *repositories.UserRepository
}

func NewClassService() *ClassService {
    return &ClassService{
        repo:     repositories.NewClassRepository(),
        userRepo: repositories.NewUserRepository(),
    }
}

func (s *ClassService) CreateClass(name, description, subject string, professorID uint) (*models.Class, error) {
    class := &models.Class{
        Name:        name,
        Description: description,
        Subject:     subject,
        ProfessorID: professorID,
    }
    if err := s.repo.Create(class); err != nil {
        return nil, err
    }
    // Recargar con profesor incluido
    return s.repo.FindByID(class.ID)
}

func (s *ClassService) GetClass(id uint) (*models.Class, error) {
    return s.repo.FindByID(id)
}

func (s *ClassService) GetClassesByProfessor(professorID uint) ([]models.Class, error) {
    return s.repo.FindByProfessorID(professorID)
}

func (s *ClassService) GetAllClasses() ([]models.Class, error) {
    return s.repo.FindAll()
}

func (s *ClassService) UpdateClass(id uint, name, description, subject string) (*models.Class, error) {
    class, err := s.repo.FindByID(id)
    if err != nil {
        return nil, err
    }

    if name != "" {
        class.Name = name
    }
    if description != "" {
        class.Description = description
    }
    if subject != "" {
        class.Subject = subject
    }

    if err := s.repo.Update(class); err != nil {
        return nil, err
    }

    return class, nil
}

func (s *ClassService) DeleteClass(id uint) error {
    return s.repo.Delete(id)
}

func (s *ClassService) AddStudent(classID, studentID uint) error {
    // Verificar que el estudiante existe y es STUDENT
    student, err := s.userRepo.FindByID(studentID)
    if err != nil {
        return errors.New("student not found")
    }
    if student.Role != "STUDENT" {
        return errors.New("user is not a student")
    }
    if !student.IsConfirmed {
        return errors.New("student account not confirmed")
    }

    return s.repo.AddStudent(classID, studentID)
}

func (s *ClassService) RemoveStudent(classID, studentID uint) error {
    return s.repo.RemoveStudent(classID, studentID)
}

func (s *ClassService) GetClassStudents(classID uint) ([]models.User, error) {
    return s.repo.GetStudents(classID)
}

// Verificar si un usuario es dueño de una clase
func (s *ClassService) IsOwner(classID, userID uint) (bool, error) {
    class, err := s.repo.FindByID(classID)
    if err != nil {
        return false, err
    }
    return class.ProfessorID == userID, nil
}
```

---

#### D. Controller (crear archivo)

**Archivo**: `internal/controllers/class_controller.go`

```go
package controllers

import (
    "net/http"
    "strconv"
    "programcion-backend/internal/services"
    "github.com/gin-gonic/gin"
)

var classService = services.NewClassService()

type createClassReq struct {
    Name        string `json:"name" binding:"required,min=3"`
    Description string `json:"description"`
    Subject     string `json:"subject" binding:"required,min=2"`
}

func CreateClass(c *gin.Context) {
    var req createClassReq
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    professorID := c.GetUint("userID")

    class, err := classService.CreateClass(req.Name, req.Description, req.Subject, professorID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, class)
}

func ListClasses(c *gin.Context) {
    userID := c.GetUint("userID")
    role := c.GetString("role")

    var classes []models.Class
    var err error

    // Si es profesor, solo sus clases (a menos que se especifique professor_id)
    if role == "PROFESSOR" {
        professorIDParam := c.Query("professor_id")
        if professorIDParam == "" || role != "ADMIN" {
            classes, err = classService.GetClassesByProfessor(userID)
        } else {
            pid, _ := strconv.ParseUint(professorIDParam, 10, 32)
            classes, err = classService.GetClassesByProfessor(uint(pid))
        }
    } else if role == "ADMIN" {
        professorIDParam := c.Query("professor_id")
        if professorIDParam != "" {
            pid, _ := strconv.ParseUint(professorIDParam, 10, 32)
            classes, err = classService.GetClassesByProfessor(uint(pid))
        } else {
            classes, err = classService.GetAllClasses()
        }
    } else {
        // STUDENT: devolver clases donde está inscrito (implementar lógica)
        classes = []models.Class{}
    }

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, classes)
}

func GetClass(c *gin.Context) {
    id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
    class, err := classService.GetClass(uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Class not found"})
        return
    }
    c.JSON(http.StatusOK, class)
}

type updateClassReq struct {
    Name        string `json:"name"`
    Description string `json:"description"`
    Subject     string `json:"subject"`
}

func UpdateClass(c *gin.Context) {
    id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
    userID := c.GetUint("userID")
    role := c.GetString("role")

    // Verificar ownership si no es admin
    if role != "ADMIN" {
        isOwner, err := classService.IsOwner(uint(id), userID)
        if err != nil || !isOwner {
            c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
            return
        }
    }

    var req updateClassReq
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    class, err := classService.UpdateClass(uint(id), req.Name, req.Description, req.Subject)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, class)
}

func DeleteClass(c *gin.Context) {
    id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
    userID := c.GetUint("userID")
    role := c.GetString("role")

    // Verificar ownership si no es admin
    if role != "ADMIN" {
        isOwner, err := classService.IsOwner(uint(id), userID)
        if err != nil || !isOwner {
            c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
            return
        }
    }

    if err := classService.DeleteClass(uint(id)); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.Status(http.StatusNoContent)
}

type addStudentReq struct {
    StudentID uint `json:"student_id" binding:"required"`
}

func AddStudent(c *gin.Context) {
    classID, _ := strconv.ParseUint(c.Param("id"), 10, 32)
    userID := c.GetUint("userID")
    role := c.GetString("role")

    // Verificar ownership si no es admin
    if role != "ADMIN" {
        isOwner, err := classService.IsOwner(uint(classID), userID)
        if err != nil || !isOwner {
            c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
            return
        }
    }

    var req addStudentReq
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := classService.AddStudent(uint(classID), req.StudentID); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":    "Student added to class",
        "class_id":   classID,
        "student_id": req.StudentID,
    })
}

func RemoveStudent(c *gin.Context) {
    classID, _ := strconv.ParseUint(c.Param("id"), 10, 32)
    studentID, _ := strconv.ParseUint(c.Param("student_id"), 10, 32)
    userID := c.GetUint("userID")
    role := c.GetString("role")

    // Verificar ownership si no es admin
    if role != "ADMIN" {
        isOwner, err := classService.IsOwner(uint(classID), userID)
        if err != nil || !isOwner {
            c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
            return
        }
    }

    if err := classService.RemoveStudent(uint(classID), uint(studentID)); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Student removed from class"})
}

func ListClassStudents(c *gin.Context) {
    classID, _ := strconv.ParseUint(c.Param("id"), 10, 32)

    students, err := classService.GetClassStudents(uint(classID))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, students)
}
```

---

#### E. Rutas (modificar archivo existente)

**Archivo**: `internal/routes/routes.go`

**Añadir**:

```go
// Dentro de la función SetupRoutes, después de las rutas de reservations

classes := api.Group("/classes")
{
    classes.POST("", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.CreateClass)
    classes.GET("", middleware.RequireAuthentication(), controllers.ListClasses)
    classes.GET(":id", middleware.RequireAuthentication(), controllers.GetClass)
    classes.PATCH(":id", middleware.RequireAuthentication(), controllers.UpdateClass)
    classes.DELETE(":id", middleware.RequireAuthentication(), controllers.DeleteClass)

    // Gestión de estudiantes
    classes.POST(":id/students", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.AddStudent)
    classes.DELETE(":id/students/:student_id", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.RemoveStudent)
    classes.GET(":id/students", middleware.RequireAuthentication(), controllers.ListClassStudents)
}
```

---

### 5. Actualización de AutoMigrate (🚧 Modificación)

**Archivo**: `pkg/db/db.go`

**Añadir** los nuevos modelos al AutoMigrate:

```go
db.AutoMigrate(
    &models.User{},
    &models.Building{},
    &models.Room{},
    &models.Class{},        // NUEVO
    &models.ClassStudent{}, // NUEVO
    &models.Reservation{},
)
```

---

### 6. Extensión de Reservation (🚧 Modificación)

**Archivo**: `internal/models/reservation.go`

**Añadir campos**:

```go
ClassID *uint  `json:"class_id,omitempty"`
Class   *Class `gorm:"foreignKey:ClassID" json:"class,omitempty"`
```

---

### 7. Listar usuarios con filtros (🚧 NUEVO)

**Archivo**: `internal/repositories/user_repo.go`

**Añadir función**:

```go
func (r *UserRepository) FindWithFilters(role string, isConfirmed *bool) ([]models.User, error) {
    query := db.DB.Model(&models.User{})

    if role != "" {
        query = query.Where("role = ?", role)
    }

    if isConfirmed != nil {
        query = query.Where("is_confirmed = ?", *isConfirmed)
    }

    var users []models.User
    err := query.Find(&users).Error
    return users, err
}
```

**Crear archivo**: `internal/controllers/user_controller.go`

```go
package controllers

import (
    "net/http"
    "strconv"
    "programcion-backend/internal/services"
    "github.com/gin-gonic/gin"
)

func ListUsers(c *gin.Context) {
    role := c.Query("role")
    isConfirmedStr := c.Query("is_confirmed")

    var isConfirmed *bool
    if isConfirmedStr != "" {
        val := isConfirmedStr == "true"
        isConfirmed = &val
    }

    users, err := userService.GetUsersWithFilters(role, isConfirmed)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, users)
}
```

**Añadir ruta** en `internal/routes/routes.go`:

```go
users := api.Group("/users")
{
    users.GET("", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.ListUsers) // NUEVO
    users.PATCH(":id/confirm", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.ConfirmUser)
}
```

---

- Seguridad:
  - Almacenar contraseñas con bcrypt/argon2.
  - Rate-limiting en endpoints de autenticación.
  - Validación y sanitización de entradas.
- Escalabilidad:
  - Paginación en listados.
  - Índices en campos usados en filtros (room_id, user_id, start_time).
- Observabilidad:
  - Logging estructurado y trazas básicas.
  - Métricas (requests, latencia, errores).
- Configuración:
  - Variables de entorno para DB, JWT secrets, puertos, políticas de CORS.

## Casos de uso y flujos de usuario (básicos)

1. Registro de alumno

   - Alumno envía POST /auth/register.
   - Admin revisa lista de usuarios y confirma.
   - Alumno hace login.

2. Profesor reserva aula

   - Profesor verifica disponibilidad (GET /rooms/{id}/availability o GET /reservations?room_id=...&date=...).
   - Crea reserva POST /reservations.
   - Sistema valida solapamientos y capacidad.
   - Reserva confirmada y visible en listados.

3. Admin crea aula
   - Admin crea edificio y aula con capacidad y recursos.

## Despliegue y arranque (Postgres + GORM, Docker)

Requisitos y conducta de arranque:

- La base de datos será PostgreSQL y la aplicación usará GORM como ORM.
- El proyecto se puede levantar con Docker Compose; incluye servicios `db` (Postgres) y `backend` (la aplicación Go).
- Al iniciar, la aplicación ejecutará AutoMigrate para crear/actualizar las tablas esenciales y luego ejecutará un seeder que creará un usuario administrador si no existe.
- Las credenciales del administrador se leen de variables de entorno (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`). Si no existen, el seeder no crea ningún usuario.

Archivos añadidos/esperados en el repo (implementación mínima):

- `Dockerfile` — imagen multi-stage para compilar y empaquetar la app.
- `docker-compose.yml` — levanta `db` (Postgres) y `backend`.
- `.env.example` — ejemplo de variables de entorno incluidas: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSLMODE, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME.
- `pkg/db/db.go` — inicializa GORM con Postgres y ejecuta AutoMigrate para modelos: User, Building, Room, Reservation.
- `internal/models/*.go` — modelos GORM para las entidades esenciales.
- `internal/seeder/seeder.go` — seeder que crea el admin inicial si no existe.
- `main.go` — carga configuración, inicializa la DB, ejecuta el seeder y arranca las rutas.

Variables de entorno necesarias (mínimo para levantar con admin creado):

- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSLMODE
- ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME

Comportamiento del seeder:

- Si `ADMIN_EMAIL` y `ADMIN_PASSWORD` están presentes cuando la app arranca, el seeder buscará un usuario con ese email.
- Si no existe, creará el usuario con rol `ADMIN`, `is_confirmed=true` y la contraseña hasheada con bcrypt.
- Si el usuario ya existe no hará cambios.

Cómo levantar localmente (ejemplo):

1. Copiar `.env.example` a `.env` y editar las variables (por ejemplo, dejar credenciales del admin).
2. Ejecutar `docker compose up --build`.
3. La app escuchará en el puerto `8080` y la base de datos en `5432`.

## Criterios de aceptación (MVP)

- Un administrador puede confirmar usuarios nuevos.
- Profesores autenticados pueden crear reservas que no se solapen y no excedan la capacidad.
- Administrador puede crear/editar/eliminar aulas y ver reservas.
- Endpoints documentados (README o Swagger/OpenAPI).

## Riesgos y mitigaciones

- Solapamientos y condiciones de carrera: usar transacciones DB y bloqueo optimista/consultas de exclusividad.
- Validación horaria compleja (huso horario): usar timestamps con zona (UTC) y convertir en cliente.
- Gestión de roles: testear exhaustivamente las políticas de autorización.

## Pruebas recomendadas

- Unitarias: validación de modelos, lógica de solapamiento, autorización.
- Integración: flujos de auth/registro/confirmación y reserva end-to-end contra una DB de prueba.
- Tests de contrato: OpenAPI/Swagger para validar respuestas.

## Siguientes pasos técnicos inmediatos

1. Elegir y documentar la base de datos (Postgres recomendado) y herramienta de migraciones.
2. Crear migraciones iniciales para `users`, `buildings`, `rooms`, `reservations`.
3. Especificar los endpoints en OpenAPI (archivo `openapi.yaml` o `swagger.json`).
4. Implementar autenticación y middleware básico.

## Contrato API detallado (payloads y respuestas)

Autenticación

- POST /api/v1/auth/register

  - Request JSON:
    {
    "name": "string",
    "email": "user@example.com",
    "password": "string",
    "role": "PROFESSOR|STUDENT"
    }
  - Responses:
    - 201 Created: {"id": number, "email": "user@example.com"}
    - 400 Bad Request: {"error": "validation message"}

- POST /api/v1/auth/login
  - Request JSON: {"email":"user@example.com","password":"string"}
  - Responses:
    - 200 OK: {"access_token":"jwt","token_type":"bearer"}
    - 401 Unauthorized: {"error":"invalid credentials"}

Usuarios

- PATCH /api/v1/users/{id}/confirm (admin)
  - Responses: 200 OK {"status":"confirmed"} or 404/403.

Edificios

- GET /api/v1/buildings
  - 200 OK: [ {"id":1,"name":"Edificio A","address":"..."}, ... ]
- POST /api/v1/buildings (admin)
  - Request: {"name":"string","address":"string","campus":"string"}
  - 201 Created: el objeto creado.

Aulas

- GET /api/v1/rooms
  - 200 OK: [ {"id":1,"building_id":1,"name":"Aula 101","capacity":40,...}, ... ]
- POST /api/v1/rooms (admin)
  - Request: {"building_id":1,"name":"Aula 101","capacity":40,"resources":"[...json]","description":""}
  - 201 Created: el objeto creado.

Reservas

- POST /api/v1/reservations (professor)

  - Request JSON:
    {
    "room_id": 1,
    "start_time": "2025-10-15T09:00:00Z",
    "end_time": "2025-10-15T10:00:00Z",
    "purpose": "Clase de programación",
    "estimated_attendees": 35
    }
  - Responses:
    - 201 Created: objeto de reserva
    - 400 Bad Request: {"error":"reason"} (ej. solapamiento o capacidad excedida)

- GET /api/v1/reservations?room_id=&user_id=&date_from=&date_to=

  - 200 OK: lista de reservas filtradas

- PATCH /api/v1/reservations/{id} (owner|admin)
  - Usado para cancelar o modificar; si cancelación: {"status":"CANCELLED"}

Formato de errores (sugerido)

- Responder siempre con JSON: {"error":"message"} o en caso de validación: {"errors": {"field":"message"}}

## Migraciones SQL iniciales (Postgres)

-- 1_create_users.sql
CREATE TABLE users (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
password_hash TEXT NOT NULL,
role TEXT NOT NULL,
is_confirmed BOOLEAN DEFAULT false,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2_create_buildings.sql
CREATE TABLE buildings (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
address TEXT,
campus TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3_create_rooms.sql
CREATE TABLE rooms (
id SERIAL PRIMARY KEY,
building_id INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
name TEXT NOT NULL,
capacity INTEGER NOT NULL,
resources JSONB,
description TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4_create_reservations.sql
CREATE TABLE reservations (
id SERIAL PRIMARY KEY,
room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
start_time TIMESTAMP WITH TIME ZONE NOT NULL,
end_time TIMESTAMP WITH TIME ZONE NOT NULL,
purpose TEXT,
estimated_attendees INTEGER,
status TEXT NOT NULL DEFAULT 'ACTIVE',
created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices sugeridos
CREATE INDEX idx_reservations_room_start_end ON reservations(room_id, start_time, end_time);

## Variables de entorno (completas)

- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSLMODE
- ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
- JWT_SECRET (requerido en producción)
- APP_PORT (por defecto 8080)
- LOG_LEVEL (info|debug|error)

## Pruebas y CI recomendados

- Unitarias:
  - Servicios: validación de solapamiento, capacidad, reglas de negocio de reservas.
  - Middleware: parsing y verificación de JWT, control de roles.
- Integración:
  - Tests end-to-end contra una DB de prueba (puede usarse una imagen Postgres en CI) cubriendo: registro, confirmación, login, creación de edificio/aula, creación de reserva.
- CI pipeline (ejemplo):
  - go test ./... (unit+integration)
  - go vet && golangci-lint run
  - build docker image
  - (opcional) ejecutar tests de integración en contenedor con Postgres

## Concurrencia, transacciones y condiciones de carrera

- Validaciones de solapamiento deben protegerse con transacciones o consultas atómicas. Estrategias:
  - Usar una transacción SERIALIZABLE o SELECT FOR UPDATE sobre la fila de `rooms` o usar un lock por recurso antes de insertar la reserva.
  - Validar solapamiento dentro de la misma transacción que crea la reserva.
  - En cargas altas, considerar un sistema de colas o lock distribuido.

## Ejemplos de uso rápidos (curl)

- Registrar profesor:
  curl -X POST http://localhost:8080/api/v1/auth/register -H "Content-Type: application/json" -d '{"name":"Prof","email":"prof@example.com","password":"pass123","role":"PROFESSOR"}'
- Login:
  curl -X POST http://localhost:8080/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"prof@example.com","password":"pass123"}'
- Crear edificio (admin):
  curl -X POST http://localhost:8080/api/v1/buildings -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"name":"Edificio A"}'

## Resumen de archivos a crear/modificar

### 📁 Crear (nuevos archivos)

1. `internal/models/class.go` - Modelos Class y ClassStudent
2. `internal/repositories/class_repo.go` - Repository de clases
3. `internal/services/class_service.go` - Service de clases
4. `internal/controllers/class_controller.go` - Controller de clases
5. `internal/controllers/user_controller.go` - Controller de usuarios (ListUsers)

### 📝 Modificar (archivos existentes)

1. `internal/models/reservation.go` - Añadir ClassID y Class
2. `internal/middleware/auth_middleware.go` - Soporte dual cookie+header
3. `internal/controllers/auth_controller.go` - Login devuelve usuario
4. `internal/services/auth_service.go` - Añadir LoginWithUser
5. `internal/routes/routes.go` - Añadir rutas de classes y users
6. `internal/repositories/user_repo.go` - Añadir FindWithFilters
7. `pkg/db/db.go` - Actualizar AutoMigrate con Class y ClassStudent
8. `main.go` - Configurar CORS
9. `go.mod` - Añadir dependency `github.com/gin-contrib/cors` si falta

## Checklist de implementación pendiente

### 🔴 Alta prioridad (para MVP funcional)

- [ ] **Modelo Class**
  - [ ] Crear `internal/models/class.go`
  - [ ] Definir struct Class y ClassStudent
- [ ] **Repository Class**
  - [ ] Crear `internal/repositories/class_repo.go`
  - [ ] Implementar métodos CRUD y gestión de estudiantes
- [ ] **Service Class**
  - [ ] Crear `internal/services/class_service.go`
  - [ ] Lógica de negocio para clases
- [ ] **Controller Class**
  - [ ] Crear `internal/controllers/class_controller.go`
  - [ ] Implementar todos los endpoints de clases
- [ ] **Rutas de Class**
  - [ ] Añadir rutas en `internal/routes/routes.go`
- [ ] **Modificar Reservation model**
  - [ ] Añadir campos ClassID y Class en `internal/models/reservation.go`
- [ ] **Actualizar AutoMigrate**
  - [ ] Añadir Class y ClassStudent en `pkg/db/db.go`
- [ ] **Login mejorado**
  - [ ] Modificar `auth_controller.go` para devolver usuario
  - [ ] Añadir método `LoginWithUser` en `auth_service.go`
- [ ] **Middleware dual auth**
  - [ ] Modificar `auth_middleware.go` para soportar cookie + header
- [ ] **CORS configurado**
  - [ ] Añadir configuración CORS en `main.go`
  - [ ] Instalar `github.com/gin-contrib/cors` si no existe
- [ ] **Endpoint listar usuarios**
  - [ ] Crear `internal/controllers/user_controller.go`
  - [ ] Implementar `ListUsers` con filtros
  - [ ] Añadir función `FindWithFilters` en `user_repo.go`
  - [ ] Añadir ruta GET /api/users

### 🟡 Media prioridad (mejoras post-MVP)

- [ ] **Paginación**
  - [ ] Implementar paginación en listados de usuarios, clases, reservas
- [ ] **Filtros avanzados en reservas**
  - [ ] Añadir filtro por class_id
  - [ ] Añadir filtro por building_id
- [ ] **Permisos mejorados**
  - [ ] Permitir que profesor cancele sus propias reservas
  - [ ] Validar ownership en más operaciones
- [ ] **Logging estructurado**
  - [ ] Implementar logger (logrus o zap)
  - [ ] Logs de operaciones críticas

### 🟢 Baja prioridad (futuro)

- [ ] **Tests automatizados**
  - [ ] Tests unitarios de services
  - [ ] Tests de integración de endpoints
- [ ] **Rate limiting**
  - [ ] Implementar rate limiting en auth endpoints
- [ ] **Swagger/OpenAPI**
  - [ ] Documentar API con Swagger
- [ ] **Métricas y observabilidad**
  - [ ] Prometheus metrics
  - [ ] Health check endpoint mejorado

## Notas finales

Este documento actualizado refleja:

1. **✅ Estado actual**: Todo lo que ya está implementado y funcional
2. **🚧 Pendiente**: Las nuevas funcionalidades necesarias para complementar el frontend
3. **📝 Guía detallada**: Código específico para cada implementación pendiente
4. **📋 Prioridades**: Checklist ordenado por importancia

El objetivo es que en un nuevo contexto puedas:

- ✓ Entender rápidamente qué existe y cómo funciona
- ✓ Identificar exactamente qué falta por implementar
- ✓ Tener el código específico para las modificaciones necesarias
- ✓ Seguir un orden lógico de implementación

**Próximos pasos inmediatos**:

1. Implementar modelo, repository, service y controller de Class
2. Modificar Reservation para añadir class_id
3. Actualizar middleware de autenticación para dual mode
4. Configurar CORS
5. Implementar endpoint de listado de usuarios con filtros
6. Probar integración con frontend

---

**Documento actualizado el**: 15 de octubre de 2025  
**Versión**: 2.0  
**Estado**: Refleja implementación actual + extensiones necesarias  
**Compatibilidad**: Diseñado para integrarse con PLANNING-FRONTEND.md  
**Autor**: GitHub Copilot  
**Para**: Proyecto de reservas de aulas universitarias - Backend en Go
