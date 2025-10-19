# Oremos - Aplicación Next.js

Aplicación web construida con Next.js 14, React 18, TypeScript, Tailwind CSS, Shadcn UI y Socket.io para funcionalidad en tiempo real.

## 🚀 Cómo Correr el Proyecto

### Prerrequisitos

- Node.js 18+ y npm instalados en tu sistema
- Git instalado

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Desarrollo Local

Para correr el proyecto en modo desarrollo con hot-reload:

```bash
npm run dev
```

Esto iniciará el servidor en `http://localhost:3000` (o el puerto disponible).

**Nota:** Este proyecto usa un servidor Express personalizado con Socket.io, por lo que `npm run dev` ejecuta `node server.js` en lugar del servidor de desarrollo estándar de Next.js.

### 3. Construir para Producción

Para crear una build optimizada de producción:

```bash
npm run build
```

### 4. Iniciar en Modo Producción

Después de construir, puedes iniciar el servidor en modo producción:

```bash
npm start
```

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Express + Socket.io
- `npm run dev:frontend` - Inicia solo el servidor de desarrollo de Next.js (sin Socket.io)
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor en modo producción
- `npm run lint` - Ejecuta el linter de ESLint

## 📁 Estructura del Proyecto

```
oremos/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes de React
│   └── FullScreenModal.tsx
├── src/
│   ├── components/ui/     # Componentes UI de Shadcn
│   └── lib/              # Utilidades y helpers
├── public/               # Archivos estáticos
├── server.js            # Servidor Express personalizado con Socket.io
├── Dockerfile           # Configuración Docker para despliegue
└── fly.toml            # Configuración de Fly.io
```

## 🎨 Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes UI:** Shadcn UI, Radix UI
- **Tiempo Real:** Socket.io
- **Servidor:** Express.js
- **Validación:** Zod
- **Formularios:** React Hook Form

## 🚢 Despliegue en Fly.io

1. Instala la CLI de Fly.io:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Inicia sesión:
   ```bash
   fly auth login
   ```

3. Despliega la aplicación:
   ```bash
   fly deploy
   ```

## 🔧 Variables de Entorno

Configura las variables de entorno necesarias en un archivo `.env.local` para desarrollo local, o en Fly.io para producción usando:

```bash
fly secrets set NOMBRE_VARIABLE=valor
```

## 📝 Notas Adicionales

- El proyecto usa un servidor Express personalizado (`server.js`) para soportar WebSockets con Socket.io
- Para desarrollo frontend puro sin Socket.io, usa `npm run dev:frontend`
- El proyecto está configurado con Shadcn UI y sigue las mejores prácticas de Next.js App Router
