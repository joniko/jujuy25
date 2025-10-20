# Guía para Usar tus Imágenes con PWA Asset Generator 🎨

## Imágenes que tienes

Tienes 3 variaciones de tu logo de Oremos:
1. **Logo cuadrado** (512x512) - Perfecto para iconos
2. **Logo horizontal** (1200x630 aprox) - Para compartir en redes
3. **Logo vertical splash** (540x1170 aprox) - Para splash screens

## Paso 1: Preparar las Imágenes 📁

Guarda tus imágenes en la carpeta `public/` con estos nombres:

```bash
public/
  ├── logo-square.png      # Tu primera imagen (512x512)
  ├── logo-horizontal.png  # Tu segunda imagen (para OG/compartir)
  └── logo-splash.png      # Tu tercera imagen (para splash screens)
```

### Opción Rápida (copiar desde donde las tengas):

```bash
# Desde tu carpeta de descargas o donde estén
cp ~/Downloads/imagen1.png public/logo-square.png
cp ~/Downloads/imagen2.png public/logo-horizontal.png
cp ~/Downloads/imagen3.png public/logo-splash.png
```

## Paso 2: Ejecutar el Generador 🚀

Una vez que tengas las imágenes en su lugar:

```bash
# Método 1: Usar el script automatizado
./scripts/generate-pwa-assets.sh
```

### O ejecutar manualmente:

```bash
# 1. Generar ICONOS (usando logo cuadrado)
npx pwa-asset-generator public/logo-square.png public \
  --background "#EDE8E2" \
  --icon-only \
  --favicon \
  --type png \
  --opaque true \
  --padding "10%" \
  --index app/layout.tsx \
  --manifest public/manifest.json \
  --xhtml

# 2. Generar SPLASH SCREENS (usando logo vertical o cuadrado)
npx pwa-asset-generator public/logo-splash.png public/splash-screens \
  --background "#EDE8E2" \
  --splash-only \
  --type png \
  --quality 90 \
  --padding "20%" \
  --index app/layout.tsx \
  --xhtml
```

## Explicación de las Opciones

### Para Iconos:

- `--background "#EDE8E2"` - Color de fondo beige claro (como en tus imágenes)
- `--icon-only` - Solo genera iconos, no splash screens
- `--favicon` - También genera favicon.ico
- `--type png` - Formato PNG
- `--opaque true` - Fondo sólido (no transparente)
- `--padding "10%"` - Margen de 10% alrededor del logo
- `--index app/layout.tsx` - Actualiza automáticamente el layout
- `--manifest public/manifest.json` - Actualiza el manifest
- `--xhtml` - Genera tags compatibles con JSX/TSX

### Para Splash Screens:

- `--splash-only` - Solo genera splash screens
- `--quality 90` - Calidad de imagen 90%
- `--padding "20%"` - Más margen para splash screens

## ¿Qué genera esta herramienta? 📦

### Iconos generados:
```
public/
  ├── icon-72x72.png
  ├── icon-96x96.png
  ├── icon-128x128.png
  ├── icon-144x144.png
  ├── icon-152x152.png
  ├── icon-192x192.png
  ├── icon-384x384.png
  ├── icon-512x512.png
  ├── apple-icon-180.png
  ├── manifest-icon-192.maskable.png
  ├── manifest-icon-512.maskable.png
  └── favicon.ico
```

### Splash Screens generados:
```
public/splash-screens/
  ├── apple-splash-2048-2732.png      (iPad Pro 12.9")
  ├── apple-splash-1668-2388.png      (iPad Pro 11")
  ├── apple-splash-1536-2048.png      (iPad 9.7")
  ├── apple-splash-1668-2224.png      (iPad 10.5")
  ├── apple-splash-1620-2160.png      (iPad 10.2")
  ├── apple-splash-1284-2778.png      (iPhone 14 Pro Max)
  ├── apple-splash-1170-2532.png      (iPhone 14 Pro)
  ├── apple-splash-1125-2436.png      (iPhone X/XS)
  ├── apple-splash-1242-2688.png      (iPhone XS Max)
  ├── apple-splash-828-1792.png       (iPhone XR)
  ├── apple-splash-1242-2208.png      (iPhone 8 Plus)
  ├── apple-splash-750-1334.png       (iPhone 8)
  ├── apple-splash-640-1136.png       (iPhone SE)
  └── ... más tamaños para landscape
```

