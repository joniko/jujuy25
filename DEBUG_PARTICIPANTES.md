# 🔍 Guía de Debug - Página de Participantes

## Cómo verificar que está apuntando a la planilla correcta

### 1. Verificar variables de entorno

Abre tu `.env.local` y verifica que tengas:

```env
NEXT_PUBLIC_SHEETS_URL=https://docs.google.com/spreadsheets/d/e/XXXXX/pub?gid=0&single=true&output=csv
NEXT_PUBLIC_SHEETS_PARTICIPANTES_GID=123456789
```

### 2. Obtener el GID de la pestaña de Participantes

1. Abre tu Google Sheet
2. Haz clic en la pestaña "Participantes" (o el nombre que le hayas dado)
3. Mira la URL del navegador, debería tener algo como:
   ```
   https://docs.google.com/spreadsheets/d/e/XXXXX/edit#gid=123456789
   ```
4. El número después de `gid=` es el GID que necesitas copiar

### 3. Verificar en la consola del navegador

1. Abre la página de participantes en tu navegador
2. Presiona `F12` (o clic derecho → Inspeccionar)
3. Ve a la pestaña "Console"
4. Busca estos mensajes:

```
🔍 Debug - Base URL: [tu URL]
🔍 Debug - Participantes GID: [tu GID]
🔍 Debug - Final Sheets URL: [URL completa]
✅ Response status: 200
📊 Parsed data rows: [número de filas]
```

### 4. Verificar la URL completa

La URL final debería verse así:
```
https://docs.google.com/spreadsheets/d/e/XXXXX/pub?gid=123456789&single=true&output=csv
```

Donde `123456789` es tu GID de participantes.

### 5. Panel de Debug (solo en desarrollo)

Si estás en modo desarrollo (`npm run dev`), verás un panel amarillo en la página con:
- ✅/❌ Si la Base URL está configurada
- El GID que está usando
- Cuántas filas encontró
- La URL completa que está usando

### 6. Errores comunes

#### ❌ "No hay URL de Google Sheets configurada"
- **Solución**: Agrega `NEXT_PUBLIC_SHEETS_URL` en tu `.env.local`

#### ❌ "No hay GID de participantes configurado"
- **Solución**: Agrega `NEXT_PUBLIC_SHEETS_PARTICIPANTES_GID` en tu `.env.local`

#### ❌ Error 404: "No se encontró la planilla"
- **Causa**: El GID es incorrecto o la pestaña no existe
- **Solución**: Verifica el GID en la URL de Google Sheets

#### ❌ Error 403: "Acceso denegado"
- **Causa**: La planilla no está publicada como CSV
- **Solución**: 
  1. Ve a Google Sheets
  2. Archivo → Compartir → Publicar en la web
  3. Selecciona la pestaña "Participantes"
  4. Formato: "Valores separados por comas (.csv)"
  5. Clic en "Publicar"

#### ✅ Response 200 pero no aparecen datos
- **Causa**: Las columnas no coinciden o están vacías
- **Solución**: 
  - Verifica que la primera fila tenga los nombres de columnas correctos
  - Verifica que haya datos en la columna "nombre"
  - Revisa la consola para ver qué columnas detectó: `📊 Available columns:`

### 7. Verificar estructura de columnas

La primera fila de tu planilla debe tener estas columnas (al menos las obligatorias):

**Obligatorias:**
- `nombre`
- `grupo`
- `destino`

**Opcionales pero recomendadas:**
- `rol`
- `referentes`
- `whatsapp`
- `medio_transporte`
- etc.

### 8. Probar la URL manualmente

Puedes copiar la URL completa de la consola y abrirla en el navegador. Deberías ver un CSV con los datos.

Si ves los datos en el navegador pero no en la app, el problema puede ser:
- Caché del navegador (prueba en modo incógnito)
- CORS (poco probable con Google Sheets público)
- Formato del CSV (verifica que no tenga caracteres especiales raros)

### 9. Reiniciar el servidor

Después de cambiar `.env.local`, **siempre reinicia el servidor**:

```bash
# Detén el servidor (Ctrl+C)
# Luego reinicia:
npm run dev
```

Las variables de entorno solo se cargan al iniciar el servidor.

