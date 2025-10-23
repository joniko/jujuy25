# 📚 Configuración de la Biblioteca

Este documento explica cómo configurar la sección Biblioteca con Google Sheets.

## 🎯 Estructura del Google Sheet

### Tab: "Biblioteca"

Crea un nuevo tab en tu Google Sheet con las siguientes columnas. **Cada fila es un "post" o grupo de archivos relacionados:**

| titulo | bajada | url | nombre | tipo | peso |
|--------|--------|-----|--------|------|------|
| Recursos de Oración | Material complementario para acompañar tus momentos de oración | https://url1,https://url2,https://url3 | Guía Diaria\|Manual de Ayuno\|Carpeta Recursos | doc\|pdf\|carpeta | \|1.2 MB\| |
| Guías de Ayuno | Documentos y recursos sobre el ayuno cristiano | https://url4,https://url5 | Introducción al Ayuno\|Calendario de Ayuno | pdf\|doc | 850 KB\|500 KB |

### Explicación de Columnas:

1. **titulo** (Requerido en cada fila)
   - El título del grupo de archivos
   - Ejemplo: "Recursos de Oración", "Guías de Ayuno"

2. **bajada** (Requerido en cada fila)
   - Descripción del grupo de archivos
   - Ejemplo: "Material complementario para acompañar tus momentos de oración"

3. **url** (Requerido - múltiples URLs separadas por comas)
   - URLs de los archivos, separadas por comas
   - Ejemplos:
     - Una URL: `https://docs.google.com/document/d/ID/edit`
     - Múltiples URLs: `https://url1,https://url2,https://url3`
   - Tipos soportados:
     - Google Docs: `https://docs.google.com/document/d/ID/edit`
     - Google Drive: `https://drive.google.com/file/d/ID/view`
     - Carpeta Drive: `https://drive.google.com/drive/folders/ID`
     - PDF directo: `https://example.com/archivo.pdf`

4. **nombre** (Múltiples nombres separados por `|`)
   - Un nombre por cada URL, en el mismo orden
   - Separados por el símbolo pipe `|`
   - Ejemplo: `Guía Diaria|Manual de Ayuno|Carpeta Recursos`
   - Puedes usar fórmulas AI si lo prefieres

5. **tipo** (Múltiples tipos separados por `|`)
   - Un tipo por cada URL, en el mismo orden
   - Separados por el símbolo pipe `|`
   - Tipos válidos: `pdf`, `doc`, `imagen`, `video`, `audio`, `carpeta`
   - Ejemplo: `doc|pdf|carpeta`
   - Puedes usar fórmulas AI si lo prefieres

6. **peso** (Opcional - múltiples pesos separados por `|`)
   - Un peso por cada URL, en el mismo orden
   - Separados por el símbolo pipe `|`
   - Ejemplo: `|1.2 MB|` (el primero vacío, el segundo con peso, el tercero vacío)
   - Puedes dejarlo completamente vacío

## 🔧 Configuración de Variables de Entorno

La biblioteca usa el mismo Google Sheet que el cronograma, solo necesitás el GID de la pestaña "Biblioteca":

### Paso 1: Obtener el GID de la pestaña "Biblioteca"

1. Abrí tu Google Sheet
2. Click en la pestaña "Biblioteca" 
3. Mirá la URL del navegador, debería verse así:
   ```
   https://docs.google.com/spreadsheets/d/TU_SHEET_ID/edit#gid=123456789
   ```
4. El número después de `#gid=` es tu GID (ej: `123456789`)

### Paso 2: Configurar la variable de entorno

En tu archivo `.env.local`:
```env
NEXT_PUBLIC_SHEETS_URL=https://docs.google.com/spreadsheets/d/e/2PACX-XXX/pub?output=csv
NEXT_PUBLIC_SHEETS_BIBLIOTECA_GID=123456789
```

**Nota:** Si no especificás el GID, la biblioteca usará la misma pestaña que el cronograma (no recomendado).

## 📝 Ejemplo Completo de CSV

```csv
titulo,bajada,url,nombre,tipo,peso
Recursos de Oración,Material complementario para acompañar tus momentos de oración,"https://docs.google.com/document/d/123/edit,https://drive.google.com/file/d/456/view,https://drive.google.com/drive/folders/789",Guía de Oración Diaria|Manual de Ayuno|Carpeta de Recursos,doc|pdf|carpeta,|1.2 MB|
Guías de Ayuno,Documentos y recursos sobre el ayuno cristiano,"https://example.com/introduccion.pdf,https://docs.google.com/document/d/abc/edit",Introducción al Ayuno|Calendario de Ayuno,pdf|doc,850 KB|500 KB
Testimonios,Videos e imágenes de testimonios,"https://www.youtube.com/watch?v=xyz,https://example.com/imagen.jpg",Video Testimonio 1|Imagen Inspiracional,video|imagen,|2 MB
```

**Nota importante:** Si una celda tiene comas (como en el campo `url`), Google Sheets automáticamente la encerrará entre comillas dobles al exportar como CSV.

## 🎨 Tipos de Archivo y sus Iconos

La biblioteca automáticamente asigna iconos según el tipo:

- **doc / pdf**: 📄 Icono de documento (azul)
- **sheet / excel**: 📊 Icono de hoja de cálculo (verde)
- **imagen / image**: 🖼️ Icono de imagen (morado)
- **video**: 🎬 Icono de video (rojo)
- **audio / music**: 🎵 Icono de audio (naranja)
- **carpeta / folder**: 📁 Icono de carpeta (amarillo)

## 🚀 Despliegue en Producción

No olvides agregar la variable en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega: `NEXT_PUBLIC_SHEETS_BIBLIOTECA_GID` con el número del GID de tu pestaña "Biblioteca"

## ✅ Verificación

1. Ve a `/biblioteca` en tu app
2. Deberías ver el título, bajada y las cards de archivos
3. Al hacer click en una card, debe abrir el archivo en una nueva pestaña

## 💡 Tips

- **Fórmulas AI**: Si Google Sheets no tiene la función AI habilitada, puedes llenar `nombre` y `tipo` manualmente
- **Actualización automática**: La app revisa cambios cada 30 segundos
- **Cache**: Si no ves cambios, espera 30 segundos o refresca la página
- **Múltiples archivos**: Puedes agregar tantas filas como archivos necesites

## 🔍 Troubleshooting

**No se muestra la biblioteca**
- Verifica que la URL del Sheet termine en `output=csv`
- Asegúrate que el Sheet esté publicado públicamente

**Los nombres no aparecen bien**
- Verifica que las fórmulas AI estén funcionando
- Considera llenar manualmente la columna `nombre`

**Los tipos de archivo no se ven**
- Los tipos válidos son: `pdf`, `doc`, `imagen`, `video`, `audio`, `carpeta`
- Usa minúsculas para consistencia

