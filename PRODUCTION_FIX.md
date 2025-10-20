# 🔧 Guía para Arreglar Producción

## 📊 Problema Actual
- ✅ Socket.io backend funciona en Fly.io: `https://oremosapp.fly.dev`
- ❌ Frontend en producción NO carga datos del Google Sheet
- ❌ Frontend en producción NO muestra info del video YouTube

## 🎯 Solución: Configurar Variables de Entorno

### Opción 1: Usar Google Sheets (Recomendado)

#### Paso 1: Publicar el CSV en Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Copia y pega el contenido de `temas-oracion.csv`:
   - Columna A: `hora`
   - Columna B: `titulo`
   - Columna C: `bajada`
4. **Archivo → Compartir → Publicar en la web**
5. Configuración:
   - Contenido que se publica: **Hoja 1** (o el nombre de tu hoja)
   - Formato: **Valores separados por comas (.csv)**
6. Click en **Publicar**
7. **Copia la URL completa** - será algo como:
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vXXXXXXX/pub?gid=0&single=true&output=csv
   ```

#### Paso 2: Configurar Variables en Vercel

Si tu frontend está en **Vercel** (oremos.app):

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **oremos**
3. Ve a **Settings → Environment Variables**
4. Agrega estas variables:

```env
NEXT_PUBLIC_SOCKET_URL=https://oremosapp.fly.dev
NEXT_PUBLIC_SHEETS_URL=[LA_URL_QUE_COPIASTE_DE_GOOGLE_SHEETS]
```

5. **Redeploy** tu aplicación:
   - Ve a la pestaña **Deployments**
   - Click en los 3 puntos del último deployment
   - Click en **Redeploy**

---

### Opción 2: Usar un CSV Público (Alternativa)

Si no quieres usar Google Sheets, puedes subir el CSV a:
- GitHub (como archivo público en tu repo)
- Un servicio de hosting estático

#### Ejemplo con GitHub:
1. El archivo `temas-oracion.csv` ya está en tu repo
2. Usa esta URL en producción:
   ```
   https://raw.githubusercontent.com/TU_USUARIO/oremos/main/temas-oracion.csv
   ```

---

## 🧪 Verificar que funciona

### Desarrollo Local
Para probar en tu computadora Y celular con 4G:

1. **Opción A: Usar ngrok** (recomendado para pruebas)
   ```bash
   # Instalar ngrok
   brew install ngrok
   
   # Iniciar tu servidor local
   npm run dev
   
   # En otra terminal, exponer el puerto 4000
   ngrok http 4000
   ```
   
   Usa la URL de ngrok (ej: `https://xxxx-xxxx.ngrok.io`) como `NEXT_PUBLIC_SOCKET_URL` en tu `.env.local`

2. **Opción B: Usar directamente Fly.io** (más simple)
   - Tu backend ya está en Fly.io
   - Solo configura en `.env.local`:
   ```env
   NEXT_PUBLIC_SOCKET_URL=https://oremosapp.fly.dev
   NEXT_PUBLIC_SHEETS_URL=[TU_URL_DE_GOOGLE_SHEETS]
   ```

### Producción
1. Abre `https://oremos.app` en incógnito
2. Deberías ver:
   - ✅ El motivo de oración actual (cargado del Google Sheet)
   - ✅ Información del video de YouTube
   - ✅ Usuarios conectados en tiempo real

---

## 🐛 Problemas Comunes

### "No aparecen los datos del Google Sheet"
- Verifica que la URL del Google Sheets sea pública
- Verifica que la variable `NEXT_PUBLIC_SHEETS_URL` esté configurada en Vercel
- Revisa la consola del navegador (F12) para ver errores

### "No aparece la info del video de YouTube"
- La API de YouTube puede tener rate limits
- Verifica la consola del navegador para errores
- El fallback debería mostrar "Música de Adoración" / "Canal desconocido"

### "Los usuarios conectados no aparecen"
- Verifica que `NEXT_PUBLIC_SOCKET_URL` apunte a `https://oremosapp.fly.dev`
- Verifica que el servidor Socket.io esté corriendo:
  ```bash
  curl https://oremosapp.fly.dev
  ```
  Debería responder: `Servidor de Socket.IO funcionando`

---

## 📝 Archivo .env.local para Desarrollo

Crea este archivo en la raíz del proyecto (NO lo commits a git):

```env
# Backend Socket.io
NEXT_PUBLIC_SOCKET_URL=https://oremosapp.fly.dev

# Google Sheets CSV (obtén tu URL siguiendo los pasos arriba)
NEXT_PUBLIC_SHEETS_URL=https://docs.google.com/spreadsheets/d/e/2PACX-XXXXXX/pub?gid=0&single=true&output=csv

# Webhook (opcional, para analytics)
WEBHOOK_URL=
```

---

## 🚀 Deploy Rápido

Después de configurar las variables:

```bash
# 1. Hacer commit de cambios (si los hay)
git add .
git commit -m "Fix: Configurar variables de entorno para producción"

# 2. Push a GitHub (esto triggerea el deploy en Vercel automáticamente)
git push origin main
```

---

## ✅ Checklist

- [ ] Google Sheet creado y publicado como CSV
- [ ] Variables configuradas en Vercel:
  - [ ] `NEXT_PUBLIC_SOCKET_URL`
  - [ ] `NEXT_PUBLIC_SHEETS_URL`
- [ ] Redeploy ejecutado en Vercel
- [ ] Probado en `https://oremos.app`
- [ ] Datos del Google Sheet aparecen
- [ ] Info del video de YouTube aparece
- [ ] Usuarios conectados aparecen


