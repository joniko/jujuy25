# PWA Setup Guide - Oremos 24/7

## ✅ Implementación Completada

Tu aplicación ahora está configurada como una PWA (Progressive Web App) completa con:

- ✅ Service Worker configurado con Serwist
- ✅ Web App Manifest
- ✅ Meta tags para iOS y Android
- ✅ Soporte offline
- ✅ Cache inteligente
- ✅ Instalable en dispositivos móviles y escritorio

## 🎨 Iconos Necesarios

Para que tu PWA funcione completamente, necesitas crear los siguientes iconos en la carpeta `/public`:

### Iconos Principales (Requeridos)
- `icon-72x72.png` - 72x72px
- `icon-96x96.png` - 96x96px
- `icon-128x128.png` - 128x128px
- `icon-144x144.png` - 144x144px
- `icon-152x152.png` - 152x152px
- `icon-192x192.png` - 192x192px
- `icon-384x384.png` - 384x384px
- `icon-512x512.png` - 512x512px

### Iconos Maskable (Requeridos para Android)
- `icon-192x192-maskable.png` - 192x192px con safe zone
- `icon-512x512-maskable.png` - 512x512px con safe zone

**Nota sobre maskable icons**: Estos iconos deben tener un área de seguridad (safe zone) del 40% alrededor del contenido principal para que Android pueda aplicar diferentes formas sin cortar elementos importantes.

### Screenshots (Opcionales pero recomendados)
- `screenshot-1.png` - 540x720px (móvil, vertical)
- `screenshot-2.png` - 1280x720px (escritorio, horizontal)

## 🛠️ Cómo Generar los Iconos

### Opción 1: Usando una herramienta en línea (Recomendado)

Usa [PWA Icon Generator](https://www.pwabuilder.com/imageGenerator) o [RealFaviconGenerator](https://realfavicongenerator.net/):

1. Sube tu logo/icono base (recomendado: 1024x1024px, PNG con fondo transparente)
2. Genera todos los tamaños automáticamente
3. Descarga el paquete completo
4. Coloca todos los archivos en `/public`

### Opción 2: Usando ImageMagick (CLI)

```bash
# Instalar ImageMagick si no lo tienes
brew install imagemagick  # macOS
# o
sudo apt-get install imagemagick  # Linux

# Generar todos los tamaños desde un icono base
convert icon-base.png -resize 72x72 public/icon-72x72.png
convert icon-base.png -resize 96x96 public/icon-96x96.png
convert icon-base.png -resize 128x128 public/icon-128x128.png
convert icon-base.png -resize 144x144 public/icon-144x144.png
convert icon-base.png -resize 152x152 public/icon-152x152.png
convert icon-base.png -resize 192x192 public/icon-192x192.png
convert icon-base.png -resize 384x384 public/icon-384x384.png
convert icon-base.png -resize 512x512 public/icon-512x512.png
```

### Opción 3: Usar el favicon.ico existente temporalmente

Si necesitas algo rápido para probar, puedes crear un script simple:

```bash
# Crea iconos básicos desde el favicon (solo para testing)
cd public
for size in 72 96 128 144 152 192 384 512; do
  convert favicon.ico -resize ${size}x${size} icon-${size}x${size}.png
done
```

## 📱 Splash Screens para iOS

Las splash screens son opcionales pero mejoran la experiencia en iOS. Si deseas generarlas:

1. Crea una carpeta `/public/splash-screens`
2. Usa [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator):

```bash
npx pwa-asset-generator icon-512x512.png public/splash-screens --scrape false --icon-only false --splash-only
```

Si no quieres crear splash screens ahora, simplemente elimina esas líneas del `layout.tsx` (líneas 24-81).

## 🚀 Testing de PWA

### En Desarrollo

```bash
# El service worker está DESHABILITADO en desarrollo para facilitar el testing
npm run dev
```

### En Producción Local

```bash
# Construir para producción
npm run build

# Ejecutar en modo producción
npm start

# Visita: http://localhost:3000
```

### Verificar PWA

1. **Chrome DevTools**:
   - Abre DevTools (F12)
   - Ve a "Application" > "Manifest"
   - Revisa que todos los campos estén correctos
   - Ve a "Service Workers" y verifica que esté activo

2. **Lighthouse**:
   - Abre DevTools
   - Ve a "Lighthouse"
   - Selecciona "Progressive Web App"
   - Ejecuta el audit
   - Objetivo: 100/100 score

3. **Test de Instalación**:
   - En Chrome/Edge: Busca el icono "Instalar" en la barra de direcciones
   - En móvil: Usa "Agregar a pantalla de inicio"

## 🌐 Deployment

### Vercel (Recomendado)

Tu PWA funcionará automáticamente en Vercel. Solo asegúrate de:

1. Tener los iconos en `/public`
2. Hacer commit de todos los cambios
3. Push a tu repositorio
4. Vercel detectará y compilará correctamente

```bash
git add .
git commit -m "feat: Add PWA support with Serwist"
git push origin main
```

### Otras Plataformas

La PWA debería funcionar en cualquier hosting que soporte Next.js:
- Netlify
- Railway
- Fly.io
- etc.

## 📋 Checklist Final

Antes de considerar tu PWA completa:

- [ ] Todos los iconos generados y en `/public`
- [ ] `manifest.json` con información correcta
- [ ] Service worker compilando sin errores
- [ ] Lighthouse PWA score > 90
- [ ] Prueba de instalación en móvil exitosa
- [ ] Prueba de instalación en escritorio exitosa
- [ ] Funcionalidad offline básica funciona
- [ ] Theme color coincide con el diseño

## 🎯 Características PWA Implementadas

### ✅ Instalable
Los usuarios pueden instalar tu app en su dispositivo (móvil y escritorio)

### ✅ Offline Support
La app funciona sin conexión gracias al service worker

### ✅ Fast Loading
Cache inteligente para cargar rápido en visitas subsecuentes

### ✅ App-like Experience
Se ve y siente como una app nativa cuando se instala

### ✅ Auto-Update
El service worker se actualiza automáticamente cuando hay cambios

## 🔧 Configuración Avanzada

### Cambiar el Comportamiento del Service Worker

Edita `/src/sw.ts` para personalizar:
- Estrategias de cache
- Rutas que deseas cachear
- Tiempo de vida del cache
- etc.

### Modificar el Manifest

Edita `/public/manifest.json` para cambiar:
- Colores del tema
- Orientación preferida
- Display mode
- Categorías
- etc.

### Deshabilitar PWA en Desarrollo

Ya está configurado para deshabilitarse automáticamente en desarrollo. Si quieres habilitarlo:

En `next.config.js`, cambia:
```javascript
disable: process.env.NODE_ENV === 'development', // Cambiar a false
```

## 📚 Recursos Adicionales

- [Serwist Documentation](https://serwist.pages.dev/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## 🐛 Troubleshooting

### El Service Worker no se registra
- Verifica que estés en producción (`npm run build && npm start`)
- El SW está deshabilitado en desarrollo por diseño

### Los iconos no aparecen
- Verifica que los archivos existan en `/public`
- Verifica los nombres exactos en `manifest.json`
- Limpia el cache del navegador

### No puedo instalar la PWA
- Verifica el Lighthouse audit
- Asegúrate de estar usando HTTPS (Vercel lo maneja automáticamente)
- Verifica que el manifest.json sea válido

### Errores de TypeScript en sw.ts
- Verifica que `@serwist/next` esté instalado
- Ejecuta `npm install` de nuevo si es necesario

---

¡Tu app ahora es una PWA completa! 🎉

