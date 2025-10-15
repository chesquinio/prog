# Plan de desarrollo: Frontend de plataforma de reservas de aulas

Fecha: 15 de octubre de 2025

## Propósito

Este documento es un plan completo para el desarrollo del frontend de la plataforma de reservas de aulas para una universidad con múltiples edificios. El frontend complementará el backend descrito en `PLANNING-BACKEND.md` y entregará un MVP funcional y mantenible.

## Resumen del producto

La plataforma permite a profesores reservar aulas para sus clases, gestionar grupos de alumnos y visualizar la disponibilidad de espacios. Los administradores gestionan usuarios, edificios y aulas.

### Características principales:

- **Autenticación basada en cookies**: Login/registro con JWT almacenado en cookies HTTP-only
- **Gestión de clases**: Los profesores pueden crear clases y añadir alumnos
- **Reservas de aulas**: Reservar aulas para clases específicas con validación de disponibilidad
- **Panel administrativo**: Confirmar usuarios, gestionar edificios y aulas
- **Visualización pública**: Calendario de reservas visible sin autenticación

## Stack tecnológico

### Framework y librerías principales

- **Next.js 14+** (App Router): Framework React con SSR, routing y optimizaciones
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Framework de utilidades CSS para estilos
- **shadcn/ui**: Componentes reutilizables y accesibles construidos sobre Radix UI
- **React Hook Form**: Manejo eficiente de formularios con validación
- **Zod**: Validación de esquemas TypeScript-first
- **Axios**: Cliente HTTP con interceptors para autenticación
- **Zustand**: Manejo de estado global ligero y simple
- **date-fns**: Manipulación y formateo de fechas
- **React Query (TanStack Query)**: Gestión de estado del servidor, caché y sincronización

### Herramientas de desarrollo

- **ESLint**: Linting de código
- **Prettier**: Formateo de código
- **Husky**: Git hooks para pre-commit
- **TypeScript**: Verificación de tipos

## Arquitectura del proyecto

