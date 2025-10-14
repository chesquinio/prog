# Plan de desarrollo: Frontend Next.js para Plataforma de reservas de aulas

Fecha: 14 de octubre de 2025

## Resumen

Este documento especifica el diseño del frontend (Next.js + TypeScript) para la plataforma de reservas de aulas descrita en `prog-back/PLANNING-BACKEND.md`.

## Objetivo

Construir un frontend moderno, accesible y fácilmente desplegable en Docker que implemente los flujos principales:

- Registro y login (autenticación JWT)
- Dashboard según rol (ADMIN, PROFESSOR, STUDENT)
- Gestión de edificios y aulas (admin)
- Creación y gestión de reservas (professor + admin)
- Ver reservas por aula, edificio, profesor y rango de fechas

## Tecnologías propuestas

- Next.js (app-router o pages-router — se recomienda app-router con Next 14+)
- TypeScript
- Tailwind CSS para estilos rápidos y consistentes
- shadcn/ui para librería de componentes y tema (Radix + Tailwind presets)
- React Query (TanStack Query) para fetch, caché y sincronización con API
- Axios como cliente HTTP con interceptores para refresh y JWT
- Zod para validación de formularios y parsing de respuestas
- React Hook Form para formularios
- Day.js o date-fns para manejo de fechas/zonas
- Docker + docker-compose para levantar frontend en desarrollo y producción
- Testing: Jest + React Testing Library, y Cypress para E2E

## Estructura del proyecto (sugerida)

prog-front/

- Dockerfile
- package.json
- next.config.js
- tailwind.config.js
- public/
- src/
  - app/ (o pages/)
    - layout.tsx
    - page.tsx (home)
    - auth/
      - login/page.tsx
      - register/page.tsx
    - dashboard/
      - page.tsx
    - admin/
      - users/page.tsx
      - buildings/
        - page.tsx
        - [id]/page.tsx
      - rooms/
        - page.tsx
        - [id]/page.tsx
    - reservations/
      - page.tsx
      - create/page.tsx
      - [id]/page.tsx
  - components/
    - ui/ (Botones, Inputs, Modals, Table) — implementar con `shadcn/ui` para ahorrar trabajo y mantener consistencia
    - auth/ (AuthForm, ProtectedRoute)
    - layout/ (Topbar, Sidebar)
    - reservation/ (ReservationForm, AvailabilityCalendar)
  - hooks/ (useAuth, useAxios, useQueryHelpers)
  - services/ (api clients por recurso: auth.ts, users.ts, buildings.ts, rooms.ts, reservations.ts)
  - lib/ (date utils, validators)
  - types/ (DTOs, API types)
  - styles/
  - utils/

## Vistas y componentes (detalladas)

Cada vista listada tendrá los elementos específicos necesarios para integrar con el backend.

1. Páginas públicas

- Home (`/`)
  - Hero con descripción
  - CTA para Login/Register
  - Links a documentación (si aplica)

2. Auth

- Login (`/auth/login`)

  - Form: email, password
  - Validaciones: email requerido + formato, password requerido
  - On success: recibe `access_token` y guarda en storage (httpOnly cookie recomendado por seguridad, pero si backend no lo soporta usar localStorage con flag) y redirige según rol.
  - Mostrar errores (401, rate-limit)

- Register (`/auth/register`)
  - Form: name, email, password, role (PROFESSOR|STUDENT)
  - Validaciones: password strength, email format
  - On success: mostrar mensaje "Registro enviado, espere confirmación del admin"

3. Dashboard (`/dashboard`)

- Vista index según rol:
  - ADMIN: resumen con número de usuarios, reservas activas, edificios, últimas acciones; accesos rápidos a gestión
  - PROFESSOR: próximas reservas, botón crear reserva, búsqueda de aulas
  - STUDENT: ver reservas públicas (si corresponde) o información general
- Componentes:
  - Cards métricas
  - Lista/tabla de próximas reservas

4. Gestión de Usuarios (admin) (`/admin/users`)

- Tabla paginada con columnas: id, name, email, role, is_confirmed, actions
- Filtros y búsqueda
- Acción: Confirmar usuario (PATCH `/api/v1/users/{id}/confirm`) — botón en cada fila
- Acción: View user details

5. Edificios CRUD (admin) (`/admin/buildings`)

- Lista de edificios (tabla)
- Crear edificio: form (name, address, campus)
- Editar: form prefilled
- Delete con confirmación
- Ver detalles: muestra aulas relacionadas y reservas por edificio (enlaces)

6. Aulas CRUD (admin) (`/admin/rooms`)

- Tabla: id, building_name, name, capacity, resources (lista), actions
- Crear sala: building_id select, name, capacity, resources (multi-select/JSON), description
- Editar/Eliminar
- Ver sala: mostrar próximas reservas y botón para crear reserva como admin

