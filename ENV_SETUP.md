# Configuración de Variables de Entorno

Este documento explica cómo configurar las variables de entorno para el proyecto.

## Variables Necesarias

### WEBHOOK_URL (Backend)
URL del webhook de Google Apps Script para registrar entradas/salidas de usuarios.

**Tu URL actual:**
```
https://script.google.com/macros/s/AKfycbyLd604Gv-1B6KMEgmPny5S4z_yBP6fT6939XPz5vwwr6C_A9P77sQi5-cPvt4Kj3Gx/exec
```

### NEXT_PUBLIC_SOCKET_URL (Frontend)
URL del servidor de Socket.io.

**Desarrollo:** `http://localhost:4000`
**Producción:** Tu URL de servidor desplegado

### NEXT_PUBLIC_SHEETS_URL (Frontend)
URL del Google Sheet con los temas de oración (exportado como CSV).

## Desarrollo Local

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Backend - Google Apps Script Webhook
WEBHOOK_URL=https://script.google.com/macros/s/AKfycbyLd604Gv-1B6KMEgmPny5S4z_yBP6fT6939XPz5vwwr6C_A9P77sQi5-cPvt4Kj3Gx/exec

# Frontend - Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000

# Frontend - Google Sheets
NEXT_PUBLIC_SHEETS_URL=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/export?format=csv
```

## Producción

### Fly.io

Si tu backend está en Fly.io:

```bash
fly secrets set WEBHOOK_URL=https://script.google.com/macros/s/AKfycbyLd604Gv-1B6KMEgmPny5S4z_yBP6fT6939XPz5vwwr6C_A9P77sQi5-cPvt4Kj3Gx/exec
```

### Vercel (Frontend)

Si tu frontend está en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - `NEXT_PUBLIC_SOCKET_URL`: URL de tu servidor Socket.io
   - `NEXT_PUBLIC_SHEETS_URL`: URL del Google Sheet

### Otras Plataformas

Consulta la documentación de tu plataforma para agregar variables de entorno.

## Verificar Configuración

### Verificar webhook (Backend)

Ejecuta en terminal:

```bash
curl https://script.google.com/macros/s/AKfycbyLd604Gv-1B6KMEgmPny5S4z_yBP6fT6939XPz5vwwr6C_A9P77sQi5-cPvt4Kj3Gx/exec
```

Deberías ver:
```json
{"status":"active","message":"Webhook de Oremos está funcionando correctamente","timestamp":"..."}
```

### Verificar que el backend tiene la variable

En `server.js` hay un log al inicio. Cuando inicies el servidor deberías ver:
- Si está configurada: "Analytics enabled" o similar
- Si NO está configurada: "WEBHOOK_URL not configured, skipping analytics"

## Troubleshooting

### El webhook no registra datos

1. Verifica que `WEBHOOK_URL` esté configurada en el backend
2. Reinicia el servidor backend después de agregar la variable
3. Verifica los logs del backend para ver si hay errores
4. Verifica que la URL del webhook funcione (usa curl)

### Error de CORS

Si ves errores de CORS en el webhook:
- No te preocupes, es normal con Google Apps Script
- Los datos se siguen guardando correctamente
- Es un warning, no un error

### Datos no llegan al Google Sheet

1. Ve a tu Google Sheet
2. Verifica que tenga los encabezados correctos en la primera fila:
   - Timestamp | Evento | Nombre | Edad | Iglesia | Socket ID
3. Verifica que el script en Apps Script esté implementado como "Aplicación web"
4. Verifica que el acceso sea "Cualquier persona"

## Próximos Pasos

1. ✅ Webhook configurado y funcionando
2. ⏳ Configurar variable de entorno en el backend
3. ⏳ Reiniciar el backend
4. ⏳ Probar con usuarios reales
5. ⏳ Verificar que los datos se registren en el Google Sheet

¡Ya casi está todo listo! 🚀