```
prog-front/
├── .env.local                 # Variables de entorno (no commitear)
├── .env.example              # Ejemplo de variables de entorno
├── .eslintrc.json            # Configuración ESLint
├── .prettierrc               # Configuración Prettier
├── next.config.js            # Configuración Next.js
├── package.json
├── postcss.config.js         # Configuración PostCSS para Tailwind
├── tailwind.config.ts        # Configuración Tailwind CSS
├── tsconfig.json             # Configuración TypeScript
├── PLANNING-FRONTEND.md      # Este documento
├── README.md                 # Documentación del proyecto
│
├── public/                   # Recursos estáticos
│   ├── images/
│   └── favicon.ico
│
├── src/
│   ├── app/                  # App Router de Next.js
│   │   ├── layout.tsx        # Layout raíz
│   │   ├── page.tsx          # Página principal (/)
│   │   ├── not-found.tsx     # Página 404
│   │   ├── error.tsx         # Página de error global
│   │   │
│   │   ├── (auth)/           # Grupo de rutas de autenticación (sin layout principal)
│   │   │   ├── layout.tsx    # Layout para páginas de auth
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/      # Grupo de rutas con layout de dashboard
│   │   │   ├── layout.tsx    # Layout del dashboard (sidebar, navbar)
│   │   │   │
│   │   │   ├── dashboard/    # Panel principal según rol
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── classes/      # Gestión de clases (PROFESSOR)
│   │   │   │   ├── page.tsx              # Lista de clases
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx          # Crear clase
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx          # Detalle de clase
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx      # Editar clase
│   │   │   │       └── students/
│   │   │   │           └── page.tsx      # Gestionar alumnos
│   │   │   │
│   │   │   ├── reservations/ # Gestión de reservas
│   │   │   │   ├── page.tsx              # Lista de reservas
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx          # Crear reserva
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # Detalle de reserva
│   │   │   │
│   │   │   ├── buildings/    # Gestión de edificios (ADMIN)
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── rooms/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── rooms/        # Gestión de aulas (ADMIN)
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── users/        # Gestión de usuarios (ADMIN)
│   │   │   │   ├── page.tsx              # Lista usuarios pendientes
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # Detalle y confirmación
│   │   │   │
│   │   │   └── profile/      # Perfil del usuario
│   │   │       └── page.tsx
│   │   │
│   │   ├── calendar/         # Calendario público de reservas
│   │   │   └── page.tsx
│   │   │
│   │   └── api/              # API Routes (para proxy si necesario)
│   │       └── health/
│   │           └── route.ts
│   │
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/               # Componentes de shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── alert.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/           # Componentes de layout
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── auth/             # Componentes de autenticación
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── RoleGuard.tsx
│   │   │
│   │   ├── reservations/     # Componentes de reservas
│   │   │   ├── ReservationCard.tsx
│   │   │   ├── ReservationForm.tsx
│   │   │   ├── ReservationCalendar.tsx
│   │   │   ├── ReservationList.tsx
│   │   │   └── AvailabilityChecker.tsx
│   │   │
│   │   ├── classes/          # Componentes de clases
│   │   │   ├── ClassCard.tsx
│   │   │   ├── ClassForm.tsx
│   │   │   ├── ClassList.tsx
│   │   │   ├── StudentSelector.tsx
│   │   │   └── ClassStudentList.tsx
│   │   │
│   │   ├── buildings/        # Componentes de edificios
│   │   │   ├── BuildingCard.tsx
│   │   │   ├── BuildingForm.tsx
│   │   │   └── BuildingList.tsx
│   │   │
│   │   ├── rooms/            # Componentes de aulas
│   │   │   ├── RoomCard.tsx
│   │   │   ├── RoomForm.tsx
│   │   │   ├── RoomList.tsx
│   │   │   └── RoomSelector.tsx
│   │   │
│   │   ├── users/            # Componentes de usuarios
│   │   │   ├── UserCard.tsx
│   │   │   ├── UserList.tsx
│   │   │   └── UserConfirmationDialog.tsx
│   │   │
│   │   └── common/           # Componentes comunes
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── EmptyState.tsx
│   │       ├── PageHeader.tsx
│   │       ├── SearchBar.tsx
│   │       └── FilterPanel.tsx
│   │
│   ├── lib/                  # Utilidades y configuraciones
│   │   ├── api/              # Cliente API y endpoints
│   │   │   ├── client.ts     # Configuración Axios con interceptors
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── buildings.ts
│   │   │   │   ├── rooms.ts
│   │   │   │   ├── reservations.ts
│   │   │   │   ├── classes.ts
│   │   │   │   └── public.ts
│   │   │   └── queryClient.ts # Configuración React Query
│   │   │
│   │   ├── hooks/            # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useUser.ts
│   │   │   ├── useReservations.ts
│   │   │   ├── useClasses.ts
│   │   │   ├── useBuildings.ts
│   │   │   ├── useRooms.ts
│   │   │   └── useToast.ts
│   │   │
│   │   ├── store/            # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── uiStore.ts
│   │   │
│   │   ├── validations/      # Esquemas Zod
│   │   │   ├── auth.ts
│   │   │   ├── reservation.ts
│   │   │   ├── class.ts
│   │   │   ├── building.ts
│   │   │   └── room.ts
│   │   │
│   │   ├── utils/            # Funciones utilitarias
│   │   │   ├── cn.ts         # Utilidad para clases de Tailwind
│   │   │   ├── date.ts       # Formateo y manipulación de fechas
│   │   │   ├── format.ts     # Formateo de datos
│   │   │   └── constants.ts  # Constantes de la app
│   │   │
│   │   └── types/            # Tipos TypeScript
│   │       ├── auth.ts
│   │       ├── user.ts
│   │       ├── reservation.ts
│   │       ├── class.ts
│   │       ├── building.ts
│   │       ├── room.ts
│   │       └── api.ts
│   │
│   └── middleware.ts         # Middleware de Next.js para protección de rutas
```

## Entidades y tipos TypeScript

### User

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "PROFESSOR" | "STUDENT";
  is_confirmed: boolean;
  created_at: string;
  updated_at: string;
}
```

### Building

```typescript
interface Building {
  id: number;
  name: string;
  address?: string;
  campus?: string;
  created_at: string;
  updated_at: string;
}
```

### Room

```typescript
interface Room {
  id: number;
  building_id: number;
  building?: Building; // Incluido en algunas respuestas
  name: string;
  capacity: number;
  resources?: string | object; // JSONB
  description?: string;
  created_at: string;
  updated_at: string;
}
```

### Class (Nueva entidad)

```typescript
interface Class {
  id: number;
  name: string;
  description?: string;
  professor_id: number;
  professor?: User;
  subject?: string;
  students?: ClassStudent[]; // Relación muchos a muchos
  created_at: string;
  updated_at: string;
}

interface ClassStudent {
  class_id: number;
  student_id: number;
  student?: User;
  enrolled_at: string;
}
```

### Reservation

```typescript
interface Reservation {
  id: number;
  room_id: number;
  room?: Room;
  user_id: number;
  user?: User;
  class_id?: number; // Nueva: asociar reserva a una clase
  class?: Class;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  purpose: string;
  estimated_attendees: number;
  status: "ACTIVE" | "CANCELLED";
  created_at: string;
  updated_at: string;
}
```

### API Response Types

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}
```

