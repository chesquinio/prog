# AulaReserve - Frontend

Sistema de reservas de aulas para universidades. Frontend desarrollado con Next.js 14+, TypeScript y Tailwind CSS.

## 🚀 Stack Tecnológico

- **Next.js 14+** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de utilidades CSS
- **Axios** - Cliente HTTP
- **Zustand** - Gestión de estado global
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **TanStack Query** - Gestión de estado del servidor
- **date-fns** - Manipulación de fechas

## 📋 Requisitos Previos

- Node.js 18.17 o superior
- npm o yarn
- Backend en ejecución (ver `../prog-back/README.md`)

## 🔧 Instalación

1. **Clonar el repositorio e ir a la carpeta del frontend:**

```bash
cd prog-front
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar variables de entorno:**

Copiar el archivo `.env.example` a `.env.local` y ajustar los valores:

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=AulaReserve
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏃‍♂️ Desarrollo

**Ejecutar en modo desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

**Otros comandos:**

```bash
# Construir para producción
npm run build

# Ejecutar versión de producción
npm start

# Ejecutar linter
npm run lint
```

## 📁 Estructura del Proyecto

```
prog-front/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Rutas protegidas
│   │   │   ├── dashboard/
│   │   │   ├── classes/
│   │   │   ├── reservations/
│   │   │   ├── buildings/
│   │   │   ├── rooms/
│   │   │   ├── users/
│   │   │   └── profile/
│   │   ├── calendar/          # Calendario público
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── layout/           # Navbar, Sidebar, etc.
│   │   ├── auth/             # Componentes de autenticación
│   │   ├── classes/          # Componentes de clases
│   │   ├── reservations/     # Componentes de reservas
│   │   ├── buildings/        # Componentes de edificios
│   │   ├── rooms/            # Componentes de aulas
│   │   ├── users/            # Componentes de usuarios
│   │   └── common/           # Componentes comunes
│   │
│   ├── lib/                  # Utilidades y configuraciones
│   │   ├── api/              # Cliente API y endpoints
│   │   ├── hooks/            # Custom hooks
│   │   ├── store/            # Stores de Zustand
│   │   ├── types/            # Tipos TypeScript
│   │   ├── validations/      # Esquemas de validación Zod
│   │   └── utils/            # Funciones utilitarias
│   │
│   └── middleware.ts         # Middleware de Next.js
│
├── public/                   # Recursos estáticos
├── .env.example             # Ejemplo de variables de entorno
├── .env.local               # Variables de entorno (no commitear)
├── next.config.js           # Configuración de Next.js
├── tailwind.config.ts       # Configuración de Tailwind
├── tsconfig.json            # Configuración de TypeScript
└── package.json
```

## 🔐 Autenticación

El sistema utiliza cookies HTTP-only para almacenar el JWT de autenticación:

- **Login:** `/login` - Inicia sesión y establece cookie
- **Registro:** `/register` - Crea cuenta (requiere aprobación de admin)
- **Logout:** Elimina cookie y redirige a login

Las rutas `/dashboard/*` están protegidas y requieren autenticación.

## 👥 Roles de Usuario

### ADMIN

- Gestionar usuarios (confirmar cuentas)
- Gestionar edificios y aulas
- Ver todas las reservas
- Acceso completo al sistema

### PROFESSOR

- Crear y gestionar clases
- Añadir estudiantes a clases
- Crear reservas de aulas
- Ver sus propias reservas

### STUDENT

- Ver clases en las que está inscrito
- Ver calendario de reservas

## 🎨 Componentes UI

El proyecto está preparado para usar **shadcn/ui** (componentes reutilizables basados en Radix UI).

Para instalar componentes:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
# etc.
```

## 📡 API Endpoints

El frontend consume los siguientes endpoints del backend:

### Autenticación

- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios

- `GET /api/users` - Listar usuarios
- `PATCH /api/users/:id` - Confirmar usuario

### Clases

- `GET /api/classes` - Listar clases
- `POST /api/classes` - Crear clase
- `GET /api/classes/:id` - Obtener clase
- `PATCH /api/classes/:id` - Actualizar clase
- `DELETE /api/classes/:id` - Eliminar clase
- `POST /api/classes/:id/students` - Añadir estudiante
- `DELETE /api/classes/:id/students/:student_id` - Remover estudiante

### Edificios

- `GET /api/buildings` - Listar edificios
- `POST /api/buildings` - Crear edificio
- `PATCH /api/buildings/:id` - Actualizar edificio
- `DELETE /api/buildings/:id` - Eliminar edificio

### Aulas

- `GET /api/rooms` - Listar aulas
- `POST /api/rooms` - Crear aula
- `PATCH /api/rooms/:id` - Actualizar aula
- `DELETE /api/rooms/:id` - Eliminar aula

### Reservas

- `GET /api/reservations` - Listar reservas
- `POST /api/reservations` - Crear reserva
- `PATCH /api/reservations/:id` - Cancelar reserva
- `GET /api/public/reservations` - Calendario público

## 🛠️ Desarrollo

### Agregar nuevas páginas

Las páginas se crean en `src/app/` usando el App Router de Next.js:

```tsx
// src/app/nueva-ruta/page.tsx
export default function NuevaRutaPage() {
  return <div>Nueva página</div>;
}
```

### Crear componentes

```tsx
// src/components/MiComponente.tsx
export default function MiComponente() {
  return <div>Mi componente</div>;
}
```

### Usar stores de Zustand

```tsx
import { useAuthStore } from "@/lib/store/authStore";

function MiComponente() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return <div>{user?.name}</div>;
}
```

### Hacer peticiones a la API

```tsx
import { classesApi } from "@/lib/api/endpoints/classes";

async function obtenerClases() {
  const response = await classesApi.getAll();
  return response.data;
}
```

## 🐛 Debugging

- Errores de compilación: Revisar terminal donde corre `npm run dev`
- Errores de red: Abrir DevTools → Network
- Estado de la aplicación: React DevTools + Zustand DevTools

## 📝 Plan de Desarrollo

Ver `PLANNING-FRONTEND.md` para el plan completo de desarrollo por fases.

**Estado actual:** ✅ Fase 1 completada (Setup y autenticación básica)

**Próximos pasos:**

- Instalar y configurar shadcn/ui
- Implementar gestión de clases (PROFESSOR)
- Implementar gestión de edificios y aulas (ADMIN)
- Implementar sistema de reservas
- Crear calendario público

## 🤝 Contribuir

1. Crear una rama para la feature: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commits descriptivos
3. Hacer push y crear Pull Request

## 📄 Licencia

ISC

## 👤 Autor

Proyecto de reservas de aulas universitarias

---

**Nota:** Este proyecto requiere que el backend esté en ejecución. Ver `../prog-back/README.md` para instrucciones.
