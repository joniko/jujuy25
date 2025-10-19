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

Para correr el proyecto completo en modo desarrollo (Backend + Frontend):

```bash
npm run dev
```

Este comando iniciará **automáticamente ambos servidores**:
- 🔵 **Backend (Socket.io)**: `http://localhost:4000`
- 🟣 **Frontend (Next.js)**: `http://localhost:3000`

Abre tu navegador en `http://localhost:3000` para ver la aplicación.

#### Correr servidores individualmente

Si necesitas correr solo uno de los servidores:

```bash
# Solo Backend (Socket.io) - Puerto 4000
npm run dev:backend

# Solo Frontend (Next.js) - Puerto 3000
npm run dev:frontend
```

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

- `npm run dev` - **Inicia ambos servidores simultáneamente** (Backend en puerto 4000 + Frontend en puerto 3000)
- `npm run dev:backend` - Inicia solo el servidor Backend (Socket.io) en puerto 4000
- `npm run dev:frontend` - Inicia solo el servidor Frontend (Next.js) en puerto 3000
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor en modo producción
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

### Primera vez o Redeploy

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

### 🔄 Migrar de EZE a GRU (Región más estable)

Si tu app está en la región **EZE (Buenos Aires)** y tiene problemas, migrala a **GRU (São Paulo)**:

1. **Verifica tu app actual:**
   ```bash
   fly status
   ```

2. **Escala a 0 máquinas en EZE:**
   ```bash
   fly scale count 0
   ```

3. **Despliega en la nueva región GRU:**
   ```bash
   fly deploy --region gru
   ```

4. **Verifica que esté corriendo en GRU:**
   ```bash
   fly status
   ```

**Nota:** El archivo `fly.toml` ya está configurado con `primary_region = "gru"` para mayor estabilidad.

## 🔧 Variables de Entorno

### Desarrollo Local

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Variables disponibles:
- `NEXT_PUBLIC_SOCKET_URL`: URL del servidor Socket.io (default: `http://localhost:4000`)
- `NEXT_PUBLIC_SHEETS_URL`: URL del Google Sheets en formato CSV

### Producción (Vercel)

Configura estas variables en el dashboard de Vercel:
- `NEXT_PUBLIC_SOCKET_URL=https://oremosapp.fly.dev`
- `NEXT_PUBLIC_SHEETS_URL=<tu-url-de-google-sheets>`

## 📝 Notas Adicionales

- El proyecto usa **dos servidores en desarrollo**:
  - Backend Express + Socket.io (`server.js`) en puerto **4000**
  - Frontend Next.js en puerto **3000**
- `npm run dev` usa `concurrently` para correr ambos servidores simultáneamente
- El frontend se conecta al backend Socket.io para funcionalidad en tiempo real
- El proyecto está configurado con Shadcn UI y sigue las mejores prácticas de Next.js App Router