## Modificaciones necesarias en el backend

Para implementar correctamente la autenticación con cookies y las nuevas funcionalidades, el backend necesita las siguientes modificaciones:

### 1. Autenticación con cookies HTTP-only

**Archivo**: `prog-back/internal/controllers/auth_controller.go`

```go
// Modificar Login para enviar JWT en cookie HTTP-only
func Login(c *gin.Context) {
    // ... validación existente ...

    token, err := authService.Login(req.Email, req.Password)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    // Establecer cookie HTTP-only
    c.SetCookie(
        "access_token",           // nombre
        token,                    // valor
        3600*24*7,               // maxAge (7 días en segundos)
        "/",                      // path
        "",                       // domain (vacío = dominio actual)
        false,                    // secure (true en producción con HTTPS)
        true,                     // httpOnly
    )

    // Devolver también info del usuario
    user, _ := authService.GetUserByEmail(req.Email)
    c.JSON(http.StatusOK, gin.H{
        "user": user,
        "message": "Login successful",
    })
}

// Añadir endpoint de logout
func Logout(c *gin.Context) {
    c.SetCookie(
        "access_token",
        "",
        -1,      // maxAge negativo para eliminar
        "/",
        "",
        false,
        true,
    )
    c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// Modificar AuthMe para devolver usuario completo
func AuthMe(c *gin.Context) {
    userID := c.GetUint("userID")
    user, err := authService.GetUserByID(userID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }
    c.JSON(http.StatusOK, user)
}
```

**Archivo**: `prog-back/internal/middleware/auth_middleware.go`

```go
// Modificar para leer JWT desde cookie en lugar de header Authorization
func RequireAuthentication() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Primero intentar obtener de cookie
        token, err := c.Cookie("access_token")

        // Si no hay cookie, intentar con header Authorization (para APIs)
        if err != nil || token == "" {
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

        // ... resto de la validación del JWT ...
    }
}
```

**Archivo**: `prog-back/main.go` (configuración CORS)

```go
import "github.com/gin-contrib/cors"

func main() {
    r := gin.Default()

    // Configurar CORS para permitir cookies
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:3000"} // URL del frontend
    config.AllowCredentials = true
    config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
    r.Use(cors.New(config))

    // ... resto de la configuración ...
}
```

### 2. Nueva entidad Class y relaciones

**Archivo**: `prog-back/internal/models/class.go` (NUEVO)

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

**Modificación**: `prog-back/internal/models/reservation.go`

