#!/usr/bin/env node

/**
 * Script para generar todos los iconos PWA desde icon-jujuy25.png
 * Genera: favicon, apple-touch-icon, android-chrome, y manifest icons
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_BASE = path.join(__dirname, '../public/icons/icon-jujuy25.png');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');
const FAVICON_OUTPUT = path.join(__dirname, '../app/favicon.ico');
const BACKGROUND_COLOR = '#EDE8E2'; // Color beige claro del tema

// Tamaños de iconos necesarios
const ICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-icon-180.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

// Iconos maskable (con safe zone del 80%)
const MASKABLE_SIZES = [
  { size: 192, name: 'manifest-icon-192.maskable.png' },
  { size: 512, name: 'manifest-icon-512.maskable.png' },
];

// Apple touch icon (180x180, pero sin padding adicional)
const APPLE_TOUCH_ICON = 'apple-touch-icon.png';

async function generateIcon(size, outputPath, options = {}) {
  const { padding = 0, maskable = false } = options;
  
  let image = sharp(ICON_BASE);
  
  if (maskable) {
    // Para maskable, el contenido debe estar en el 80% central
    const contentSize = Math.floor(size * 0.8);
    const paddingSize = Math.floor(size * 0.1);
    
    image = image
      .resize(contentSize, contentSize, {
        fit: 'contain',
        background: { r: 237, g: 232, b: 226 } // #EDE8E2
      })
      .extend({
        top: paddingSize,
        bottom: paddingSize,
        left: paddingSize,
        right: paddingSize,
        background: { r: 237, g: 232, b: 226 }
      });
  } else if (padding > 0) {
    // Para iconos normales, aplicar padding del 10%
    const paddingSize = Math.floor(size * padding);
    const contentSize = size - (paddingSize * 2);
    
    image = image
      .resize(contentSize, contentSize, {
        fit: 'contain',
        background: { r: 237, g: 232, b: 226 }
      })
      .extend({
        top: paddingSize,
        bottom: paddingSize,
        left: paddingSize,
        right: paddingSize,
        background: { r: 237, g: 232, b: 226 }
      });
  } else {
    // Sin padding, solo redimensionar
    image = image.resize(size, size, {
      fit: 'contain',
      background: { r: 237, g: 232, b: 226 }
    });
  }
  
  await image.png().toFile(outputPath);
  console.log(`  ✓ Generado: ${path.basename(outputPath)} (${size}x${size})`);
}

async function generateFavicon() {
  // Generar favicon.ico (formato ICO con múltiples tamaños)
  // Sharp no soporta ICO directamente, así que generamos PNGs y luego los combinamos
  // Por ahora, generamos un favicon.ico simple desde el PNG de 32x32
  
  const favicon32Path = path.join(OUTPUT_DIR, 'favicon-32x32.png');
  await generateIcon(32, favicon32Path, { padding: 0 });
  
  // Copiar el favicon-32x32.png como favicon.ico (Next.js acepta PNG como favicon)
  // O mejor, crear un favicon.ico usando el PNG
  const favicon32Buffer = await sharp(favicon32Path).toBuffer();
  
  // Para crear un ICO real, necesitaríamos una librería adicional
  // Por ahora, Next.js puede usar PNG como favicon, así que copiamos
  fs.copyFileSync(favicon32Path, FAVICON_OUTPUT.replace('.ico', '.png'));
  
  // También crear el .ico (Next.js lo buscará)
  // Como sharp no soporta ICO, usamos el PNG de 32x32
  fs.copyFileSync(favicon32Path, FAVICON_OUTPUT);
  
  console.log(`  ✓ Generado: favicon.ico`);
}

async function main() {
  console.log('🎨 Generando iconos PWA desde icon-jujuy25.png...\n');
  
  // Verificar que el archivo base existe
  if (!fs.existsSync(ICON_BASE)) {
    console.error(`❌ Error: No se encontró ${ICON_BASE}`);
    process.exit(1);
  }
  
  // Crear directorio de salida si no existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Generar iconos estándar
  console.log('📐 Generando iconos estándar...');
  for (const { size, name } of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, name);
    await generateIcon(size, outputPath, { padding: 0.1 });
  }
  
  // Generar apple-touch-icon (sin padding adicional, iOS lo maneja)
  console.log('\n🍎 Generando Apple Touch Icon...');
  const appleTouchPath = path.join(OUTPUT_DIR, APPLE_TOUCH_ICON);
  await generateIcon(180, appleTouchPath, { padding: 0 });
  
  // Generar iconos maskable
  console.log('\n🎭 Generando iconos maskable (con safe zone)...');
  for (const { size, name } of MASKABLE_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, name);
    await generateIcon(size, outputPath, { maskable: true });
  }
  
  // Generar favicon
  console.log('\n🔖 Generando favicon...');
  await generateFavicon();
  
  console.log('\n✅ ¡Todos los iconos han sido generados exitosamente!');
  console.log(`\n📁 Iconos generados en: ${OUTPUT_DIR}`);
  console.log(`📁 Favicon generado en: ${path.dirname(FAVICON_OUTPUT)}`);
  console.log('\n🚀 Próximos pasos:');
  console.log('   1. Revisar los iconos generados');
  console.log('   2. Ejecutar: npm run build');
  console.log('   3. Ejecutar: git add . && git commit -m "feat: Update icons from icon-jujuy25.png" && git push');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});

