# prog-front

Frontend Next.js for the classroom booking platform.

How to run locally:

1. Install dependencies

```powershell
cd prog-front; npm install
```

2. Run development server

```powershell
npm run dev
```

Docker:

```powershell
docker build -t prog-front ./prog-front
docker run -e NEXT_PUBLIC_API_URL=http://backend:8080/api -p 3000:3000 prog-front
```

## Integración de UI (shadcn)

Este proyecto está preparado para usar `shadcn/ui` (Radix + Tailwind). Para inicializarla en local:

```powershell
cd prog-front
npx shadcn-ui@latest init
# Genera componentes (Button, Input, Modal, etc.) según prompts
```

Después añade los componentes generados a `src/components/ui` y ajusta `tailwind.config.js` si el CLI lo pide.
