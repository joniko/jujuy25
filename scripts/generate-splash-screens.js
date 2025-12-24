#!/usr/bin/env node

/**
 * Script para generar splash screens para iOS con fondo blanco
 * Genera todos los tamaños necesarios desde icon-jujuy25.png
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_BASE = path.join(__dirname, '../public/icons/icon-jujuy25.png');
const OUTPUT_DIR = path.join(__dirname, '../public/splash-screens');
const BACKGROUND_COLOR = { r: 255, g: 255, b: 255 }; // Blanco
const PADDING_PERCENT = 0.2; // 20% de padding

// Tamaños de splash screens (width x height) para iOS
const SPLASH_SIZES = [
  { width: 640, height: 1136 },   // iPhone SE
  { width: 750, height: 1334 },   // iPhone 8
  { width: 828, height: 1792 },    // iPhone XR
  { width: 1125, height: 2436 },  // iPhone X/XS
  { width: 1170, height: 2532 },   // iPhone 14 Pro
  { width: 1179, height: 2556 },   // iPhone 14 Pro (otro tamaño)
  { width: 1242, height: 2208 },   // iPhone 8 Plus
  { width: 1242, height: 2688 },   // iPhone XS Max
  { width: 1284, height: 2778 },   // iPhone 14 Pro Max
  { width: 1290, height: 2796 },   // iPhone 14 Pro Max (otro tamaño)
  { width: 1488, height: 2266 },    // iPad
  { width: 1536, height: 2048 },   // iPad 9.7"
  { width: 1620, height: 2160 },    // iPad 10.2"
  { width: 1640, height: 2360 },    // iPad
  { width: 1668, height: 2224 },   // iPad 10.5"
  { width: 1668, height: 2388 },   // iPad Pro 11"
  { width: 2048, height: 2732 },   // iPad Pro 12.9"
  // Landscape (opcional, pero algunos pueden ser útiles)
  { width: 1136, height: 640 },     // iPhone SE landscape
  { width: 1334, height: 750 },    // iPhone 8 landscape
  { width: 1792, height: 828 },    // iPhone XR landscape
  { width: 2436, height: 1125 },   // iPhone X/XS landscape
  { width: 2532, height: 1170 },   // iPhone 14 Pro landscape
  { width: 2556, height: 1179 },   // iPhone 14 Pro landscape
  { width: 2208, height: 1242 },   // iPhone 8 Plus landscape
  { width: 2688, height: 1242 },   // iPhone XS Max landscape
  { width: 2778, height: 1284 },   // iPhone 14 Pro Max landscape
  { width: 2796, height: 1290 },   // iPhone 14 Pro Max landscape
  { width: 2266, height: 1488 },   // iPad landscape
  { width: 2048, height: 1536 },   // iPad 9.7" landscape
  { width: 2160, height: 1620 },   // iPad 10.2" landscape
  { width: 2360, height: 1640 },   // iPad landscape
  { width: 2224, height: 1668 },   // iPad 10.5" landscape
  { width: 2388, height: 1668 },   // iPad Pro 11" landscape
  { width: 2732, height: 2048 },   // iPad Pro 12.9" landscape
];

async function generateSplashScreen(width, height) {
  const filename = `apple-splash-${width}-${height}.png`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  
  // Calcular el tamaño del contenido con padding del 20%
  const paddingX = Math.floor(width * PADDING_PERCENT);
  const paddingY = Math.floor(height * PADDING_PERCENT);
  const contentWidth = width - (paddingX * 2);
  const contentHeight = height - (paddingY * 2);
  
  // Determinar el tamaño máximo del icono que cabe en el área de contenido
  // Mantener aspect ratio del icono original
  const iconAspectRatio = 1; // Asumiendo que el icono es cuadrado
  let iconWidth, iconHeight;
  
  if (contentWidth / contentHeight > iconAspectRatio) {
    // El área es más ancha que el icono
    iconHeight = contentHeight;
    iconWidth = iconHeight * iconAspectRatio;
  } else {
    // El área es más alta que el icono
    iconWidth = contentWidth;
    iconHeight = iconWidth / iconAspectRatio;
  }
  
  // Crear el splash screen con fondo blanco
  await sharp(ICON_BASE)
    .resize(Math.floor(iconWidth), Math.floor(iconHeight), {
      fit: 'contain',
      background: BACKGROUND_COLOR
    })
    .extend({
      top: paddingY,
      bottom: paddingY,
      left: paddingX,
      right: paddingX,
      background: BACKGROUND_COLOR
    })
    .png()
    .toFile(outputPath);
  
  console.log(`  ✓ Generado: ${filename} (${width}x${height})`);
}

async function main() {
  console.log('📱 Generando splash screens con fondo blanco...\n');
  
  // Verificar que el archivo base existe
  if (!fs.existsSync(ICON_BASE)) {
    console.error(`❌ Error: No se encontró ${ICON_BASE}`);
    process.exit(1);
  }
  
  // Crear directorio de salida si no existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log(`📐 Generando ${SPLASH_SIZES.length} splash screens...\n`);
  
  // Generar todos los splash screens
  for (const { width, height } of SPLASH_SIZES) {
    await generateSplashScreen(width, height);
  }
  
  console.log('\n✅ ¡Todos los splash screens han sido generados exitosamente!');
  console.log(`\n📁 Splash screens generados en: ${OUTPUT_DIR}`);
  console.log('\n🚀 Próximos pasos:');
  console.log('   1. Revisar los splash screens generados');
  console.log('   2. Ejecutar: npm run build');
  console.log('   3. Ejecutar: git add . && git commit -m "feat: Update splash screens with white background" && git push');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});

