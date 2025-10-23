# 📚 Ejemplo Visual de la Biblioteca

## Cómo se vería en Google Sheets

### Pestaña: "Biblioteca"

| titulo | bajada | url | nombre | tipo | peso |
|--------|--------|-----|--------|------|------|
| Recursos de Oración | Material complementario para acompañar tus momentos de oración y fortalecer tu vida espiritual | `https://docs.google.com/.../edit`, `https://drive.google.com/.../view`, `https://drive.google.com/drive/folders/...` | Guía de Oración Diaria\|Manual de Intercesión\|Carpeta de Recursos | doc\|pdf\|carpeta | \|2.5 MB\| |
| Guías de Ayuno | Documentos y recursos sobre la práctica del ayuno cristiano | `https://docs.google.com/.../edit`, `https://example.com/ayuno.pdf` | Introducción al Ayuno\|Ayuno Bíblico - Guía Completa | doc\|pdf | \|1.8 MB |
| Testimonios y Enseñanzas | Videos y materiales sobre testimonios de fe | `https://youtube.com/...`, `https://youtube.com/...`, `https://s3.../imagen.jpg` | Video: El Poder de la Oración\|Video: Testimonios de Fe\|Imagen Inspiracional | video\|video\|imagen | \|\|850 KB |

**Nota:** Las URLs están separadas por comas, los nombres/tipos/pesos por pipe `|`

---

## Cómo se vería en la App

### Página: `/biblioteca`

```
┌─────────────────────────────────────────────────────┐
│  ← Biblioteca                                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Recursos de Oración                                 │
│  Material complementario para acompañar tus          │
│  momentos de oración y fortalecer tu vida espiritual │
│                                                       │
│  ┌───────────────────┐  ┌───────────────────┐       │
│  │ 📄 Guía de        │  │ 📄 Manual de      │       │
│  │    Oración Diaria │  │    Intercesión    │       │
│  │    DOC            │  │    PDF • 2.5 MB   │       │
│  └───────────────────┘  └───────────────────┘       │
│                                                       │
│  ┌───────────────────┐                               │
│  │ 📁 Carpeta de     │                               │
│  │    Recursos       │                               │
│  │    CARPETA        │                               │
│  └───────────────────┘                               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Guías de Ayuno                                      │
│  Documentos y recursos sobre la práctica del         │
│  ayuno cristiano                                     │
│                                                       │
│  ┌───────────────────┐  ┌───────────────────┐       │
│  │ 📄 Introducción   │  │ 📄 Ayuno Bíblico  │       │
│  │    al Ayuno       │  │    Guía Completa  │       │
│  │    DOC            │  │    PDF • 1.8 MB   │       │
│  └───────────────────┘  └───────────────────┘       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Testimonios y Enseñanzas                            │
│  Videos y materiales sobre testimonios de fe         │
│                                                       │
│  ┌───────────────────┐  ┌───────────────────┐       │
│  │ 🎬 Video: El      │  │ 🎬 Video:         │       │
│  │    Poder de la    │  │    Testimonios    │       │
│  │    Oración        │  │    de Fe          │       │
│  │    VIDEO          │  │    VIDEO          │       │
│  └───────────────────┘  └───────────────────┘       │
│                                                       │
│  ┌───────────────────┐                               │
│  │ 🖼️ Imagen        │                               │
│  │    Inspiracional  │                               │
│  │    IMAGEN • 850 KB│                               │
│  └───────────────────┘                               │
└─────────────────────────────────────────────────────┘
```

---

## Colores de las Cards por Tipo

- **📄 DOC/PDF**: Azul claro (`bg-blue-50 border-blue-200`)
- **📊 EXCEL/SHEET**: Verde claro (`bg-green-50 border-green-200`)
- **🖼️ IMAGEN**: Morado claro (`bg-purple-50 border-purple-200`)
- **🎬 VIDEO**: Rojo claro (`bg-red-50 border-red-200`)
- **🎵 AUDIO**: Naranja claro (`bg-orange-50 border-orange-200`)
- **📁 CARPETA**: Amarillo claro (`bg-yellow-50 border-yellow-200`)

---

## Tips para llenar el Sheet:

### URLs (separadas por comas)
```
https://docs.google.com/document/d/123/edit,https://drive.google.com/file/d/456/view,https://example.com/archivo.pdf
```

### Nombres (separados por pipe |)
```
Guía de Oración|Manual de Ayuno|Documento Extra
```

### Tipos (separados por pipe |)
```
doc|pdf|imagen
```
**Tipos válidos:** `doc`, `pdf`, `imagen`, `video`, `audio`, `carpeta`

### Pesos (separados por pipe | - opcional)
```
|2.5 MB|850 KB
```
**Nota:** Dejá vacío si no conocés el peso (como en el primer ejemplo: `|2.5 MB|`)

---

## Ejemplo Mínimo (sin nombres/tipos/pesos)

Si no querés llenar todo manualmente:

```csv
titulo,bajada,url,nombre,tipo,peso
Recursos de Oración,Material complementario,https://docs.google.com/.../edit,,,
```

La app automáticamente mostrará:
- **Nombre**: "Archivo 1"
- **Tipo**: "documento"
- **Peso**: (no se muestra)

---

## Cómo Probar

1. Copia el contenido de `BIBLIOTECA_EJEMPLO.csv`
2. Pegalo en tu pestaña "Biblioteca" del Google Sheet
3. Ajusta las URLs a tus archivos reales
4. La app automáticamente lo mostrará en `/biblioteca`

¡Listo! 🎉

