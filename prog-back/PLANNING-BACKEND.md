# Plan de desarrollo: Plataforma de reservas de aulas

Fecha: 13 de octubre de 2025

## Propósito

Este documento es un plan de partida para convertir el repositorio `programcion-backend` en el backend de una plataforma de reservas de aulas para una universidad con múltiples edificios.

## Resumen del producto

- Usuarios: profesores, alumnos y administradores.
- Registro / Login: los usuarios se registran indicando si son profesor o alumno; un administrador debe confirmar la cuenta antes de que puedan iniciar sesión.
- Gestión de aulas: los administradores crean y configuran edificios y aulas con su capacidad máxima y atributos.
- Reservas: los profesores pueden reservar aulas en horarios específicos; las reservas deben validar disponibilidad y capacidad.

## Asunciones razonables

- La app será un API REST escrito en Go (siguiendo la estructura actual del repositorio).
- La persistencia será relacional (Postgres recomendado), con migraciones gestionadas por una herramienta como `migrate` o `prisma`/`gorm` según preferencia.
- Autenticación basada en JWT con refresco opcional y roles (ROLE_ADMIN, ROLE_PROFESSOR, ROLE_STUDENT).
- Validación horaria por franjas (e.g., 30/60 minutos) y reserva por time-slot.

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

## Esquema relacional sugerido (resumen)

- users(id PK, name, email UNIQUE, password_hash, role, is_confirmed bool, created_at, updated_at)
- buildings(id PK, name, address, campus, created_at, updated_at)
- rooms(id PK, building_id FK, name, capacity int, resources JSONB, description, created_at, updated_at)
- reservations(id PK, room_id FK, user_id FK, start_time timestamptz, end_time timestamptz, purpose text, estimated_attendees int, status text, created_at, updated_at)

## API REST: endpoints clave

Autenticación

- POST /api/v1/auth/register — body: {name,email,password,role}
- POST /api/v1/auth/login — body: {email,password} -> {access_token,expires_in}

Usuarios

- GET /api/v1/users — (admin) lista usuarios
- GET /api/v1/users/{id} — (admin|self) ver perfil
- PATCH /api/v1/users/{id}/confirm — (admin) confirmar cuenta

Edificios y aulas

- GET /api/v1/buildings
- POST /api/v1/buildings — (admin)
- GET /api/v1/buildings/{id}
- GET /api/v1/rooms
- POST /api/v1/rooms — (admin)
- GET /api/v1/rooms/{id}
- PATCH /api/v1/rooms/{id} — (admin)
- DELETE /api/v1/rooms/{id} — (admin)

Reservas

- POST /api/v1/reservations — (professor) {room_id,start_time,end_time,purpose,estimated_attendees}
- GET /api/v1/reservations — lista filtrable por room_id,user_id,building_id,date_from,date_to
- GET /api/v1/reservations/{id}
- PATCH /api/v1/reservations/{id} — (owner|admin) para cancelar o editar (ediciones sujetas a reglas)
- DELETE /api/v1/reservations/{id} — (owner|admin)

## Consideraciones no-funcionales

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

## Revisión del coverage del plan vs impl

- Implementado:
  - Modelos, GORM init, seeder admin, auth (register/login/confirm), middleware JWT, endpoints CRUD para buildings/rooms, endpoints de reservas (crear/list/cancel) con validaciones básicas.
- Pendiente:
  - Paginación y filtros avanzados
  - OpenAPI/Swagger
  - Tests automatizados
  - Manejo avanzado de transacciones (convertir validación de solapamiento en transacción serializable)

## Notas finales

Este documento es un punto de partida. Puedo generar ahora las migraciones SQL iniciales, el archivo `openapi.yaml`, o comenzar a implementar controladores y servicios en el proyecto según prefieras.