```go
type Reservation struct {
    ID                  uint           `gorm:"primaryKey" json:"id"`
    RoomID              uint           `gorm:"not null" json:"room_id"`
    Room                *Room          `gorm:"foreignKey:RoomID" json:"room,omitempty"`
    UserID              uint           `gorm:"not null" json:"user_id"`
    User                *User          `gorm:"foreignKey:UserID" json:"user,omitempty"`
    ClassID             *uint          `json:"class_id,omitempty"` // NUEVO: nullable
    Class               *Class         `gorm:"foreignKey:ClassID" json:"class,omitempty"` // NUEVO
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

**Archivo**: `prog-back/pkg/db/db.go` (actualizar AutoMigrate)

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

### 3. Endpoints para clases

**Archivo**: `prog-back/internal/controllers/class_controller.go` (NUEVO)

Implementar:

- `CreateClass` (POST /api/classes) - Solo PROFESSOR
- `ListClasses` (GET /api/classes) - Filtrar por professor_id si no es ADMIN
- `GetClass` (GET /api/classes/:id)
- `UpdateClass` (PATCH /api/classes/:id)
- `DeleteClass` (DELETE /api/classes/:id)
- `AddStudent` (POST /api/classes/:id/students) - Añadir alumno a clase
- `RemoveStudent` (DELETE /api/classes/:id/students/:student_id)
- `ListClassStudents` (GET /api/classes/:id/students)

**Archivo**: `prog-back/internal/routes/routes.go` (añadir rutas)

```go
classes := api.Group("/classes")
{
    classes.POST("", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.CreateClass)
    classes.GET("", middleware.RequireAuthentication(), controllers.ListClasses)
    classes.GET(":id", middleware.RequireAuthentication(), controllers.GetClass)
    classes.PATCH(":id", middleware.RequireAuthentication(), controllers.UpdateClass)
    classes.DELETE(":id", middleware.RequireAuthentication(), controllers.DeleteClass)
    classes.POST(":id/students", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.AddStudent)
    classes.DELETE(":id/students/:student_id", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.RemoveStudent)
    classes.GET(":id/students", middleware.RequireAuthentication(), controllers.ListClassStudents)
}
```

### 4. Endpoints adicionales necesarios

**Users**:

- `GET /api/users` - Listar usuarios (con filtro por `is_confirmed=false` para admin)
- `GET /api/users?role=STUDENT` - Listar estudiantes confirmados (para añadir a clases)

**Reservations**:

- Modificar `CreateReservation` para aceptar `class_id` opcional
- Añadir filtro por `class_id` en `ListReservations`

## Flujos de usuario principales

### 1. Registro y confirmación de cuenta

1. Usuario visita `/register`
2. Selecciona rol (PROFESSOR o STUDENT)
3. Completa formulario y envía
4. Recibe mensaje: "Cuenta creada, pendiente de aprobación por administrador"
5. Admin recibe notificación (dashboard)
6. Admin revisa `/dashboard/users` y confirma cuenta
7. Usuario recibe email (futuro) y puede hacer login

### 2. Login

1. Usuario visita `/login`
2. Ingresa email y password
3. Backend valida credenciales y `is_confirmed=true`
4. Backend establece cookie HTTP-only con JWT
5. Frontend recibe datos de usuario y guarda en store
6. Redirección a `/dashboard` según rol

### 3. Profesor crea clase

1. Profesor autenticado visita `/dashboard/classes`
2. Click en "Nueva clase"
3. Completa formulario: nombre, descripción, materia
4. Clase creada, asociada automáticamente al profesor
5. Puede añadir alumnos desde `/dashboard/classes/[id]/students`

### 4. Profesor reserva aula para clase

1. Profesor visita `/dashboard/reservations/new`
2. Selecciona clase (dropdown de sus clases)
3. Selecciona edificio y aula
4. Visualiza calendario de disponibilidad del aula
5. Selecciona fecha y horario
6. Sistema valida:
   - No solapamiento
   - Capacidad suficiente (estimado de alumnos vs capacidad aula)
7. Reserva creada y asociada a la clase

### 5. Admin gestiona edificios y aulas

1. Admin visita `/dashboard/buildings`
2. Crea edificio: nombre, dirección, campus
3. Entra al edificio y crea aulas
4. Define capacidad, recursos (JSON: proyector, pizarra, etc.)

### 6. Visualización pública de reservas

1. Cualquier usuario (autenticado o no) visita `/calendar`
2. Ve calendario con todas las reservas activas
3. Puede filtrar por edificio, aula, fecha
4. Click en reserva muestra detalles (sin datos sensibles)

## Componentes clave a desarrollar

### 1. Sistema de autenticación

**LoginForm** (`src/components/auth/LoginForm.tsx`)

- Formulario con email y password
- Validación con Zod
- Manejo de errores
- Redirección post-login

**RegisterForm** (`src/components/auth/RegisterForm.tsx`)

- Campos: nombre, email, password, confirmPassword, rol
- Validación de email único
- Mensaje de éxito explicando aprobación pendiente

**RoleGuard** (`src/components/auth/RoleGuard.tsx`)

- HOC o componente que verifica rol del usuario
- Redirige si no tiene permiso
- Muestra mensaje de acceso denegado

**ProtectedRoute** (Middleware Next.js)

- Verifica autenticación en rutas protegidas
- Redirige a `/login` si no autenticado
- Usa `middleware.ts` de Next.js

### 2. Dashboard adaptativo por rol

**DashboardLayout** (`src/app/(dashboard)/layout.tsx`)

- Sidebar con navegación según rol
- Navbar con perfil y logout
- Menú:
  - ADMIN: Usuarios, Edificios, Aulas, Reservas
  - PROFESSOR: Mis clases, Reservas, Calendario
  - STUDENT: Mis clases, Calendario

**Dashboard** (`src/app/(dashboard)/dashboard/page.tsx`)

- Vista diferente según rol:
  - ADMIN: Estadísticas, usuarios pendientes, reservas recientes
  - PROFESSOR: Próximas clases, reservas, accesos rápidos
  - STUDENT: Clases inscritas, horarios

### 3. Gestión de clases (PROFESSOR)

**ClassForm** (`src/components/classes/ClassForm.tsx`)

- Crear/editar clase
- Campos: nombre, descripción, materia
- Validación

**ClassList** (`src/components/classes/ClassList.tsx`)

- Lista de clases del profesor
- Cards con nombre, cantidad de alumnos, próximas reservas
- Acciones: ver, editar, eliminar

**ClassStudentList** (`src/components/classes/ClassStudentList.tsx`)

- Tabla de alumnos de una clase
- Botón para añadir alumnos
- Acción para remover

**StudentSelector** (`src/components/classes/StudentSelector.tsx`)

- Diálogo/modal para buscar y seleccionar estudiantes
- Búsqueda por nombre/email
- Solo muestra estudiantes confirmados

### 4. Gestión de reservas

**ReservationForm** (`src/components/reservations/ReservationForm.tsx`)

- Selección de clase (dropdown)
- Selección de edificio → aula (cascada)
- Date picker + time picker para inicio y fin
- Campo de propósito
- Estimación de asistentes (pre-rellenado con cantidad de alumnos de la clase)
- Validación de capacidad

**AvailabilityChecker** (`src/components/reservations/AvailabilityChecker.tsx`)

- Muestra disponibilidad de un aula en tiempo real
- Visualización de franjas horarias ocupadas/libres
- Ayuda al usuario a elegir horario

**ReservationCalendar** (`src/components/reservations/ReservationCalendar.tsx`)

- Calendario mensual/semanal/diario
- Muestra reservas con colores según estado
- Click en reserva abre detalle
- Filtros: edificio, aula, usuario, clase

**ReservationList** (`src/components/reservations/ReservationList.tsx`)

- Tabla de reservas con filtros
- Columnas: Aula, Clase, Profesor, Fecha/hora, Estado
- Acciones: ver, cancelar (si es owner o admin)

### 5. Gestión de edificios y aulas (ADMIN)

**BuildingForm** (`src/components/buildings/BuildingForm.tsx`)

- Crear/editar edificio
- Campos: nombre, dirección, campus

**BuildingList** (`src/components/buildings/BuildingList.tsx`)

- Cards de edificios
- Click lleva a detalle con lista de aulas

**RoomForm** (`src/components/rooms/RoomForm.tsx`)

- Crear/editar aula
- Selección de edificio
- Capacidad (número)
- Recursos: checkboxes (Proyector, Pizarra digital, Enchufes, WiFi, etc.)
- Descripción

**RoomList** (`src/components/rooms/RoomList.tsx`)

- Tabla de aulas con capacidad y recursos
- Filtro por edificio
- Acciones: ver, editar, eliminar

### 6. Gestión de usuarios (ADMIN)

**UserList** (`src/components/users/UserList.tsx`)

- Tabla de usuarios con filtros:
  - Confirmados/pendientes
  - Por rol
- Badges de estado (confirmado/pendiente)
- Acción: confirmar cuenta

**UserConfirmationDialog** (`src/components/users/UserConfirmationDialog.tsx`)

- Modal para confirmar usuario
- Muestra info del usuario
- Botón confirmar

### 7. Componentes UI comunes (shadcn/ui)

- **Button**: varios variants (primary, secondary, destructive, outline)
- **Card**: contenedor de contenido con header, content, footer
- **Dialog/Modal**: para confirmaciones y formularios
- **Form**: wrapper de react-hook-form con validación
- **Input, Select, Textarea**: campos de formulario estilizados
- **Table**: tablas responsivas con sorting
- **Calendar**: date picker
- **Toast**: notificaciones
- **Badge**: etiquetas de estado
- **Skeleton**: loading states
- **Alert**: mensajes informativos/error

## Manejo de estado

### Zustand stores

**authStore** (`src/lib/store/authStore.ts`)

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

**uiStore** (`src/lib/store/uiStore.ts`)

```typescript
interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}
```

### React Query

Usado para:

- Caché de datos del servidor
- Sincronización automática
- Revalidación en segundo plano
- Manejo de estados de carga/error

Ejemplos de hooks personalizados:

**useClasses** (`src/lib/hooks/useClasses.ts`)

```typescript
export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: classesApi.getAll,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}
```

**useReservations** (`src/lib/hooks/useReservations.ts`)

```typescript
export function useReservations(filters?: ReservationFilters) {
  return useQuery({
    queryKey: ["reservations", filters],
    queryFn: () => reservationsApi.getAll(filters),
  });
}

