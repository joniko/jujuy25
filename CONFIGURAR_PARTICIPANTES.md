# 📋 Configuración de Participantes - Google Sheets

## URL de tu planilla
```
https://docs.google.com/spreadsheets/d/1FeK7bk4twNxobS2vITFoBX-DyVIAGiE5Tit2-Q3KFcw/edit?gid=479714265#gid=479714265
```

## Pasos para configurar

### 1. Publicar la planilla como CSV

1. Abre tu Google Sheet: https://docs.google.com/spreadsheets/d/1FeK7bk4twNxobS2vITFoBX-DyVIAGiE5Tit2-Q3KFcw
2. Ve a **Archivo → Compartir → Publicar en la web**
3. En "Contenido que se publica", selecciona la pestaña **"Participantes"** (o el nombre que tenga)
4. En "Formato", selecciona **"Valores separados por comas (.csv)"**
5. Haz clic en **"Publicar"**
6. **Copia la URL** que aparece (será algo como):
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vXXXXX/pub?gid=479714265&single=true&output=csv
   ```

### 2. Obtener el GID

El GID de tu pestaña es: **479714265**

(Puedes verificar esto en la URL cuando estás en la pestaña: `#gid=479714265`)

### 3. Configurar variables de entorno

Abre tu archivo `.env.local` y agrega/actualiza estas líneas:

```env
# URL base de Google Sheets (la que copiaste en el paso 1)
NEXT_PUBLIC_SHEETS_URL=https://docs.google.com/spreadsheets/d/e/[LA_URL_QUE_COPIASTE]/pub?gid=0&single=true&output=csv

# GID de la pestaña de Participantes
NEXT_PUBLIC_SHEETS_PARTICIPANTES_GID=479714265
```

**Importante**: Reemplaza `[LA_URL_QUE_COPIASTE]` con la URL completa que copiaste en el paso 1, pero asegúrate de que termine con `&output=csv`

### 4. Ejemplo de configuración completa

Si la URL pública que copiaste es:
```
https://docs.google.com/spreadsheets/d/e/2PACX-1v1FeK7bk4twNxobS2vITFoBX-DyVIAGiE5Tit2-Q3KFcw/pub?gid=479714265&single=true&output=csv
```

Entonces en `.env.local` deberías tener:

```env
NEXT_PUBLIC_SHEETS_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1v1FeK7bk4twNxobS2vITFoBX-DyVIAGiE5Tit2-Q3KFcw/pub?gid=0&single=true&output=csv
NEXT_PUBLIC_SHEETS_PARTICIPANTES_GID=479714265
```

Nota: El `gid=0` en la URL base puede ser cualquier número, ya que lo reemplazaremos con el GID de participantes.

### 5. Reiniciar el servidor

Después de guardar `.env.local`, **reinicia el servidor**:

```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

### 6. Verificar que funciona

1. Abre la página de participantes: http://localhost:3000/participantes
2. Abre la consola del navegador (F12)
3. Busca estos mensajes:
   ```
   🔍 Debug - Base URL: [tu URL]
   🔍 Debug - Participantes GID: 479714265
   ✅ Response status: 200
   📊 Parsed data rows: [número de participantes]
   ```

Si ves un panel amarillo de debug en la página (en desarrollo), debería mostrar:
- ✅ Base URL: Configurada
- GID Participantes: 479714265
- Filas encontradas: [número]

### 7. Estructura de columnas esperada

Asegúrate de que tu planilla tenga al menos estas columnas en la primera fila:

- `nombre` (obligatorio)
- `grupo` (obligatorio)
- `destino` (obligatorio)
- `rol` (opcional)
- `referentes` (opcional)
- `whatsapp` (opcional)
- `medio_transporte` (opcional)
- etc.

Ver `EJEMPLO_PESTANA_PARTICIPANTES.md` para la estructura completa.