7. Reservas

- Listado /reservations
  - Filtros: room_id, user_id, building_id, date_from, date_to
  - Tabla: id, room_name, building_name, user_name, start_time, end_time, status, actions
  - Paginación
- Crear reserva (`/reservations/create`)
  - Form: room_id (select), date/time pickers for start/end, purpose, estimated_attendees
  - Validaciones client-side: start < end, duration dentro de límites, estimated_attendees >0
  - Disponibilidad previa: opcional call para ver conflictos antes de enviar
  - On submit: POST `/api/v1/reservations` — mostrar errores de backend (solapamiento, capacidad excedida) y mapearlos en UI
- Reserva detalle (`/reservations/[id]`)
  - Mostrar info completa, botones: Edit (si owner/admin), Cancel (if owner/admin)
  - Confirm dialog para cancelar

8. Availability helper

- Componente para ver franjas horarias de un aula (day/week view)
- Opcional: un calendario pequeño o timeline donde se marquen reservas existentes
- Usar library: react-day-picker o fullcalendar (si se justifica)

9. Layout y navegación

- Topbar: logo, search, user menu (avatar, logout)
- Sidebar: links por rol (Dashboard, Buildings, Rooms, Reservations, Users)
- Protected routes: HOC o middleware que valide token y role antes de cargar páginas

10. Internacionalización y fechas

- Todo en español por defecto (i18n opcional)
- Mostrar todas las fechas en la zona local del usuario tomando UTC desde backend; mostrar timezone seleccionable si necesario

## Contratos con backend (endpoints y formatos)

Se propone usar Axios con un cliente base que recuerda el `access_token` y añade Authorization header.
Variables de entorno

- NEXT_PUBLIC_API_URL (ej: http://backend:8080 o http://localhost:8080)
- NEXT_PUBLIC_APP_PORT
- NEXT_PUBLIC_AUTH_COOKIE (nombre de cookie si se usa)

Contratos clave (resumen)

- POST /api/v1/auth/register — body {name,email,password,role}
- POST /api/v1/auth/login — {email,password} -> {access_token,token_type}
- GET /api/v1/users — admin
- PATCH /api/v1/users/{id}/confirm — admin
- CRUD /api/v1/buildings
- CRUD /api/v1/rooms
- POST /api/v1/reservations
- GET /api/v1/reservations?room_id=&user_id=&date_from=&date_to=
- PATCH /api/v1/reservations/{id}

## Manejo de autenticación y seguridad

- Preferible usar httpOnly secure cookies para tokens; si backend no lo soporta, usar localStorage y un refresher.
- Guardar role en estado global (context/React Query cached user) y usar para rutas y UI.
- Axios interceptor para añadir Authorization: Bearer <token> y para manejar 401 (redirigir a login)

## Docker y despliegue

- `Dockerfile` multi-stage (build + production) para Next.js
- `docker-compose.yml` en la raíz del workspace (ya existe) debe levantarse con servicios `db`, `backend`, `frontend`:
  - frontend:
    - build: ./prog-front
    - environment: NEXT_PUBLIC_API_URL=http://backend:8080
    - ports: [3000:3000]
- Añadir `nginx` o usar `next start -p 3000` en producción

Variables de entorno requeridas (en `.env` o en docker-compose)

- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_APP_NAME
- NODE_ENV

## UX y validaciones clave

- Validación de solapamiento: Backend responde con 400 y razón; UI mostrará un modal con franjas ocupadas y sugiera alternativas
- Manejo de errores: mostrar mensajes de error claros en toasts
- Formularios: accesibles, con focus management y mensajes de validación

## Criterios de aceptación

- El frontend permite registro, login y persistencia de sesión
- Administrador puede confirmar cuentas y gestionar edificios/aulas
- Profesor puede crear reservas que el backend valide (sin solapamiento y respetando capacidad)
- Las rutas protegidas no son accesibles sin el rol apropiado
- El frontend se puede levantar con Docker y se integra con el backend en `docker compose up --build`

## Siguientes pasos técnicos inmediatos

1. Scaffold del proyecto Next.js (TypeScript) con Tailwind.
2. Crear cliente Axios y hooks básicos de auth (`useAuth`).
3. Implementar layout y páginas de Auth.
4. Implementar CRUD de edificios y aulas.
5. Implementar creación y listado de reservas con validaciones.

## Notas adicionales / cosas a recordar

- Coordinar el formato de fechas con backend; acordar ISO 8601 UTC.
- Confirmar si el backend expone refresh tokens o sólo access_token para diseñar persistencia de sesión.
- Confirmar si backend permite CORS desde el dominio del frontend (si se usan dominios distintos).

Archivo generado por: planificación automática basada en `prog-back/PLANNING-BACKEND.md` y convenciones de Next.js.