export function useRoomAvailability(roomId: number, date: string) {
  return useQuery({
    queryKey: ["room-availability", roomId, date],
    queryFn: () => reservationsApi.checkAvailability(roomId, date),
  });
}
```

## Cliente API (Axios)

### Configuración base (`src/lib/api/client.ts`)

```typescript
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  withCredentials: true, // Importante para cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login si no autenticado
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Endpoints organizados por entidad

**auth.ts**

```typescript
export const authApi = {
  register: (data: RegisterData) => apiClient.post("/auth/register", data),
  login: (credentials: LoginCredentials) =>
    apiClient.post("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout"),
  me: () => apiClient.get<User>("/auth/me"),
};
```

**classes.ts**

```typescript
export const classesApi = {
  getAll: () => apiClient.get<Class[]>("/classes"),
  getById: (id: number) => apiClient.get<Class>(`/classes/${id}`),
  create: (data: CreateClassData) => apiClient.post<Class>("/classes", data),
  update: (id: number, data: UpdateClassData) =>
    apiClient.patch<Class>(`/classes/${id}`, data),
  delete: (id: number) => apiClient.delete(`/classes/${id}`),
  addStudent: (classId: number, studentId: number) =>
    apiClient.post(`/classes/${classId}/students`, { student_id: studentId }),
  removeStudent: (classId: number, studentId: number) =>
    apiClient.delete(`/classes/${classId}/students/${studentId}`),
  getStudents: (classId: number) =>
    apiClient.get<User[]>(`/classes/${classId}/students`),
};
```