### Archivos actualizados automáticamente:
- `app/layout.tsx` - Se añaden todos los `<link>` tags necesarios
- `public/manifest.json` - Se añaden referencias a los iconos

## Personalización Avanzada 🎨

### Cambiar el color de fondo:

```bash
# Fondo blanco
--background "#FFFFFF"

# Fondo oscuro
--background "#1A1A1A"

# Transparente (solo para PNGs y logos con transparency)
--background "transparent" --opaque false
```

### Ajustar el tamaño del logo:

```bash
# Logo más grande (menos padding)
--padding "5%"

# Logo más pequeño (más padding)
--padding "25%"

# Padding diferente vertical/horizontal
--padding "calc(50vh - 15%) calc(50vw - 30%)"
```

### Generar solo para dispositivos específicos:

```bash
# Solo iconos de iOS
--icon-only --apple-touch-icon

# Solo splash de iPhone (sin iPad)
--splash-only --portrait-only
```

## Modo Oscuro / Modo Claro 🌓

Si quieres splash screens diferentes para modo oscuro:

```bash
# 1. Primero genera splash screens de modo claro
npx pwa-asset-generator public/logo-light.png public/splash-screens \
  --background "#EDE8E2" \
  --splash-only \
  --type png \
  --index app/layout.tsx

# 2. Luego genera splash screens de modo oscuro
npx pwa-asset-generator public/logo-dark.png public/splash-screens \
  --dark-mode \
  --background "#1A1A1A" \
  --splash-only \
  --type png \
  --index app/layout.tsx
```

## Verificar los Resultados ✅

Después de generar:

```bash
# 1. Ver archivos generados
ls -lh public/icon-*.png
ls -lh public/splash-screens/*.png

# 2. Construir el proyecto
npm run build

# 3. Iniciar en producción
npm start

# 4. Abrir Chrome DevTools > Application > Manifest
# Verificar que todos los iconos aparezcan correctamente
```

## Troubleshooting 🔧

### Error: "Cannot find image file"
```bash
# Verifica que la imagen existe:
ls -lh public/logo-square.png

# Si no existe, cópiala desde donde la tengas
```

### Error: "Running as root without --no-sandbox"
```bash
# En Linux/CI, añade:
--no-sandbox
```

### Los splash screens no se ven en iOS
- Asegúrate de que los tags `<link>` estén en el `<head>` del HTML
- Re-agrega la app a la pantalla de inicio (los cambios no se reflejan automáticamente en apps ya instaladas)

### Los iconos se ven borrosos
```bash
# Usa una imagen base más grande (mínimo 1024x1024)
# O ajusta la calidad:
--quality 100
```

## Recursos Adicionales 📚

- [pwa-asset-generator en GitHub](https://github.com/elegantapp/pwa-asset-generator)
- [Documentación oficial](https://github.com/elegantapp/pwa-asset-generator#readme)
- [Probar iconos maskable](https://maskable.app/)
- [Validar manifest](https://manifest-validator.appspot.com/)

## Comandos Rápidos para Copiar 📋

```bash
# Copiar tus imágenes descargadas a public/
cp ~/Downloads/primera-imagen.png public/logo-square.png
cp ~/Downloads/segunda-imagen.png public/logo-horizontal.png  
cp ~/Downloads/tercera-imagen.png public/logo-splash.png

# Generar todo
./scripts/generate-pwa-assets.sh

# O manualmente:
npx pwa-asset-generator public/logo-square.png public --background "#EDE8E2" --icon-only --favicon --type png --opaque true --padding "10%" --index app/layout.tsx --manifest public/manifest.json --xhtml

npx pwa-asset-generator public/logo-splash.png public/splash-screens --background "#EDE8E2" --splash-only --type png --quality 90 --padding "20%" --index app/layout.tsx --xhtml

# Construir y probar
npm run build && npm start
```

---

✨ **Tip**: El color `#EDE8E2` es el beige claro de tus imágenes. Si quieres cambiarlo, usa un color picker para obtener el código hexadecimal exacto de tu logo.

