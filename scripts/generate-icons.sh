#!/bin/bash

# Script para generar iconos PWA desde un icono base
# Uso: ./scripts/generate-icons.sh path/to/icon-base.png

if [ -z "$1" ]; then
  echo "❌ Error: Debes proporcionar la ruta al icono base"
  echo "Uso: ./scripts/generate-icons.sh path/to/icon-base.png"
  echo ""
  echo "💡 Recomendaciones para el icono base:"
  echo "   - Tamaño: 1024x1024px o mayor"
  echo "   - Formato: PNG con fondo transparente"
  echo "   - Contenido: Centrado y con margen de seguridad del 10%"
  exit 1
fi

ICON_BASE="$1"

if [ ! -f "$ICON_BASE" ]; then
  echo "❌ Error: El archivo $ICON_BASE no existe"
  exit 1
fi

if ! command -v convert &> /dev/null; then
  echo "❌ ImageMagick no está instalado"
  echo ""
  echo "Instálalo con:"
  echo "  macOS:   brew install imagemagick"
  echo "  Ubuntu:  sudo apt-get install imagemagick"
  echo "  Windows: https://imagemagick.org/script/download.php"
  exit 1
fi

echo "🎨 Generando iconos PWA desde $ICON_BASE..."
echo ""

# Directorio de salida
OUTPUT_DIR="public"

# Tamaños de iconos estándar
SIZES=(72 96 128 144 152 192 384 512)

# Generar iconos estándar
for size in "${SIZES[@]}"; do
  echo "  📐 Generando icon-${size}x${size}.png..."
  convert "$ICON_BASE" -resize ${size}x${size} "$OUTPUT_DIR/icon-${size}x${size}.png"
done

# Generar iconos maskable (con safe zone del 10%)
echo ""
echo "🎭 Generando iconos maskable (con safe zone)..."

# Para maskable, el contenido debe estar dentro del 80% central
# Agregamos un fondo y padding
for size in 192 512; do
  echo "  📐 Generando icon-${size}x${size}-maskable.png..."
  # Crear fondo blanco, redimensionar y centrar con margen
  convert "$ICON_BASE" \
    -resize $((size * 80 / 100))x$((size * 80 / 100)) \
    -background white \
    -gravity center \
    -extent ${size}x${size} \
    "$OUTPUT_DIR/icon-${size}x${size}-maskable.png"
done

echo ""
echo "✅ ¡Iconos generados exitosamente!"
echo ""
echo "📋 Archivos creados:"
ls -lh "$OUTPUT_DIR"/icon-*.png
echo ""
echo "🚀 Siguiente paso: npm run build"