**reservations.ts**

```typescript
export const reservationsApi = {
  getAll: (filters?: ReservationFilters) =>
    apiClient.get<Reservation[]>("/reservations", { params: filters }),
  getById: (id: number) => apiClient.get<Reservation>(`/reservations/${id}`),
  create: (data: CreateReservationData) =>
    apiClient.post<Reservation>("/reservations", data),
  cancel: (id: number) =>
    apiClient.patch(`/reservations/${id}`, { status: "CANCELLED" }),
  checkAvailability: (roomId: number, date: string) =>
    apiClient.get(`/rooms/${roomId}/availability`, { params: { date } }),
};
```

## Validación con Zod

### Esquemas de validación

**auth.ts** (`src/lib/validations/auth.ts`)

```typescript
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    role: z.enum(["PROFESSOR", "STUDENT"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});
```

**class.ts** (`src/lib/validations/class.ts`)

```typescript
export const classSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  subject: z.string().min(2, "La materia es requerida"),
});
```

**reservation.ts** (`src/lib/validations/reservation.ts`)

```typescript
export const reservationSchema = z
  .object({
    room_id: z.number().positive("Selecciona un aula"),
    class_id: z.number().positive().optional(),
    start_time: z.string().datetime("Fecha de inicio inválida"),
    end_time: z.string().datetime("Fecha de fin inválida"),
    purpose: z.string().min(5, "Describe el propósito de la reserva"),
    estimated_attendees: z.number().positive("Cantidad de asistentes inválida"),
  })
  .refine((data) => new Date(data.end_time) > new Date(data.start_time), {
    message: "La fecha de fin debe ser posterior a la de inicio",
    path: ["end_time"],
  });
```

## Estilos y UI/UX

### Paleta de colores (Tailwind config)

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
        secondary: {
          // ...
        },
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
    },
  },
};
```

### Componentes shadcn/ui a instalar

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
```

### Diseño responsivo

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Sidebar colapsable en móvil (drawer/overlay)
- Tablas con scroll horizontal en móvil
- Formularios con grids adaptativos

### Accesibilidad

- Uso de etiquetas semánticas HTML5
- ARIA labels en componentes interactivos
- Navegación por teclado funcional
- Contraste de colores WCAG AA
- Mensajes de error descriptivos
- Focus states visibles

## Routing y navegación

### Estructura de rutas

```
/                           → Página pública (landing o redirect a /login)
/login                      → Login
/register                   → Registro
/calendar                   → Calendario público de reservas

/dashboard                  → Dashboard según rol
/dashboard/classes          → Lista de clases (PROFESSOR)
/dashboard/classes/new      → Crear clase (PROFESSOR)
/dashboard/classes/[id]     → Detalle de clase
/dashboard/classes/[id]/students → Gestionar alumnos

/dashboard/reservations     → Lista de reservas
/dashboard/reservations/new → Crear reserva (PROFESSOR)
/dashboard/reservations/[id] → Detalle de reserva

/dashboard/buildings        → Gestión edificios (ADMIN)
/dashboard/buildings/new    → Crear edificio (ADMIN)
/dashboard/buildings/[id]   → Detalle edificio

/dashboard/rooms            → Gestión aulas (ADMIN)
/dashboard/rooms/new        → Crear aula (ADMIN)
/dashboard/rooms/[id]/edit  → Editar aula (ADMIN)

/dashboard/users            → Gestión usuarios (ADMIN)
/dashboard/profile          → Perfil del usuario
```

