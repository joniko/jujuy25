# 📚 Configuración de la Biblioteca

Este documento explica cómo configurar la sección Biblioteca con Google Sheets.

## 🎯 Estructura del Google Sheet

### Tab: "Biblioteca"

Crea un nuevo tab en tu Google Sheet con las siguientes columnas:

| titulo | bajada | url | nombre | tipo | peso |
|--------|--------|-----|--------|------|------|
| Recursos de Oración | Material complementario para acompañar tus momentos de oración | https://docs.google.com/document/d/123/edit | =AI("Extract the document name from: "&C2) | =AI("What type of file is this? Answer only one word: pdf, doc, imagen, video, audio, or carpeta: "&C2) | (opcional) |
| | | https://drive.google.com/file/d/456/view | =AI("Extract the document name from: "&C3) | =AI("What type of file is this? Answer only one word: pdf, doc, imagen, video, audio, or carpeta: "&C3) | 2.5 MB |
| | | https://example.com/documento.pdf | =AI("Extract the document name from: "&C4) | =AI("What type of file is this? Answer only one word: pdf, doc, imagen, video, audio, or carpeta: "&C4) | |

### Explicación de Columnas:

1. **titulo** (Primera fila solamente)
   - El título principal de la biblioteca
   - Ejemplo: "Recursos de Oración"

2. **bajada** (Primera fila solamente)
   - Descripción o subtítulo de la biblioteca
   - Ejemplo: "Material complementario para acompañar tus momentos de oración"

3. **url** (Todas las filas con archivos)
   - La URL directa del archivo (Google Drive, Google Docs, PDF, etc.)
   - Ejemplos:
     - Google Docs: `https://docs.google.com/document/d/ID/edit`
     - Google Drive: `https://drive.google.com/file/d/ID/view`
     - Carpeta Drive: `https://drive.google.com/drive/folders/ID`
     - PDF directo: `https://example.com/archivo.pdf`

4. **nombre** (Fórmula AI automática)
   - Usa la fórmula AI de Google Sheets para extraer el nombre
   - Fórmula: `=AI("Extract the document name from: "&C2)`
   - Cambia `C2` por la celda correspondiente de la URL

5. **tipo** (Fórmula AI automática)
   - Usa la fórmula AI para detectar el tipo de archivo
   - Fórmula: `=AI("What type of file is this? Answer only one word: pdf, doc, imagen, video, audio, or carpeta: "&C2)`
   - Tipos válidos: `pdf`, `doc`, `imagen`, `video`, `audio`, `carpeta`

6. **peso** (Opcional)
   - El tamaño del archivo (ej: "2.5 MB", "150 KB")
   - Puedes dejarlo vacío o usar fórmula AI (pero es difícil obtenerlo sin API)

## 🔧 Configuración de Variables de Entorno

### Opción 1: Tab separado en el mismo Google Sheet (Recomendado)

1. En tu Google Sheet, crea un nuevo tab llamado "Biblioteca"
2. Llena la estructura como se indica arriba
3. Publica el tab:
   - Archivo → Compartir → Publicar en la web
   - Selecciona el tab "Biblioteca"
   - Formato: CSV
   - Copia la URL generada
4. En tu archivo `.env.local`:
   ```env
   NEXT_PUBLIC_SHEETS_BIBLIOTECA_URL=https://docs.google.com/spreadsheets/d/e/TU_ID/pub?gid=GID_BIBLIOTECA&single=true&output=csv
   ```

### Opción 2: Usar el mismo tab del cronograma

Si prefieres no crear un tab separado, la app usará `NEXT_PUBLIC_SHEETS_URL` por defecto. Pero esto no es recomendado porque mezclaría datos.

## 📝 Ejemplo Completo de CSV

```csv
titulo,bajada,url,nombre,tipo,peso
Recursos de Oración,Material complementario para acompañar tus momentos de oración,https://docs.google.com/document/d/123/edit,Guía de Oración Diaria,doc,
,,https://drive.google.com/file/d/456/view,Manual de Ayuno,pdf,1.2 MB
,,https://drive.google.com/drive/folders/789,Carpeta de Recursos,carpeta,
,,https://example.com/imagen.jpg,Imagen Inspiracional,imagen,850 KB
,,https://www.youtube.com/watch?v=abc,Video de Testimonio,video,
```

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
3. Agrega: `NEXT_PUBLIC_SHEETS_BIBLIOTECA_URL` con la URL del CSV

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

