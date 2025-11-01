#!/bin/bash

# Script para generar todos los assets PWA usando pwa-asset-generator
# Basado en: https://github.com/elegantapp/pwa-asset-generator

echo "🎨 Generando assets PWA para Oremos..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que existan las imágenes necesarias
if [ ! -f "public/logo-square.png" ] && [ ! -f "public/logo-square.svg" ]; then
  echo "❌ Error: No se encontró el logo cuadrado (logo-square.png o logo-square.svg) en /public"
  echo "   Por favor, guarda tu primera imagen como 'public/logo-square.png'"
  exit 1
fi

if [ ! -f "public/logo-splash.png" ] && [ ! -f "public/logo-splash.svg" ]; then
  echo "⚠️  Advertencia: No se encontró logo-splash.png/svg, se usará logo-square para splash screens"
  SPLASH_LOGO="public/logo-square.png"
else
  SPLASH_LOGO="public/logo-splash.png"
fi

ICON_LOGO="public/logo-square.png"

echo "${BLUE}📦 Paso 1: Generando iconos de la app...${NC}"
echo ""

# Generar SOLO iconos (sin splash screens)
npx pwa-asset-generator "$ICON_LOGO" public \
  --background "#EDE8E2" \
  --icon-only \
  --favicon \
  --type png \
  --opaque true \
  --padding "10%" \
  --index app/layout.tsx \
  --manifest public/manifest.json \
  --xhtml

echo ""
echo "${GREEN}✓ Iconos generados${NC}"
echo ""
echo "${BLUE}📱 Paso 2: Generando splash screens para iOS...${NC}"
echo ""

# Generar SOLO splash screens
npx pwa-asset-generator "$SPLASH_LOGO" public/splash-screens \
  --background "#EDE8E2" \
  --splash-only \
  --type png \
  --quality 90 \
  --padding "20%" \
  --index app/layout.tsx \
  --xhtml

echo ""
echo "${GREEN}✓ Splash screens generados${NC}"
echo ""
echo "${YELLOW}═══════════════════════════════════════════════${NC}"
echo "${GREEN}✅ ¡Todos los assets PWA han sido generados!${NC}"
echo "${YELLOW}═══════════════════════════════════════════════${NC}"
echo ""
echo "📋 Archivos generados:"
echo "   • Iconos: public/icon-*.png"
echo "   • Favicon: public/favicon.ico"
echo "   • Splash screens: public/splash-screens/*.png"
echo ""
echo "📝 Archivos actualizados:"
echo "   • app/layout.tsx (meta tags añadidos)"
echo "   • public/manifest.json (iconos declarados)"
echo ""
echo "${BLUE}🚀 Próximos pasos:${NC}"
echo "   1. Revisar los archivos generados"
echo "   2. Ejecutar: npm run build"
echo "   3. Ejecutar: npm start"
echo "   4. Probar la instalación de la PWA"
echo ""