### Middleware de protección (`middleware.ts`)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const { pathname } = request.nextUrl;

  // Rutas públicas
  const publicPaths = ["/", "/login", "/register", "/calendar"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Rutas protegidas - requieren autenticación
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Aquí podrías decodificar el JWT para verificar roles
    // Pero es mejor hacerlo en el componente con RoleGuard
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Variables de entorno

### `.env.example`

```bash
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# App
NEXT_PUBLIC_APP_NAME=AulaReserve
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Opcionales
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Testing (Opcional para MVP, recomendado post-MVP)

### Herramientas sugeridas

- **Vitest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing

### Casos de prueba prioritarios

1. **Autenticación**

   - Login exitoso
   - Login fallido (credenciales incorrectas)
   - Logout
   - Persistencia de sesión

2. **Reservas**

   - Crear reserva válida
   - Validación de solapamiento
   - Validación de capacidad
   - Cancelar reserva

3. **Clases**
   - Crear clase
   - Añadir/remover estudiantes
   - Editar clase

## Despliegue

### Desarrollo local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Build para producción
npm run build

# Ejecutar build
npm run start
```

### Producción (sugerencias)

- **Hosting**: Vercel (recomendado para Next.js), Netlify, o servidor propio
- **Variables de entorno**: Configurar en plataforma de hosting
- **SSL**: Obligatorio para cookies secure
- **CDN**: Para assets estáticos
- **Monitoreo**: Sentry para errores, Google Analytics

### Docker (opcional)

```dockerfile
# Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

## Cronograma de desarrollo sugerido (MVP)

### Fase 1: Setup y autenticación (Semana 1)

- [x] Configurar proyecto Next.js con TypeScript y Tailwind
- [x] Instalar y configurar shadcn/ui
- [x] Configurar Axios y cliente API
- [x] Implementar modificaciones en backend (cookies, CORS)
- [x] Crear layout de autenticación
- [x] Implementar LoginForm y RegisterForm
- [x] Implementar authStore con Zustand
- [x] Crear middleware de protección de rutas
- [x] Testing de flujo de login/registro

### Fase 2: Layout y navegación (Semana 1-2)

- [x] Crear DashboardLayout con Sidebar y Navbar
- [x] Implementar navegación adaptativa por rol
- [x] Crear página de dashboard principal
- [x] Implementar RoleGuard
- [x] Añadir loading states y skeleton screens

### Fase 3: Gestión de clases (Semana 2)

- [x] Modificar backend: modelo Class, endpoints, migración
- [x] Crear tipos TypeScript para Class
- [x] Implementar ClassForm (crear/editar)
- [x] Implementar ClassList y ClassCard
- [x] Implementar StudentSelector y ClassStudentList
- [x] Crear hooks useClasses
- [x] Testing de CRUD de clases

### Fase 4: Gestión de edificios y aulas (Semana 2-3)

- [x] Implementar BuildingForm y BuildingList
- [x] Implementar RoomForm y RoomList
- [x] Crear RoomSelector (para usar en reservas)
- [x] Hooks useBuildings y useRooms
- [x] Testing de CRUD de edificios/aulas

### Fase 5: Gestión de reservas (Semana 3-4)

- [x] Modificar modelo Reservation (añadir class_id)
- [x] Implementar ReservationForm con validaciones
- [x] Crear AvailabilityChecker
- [x] Implementar ReservationCalendar
- [x] Implementar ReservationList con filtros
- [x] Hooks useReservations y useRoomAvailability
- [x] Testing de creación y validación de reservas

### Fase 6: Panel administrativo (Semana 4)

- [x] Implementar UserList con filtros
- [x] Crear UserConfirmationDialog
- [x] Endpoint backend GET /users con filtros
- [x] Hook useUsers
- [x] Testing de confirmación de usuarios

### Fase 7: Calendario público (Semana 4-5)

- [x] Crear página /calendar sin autenticación
- [x] Implementar vista de calendario mensual/semanal
- [x] Añadir filtros por edificio/aula
- [x] Detalles de reserva (datos públicos)

### Fase 8: Pulido y optimización (Semana 5)

- [x] Mejorar mensajes de error y validaciones
- [x] Añadir toasts para feedback
- [x] Optimizar performance (lazy loading, code splitting)
- [x] Añadir estados vacíos (EmptyState)
- [x] Responsive design en todas las vistas
- [x] Testing E2E de flujos completos
- [x] Documentación final (README)

## Mejoras post-MVP (Future enhancements)

### Funcionalidades adicionales

1. **Notificaciones**

   - Email al confirmar cuenta
   - Recordatorios de reservas próximas
   - Notificaciones en tiempo real (WebSockets)

2. **Reportes y estadísticas**

   - Dashboard con gráficos (uso de aulas, reservas por profesor)
   - Exportación a PDF/Excel

3. **Gestión avanzada de reservas**

   - Reservas recurrentes (clases semanales)
   - Conflictos automáticos con sugerencias de aulas alternativas
   - Lista de espera

4. **Recursos adicionales**

   - Gestión de equipamiento (asignación de laptops, proyectores)
   - Check-in de asistencia a clases

5. **Integración con calendarios**

   - Exportar reservas a Google Calendar, Outlook

6. **Búsqueda avanzada**

   - Buscar aulas disponibles por capacidad, recursos, edificio

7. **Mensajería**

   - Chat entre profesores y alumnos de una clase
   - Anuncios de clase

8. **Modo oscuro**
   - Toggle theme en uiStore
   - Persistencia en localStorage

## Criterios de aceptación del MVP

### Autenticación

- [x] Usuario puede registrarse con rol PROFESSOR o STUDENT
- [x] Admin puede confirmar cuentas pendientes
- [x] Solo usuarios confirmados pueden hacer login
- [x] Cookie HTTP-only almacena JWT correctamente
- [x] Logout elimina cookie y limpia estado

### Clases (PROFESSOR)

- [x] Profesor puede crear clases con nombre, descripción, materia
- [x] Profesor puede ver lista de sus clases
- [x] Profesor puede añadir estudiantes confirmados a una clase
- [x] Profesor puede remover estudiantes de una clase
- [x] Profesor puede editar y eliminar sus clases

### Reservas (PROFESSOR)

- [x] Profesor puede crear reserva asociada a una clase
- [x] Sistema valida no solapamiento de reservas en la misma aula
- [x] Sistema valida que capacidad del aula sea suficiente
- [x] Profesor puede ver sus reservas y filtrarlas
- [x] Profesor/Admin puede cancelar reservas
- [x] Se muestra disponibilidad del aula antes de reservar

### Edificios y aulas (ADMIN)

- [x] Admin puede crear edificios con nombre, dirección, campus
- [x] Admin puede crear aulas asociadas a edificios
- [x] Admin puede definir capacidad y recursos de aulas
- [x] Admin puede editar y eliminar aulas
- [x] Recursos se almacenan como JSON y se muestran legiblemente

### Usuarios (ADMIN)

- [x] Admin puede ver lista de usuarios pendientes de confirmación
- [x] Admin puede confirmar usuarios uno por uno
- [x] Admin puede filtrar usuarios por rol y estado

### Calendario público

- [x] Cualquier usuario puede ver calendario de reservas
- [x] Se pueden filtrar reservas por edificio, aula, fecha
- [x] Detalles de reserva no muestran información sensible

### UI/UX

- [x] Interfaz responsiva (móvil, tablet, desktop)
- [x] Mensajes de error claros y específicos
- [x] Loading states en todas las operaciones async
- [x] Toasts para feedback de acciones exitosas/fallidas
- [x] Navegación intuitiva con breadcrumbs

## Documentación requerida

### README.md del frontend

Debe incluir:

- Descripción del proyecto
- Stack tecnológico
- Requisitos previos (Node.js, npm)
- Instalación y configuración
- Variables de entorno
- Scripts disponibles (dev, build, start, lint)
- Estructura de carpetas
- Guía de contribución
- Licencia

### Comentarios en código

- JSDoc en funciones complejas
- Comentarios explicativos en lógica de negocio
- TODOs para mejoras futuras

## Consideraciones de seguridad

1. **Cookies HTTP-only**: Prevenir acceso por JavaScript (XSS)
2. **CORS configurado**: Solo permitir origin del frontend
3. **Validación en frontend y backend**: Nunca confiar solo en frontend
4. **Sanitización de inputs**: Prevenir inyecciones
5. **Manejo seguro de errores**: No exponer detalles internos en mensajes
6. **Rate limiting**: Implementar en backend para endpoints sensibles
7. **HTTPS en producción**: Obligatorio para cookies secure

## Notas finales

Este plan proporciona una guía completa para el desarrollo del frontend. Las estimaciones de tiempo asumen un desarrollador trabajando tiempo completo. Ajustar según recursos disponibles.

### Prioridades si el tiempo es limitado:

1. **Crítico**: Autenticación, layout, gestión de clases, reservas básicas
2. **Importante**: Gestión de edificios/aulas, calendario público
3. **Deseable**: Filtros avanzados, estadísticas, pulido UI

### Próximos pasos inmediatos:

1. Crear proyecto Next.js: `npx create-next-app@latest prog-front --typescript --tailwind --app`
2. Configurar shadcn/ui: `npx shadcn-ui@latest init`
3. Instalar dependencias adicionales: `npm install axios zustand zod react-hook-form @hookform/resolvers @tanstack/react-query date-fns`
4. Crear estructura de carpetas según este documento
5. Implementar modificaciones en el backend (cookies, Class model, endpoints)
6. Comenzar con Fase 1: Setup y autenticación

---

**Documento creado el**: 15 de octubre de 2025  
**Versión**: 1.0  
**Autor**: GitHub Copilot  
**Para**: Proyecto de reservas de aulas universitarias
