# 📱 Oremos 24/7 - Reporte de Funcionalidades

## 🎯 Descripción General
**Oremos 24/7** es una aplicación web progresiva (PWA) diseñada para facilitar la oración continua en comunidad. Permite que personas se unan virtualmente para orar juntas en tiempo real, creando una cadena ininterrumpida de intercesión las 24 horas del día.

---

## ✨ Principales Funcionalidades

### 1. 🙏 **Sistema de Motivos de Oración Dinámicos**
- **Motivos por hora**: Cada hora del día tiene un motivo de oración específico
- **Integración con Google Sheets**: Los motivos se cargan desde una hoja de cálculo de Google Sheets en formato CSV
- **Actualización automática**: La aplicación detecta la hora actual y muestra el motivo correspondiente
- **Formato estructurado**: Cada motivo incluye:
  - Título del motivo
  - Descripción/bajada explicativa
  - Hora asignada

### 2. 👥 **Sala de Oración en Tiempo Real**
- **Conexión simultánea**: Múltiples usuarios pueden conectarse al mismo tiempo
- **Contador en vivo**: Muestra cuántas personas están orando en ese momento
- **Lista de participantes**: Visualización de todos los usuarios conectados con su información:
  - Nombre
  - Edad
  - Iglesia/comunidad a la que pertenecen
- **Tecnología Socket.IO**: Actualizaciones instantáneas sin recargar la página

### 3. 🎵 **Reproductor de Música de Adoración**
- **Música ambiente**: Reproductor integrado de YouTube con música de adoración
- **Controles simples**: Botones de play/pause
- **Información del video**: Muestra título, canal y thumbnail de la música
- **Autoplay inteligente**: Se activa automáticamente al unirse (excepto en iOS por restricciones del navegador)
- **Audio en segundo plano**: El reproductor es discreto y no distrae de la oración

### 4. 🚪 **Modal de Registro Inicial**
- **Pantalla completa de bienvenida**: Modal atractivo al ingresar a la aplicación
- **Formulario de registro**: Solicita datos del usuario:
  - Nombre
  - Edad
  - Iglesia/comunidad
- **Campos opcionales**: Si el usuario no completa algún campo, se asignan valores por defecto
- **Una sola vez por sesión**: Solo aparece al ingresar, no interrumpe después

### 5. 📤 **Sistema de Compartir**
- **Botón de compartir**: Permite difundir el motivo de oración actual
- **Web Share API**: Usa la función nativa de compartir del dispositivo cuando está disponible
- **Fallback a clipboard**: Si el dispositivo no soporta compartir nativo, copia el texto al portapapeles
- **Contenido personalizado**: Genera un mensaje con:
  - Emoji de oración
  - Título del motivo actual
  - Descripción del motivo
  - Link a la aplicación
- **Imagen OG dinámica**: Intenta compartir una imagen personalizada del motivo (cuando el navegador lo permite)

### 6. 📊 **Sistema de Analíticas con Google Sheets**
- **Registro de actividad**: Guarda automáticamente cada evento de usuario
- **Webhook a Google Apps Script**: Envía datos a una hoja de Google Sheets
- **Eventos registrados**:
  - `join`: Cuando un usuario se une
  - `leave`: Cuando un usuario se desconecta
- **Datos capturados**:
  - Timestamp (fecha y hora exacta)
  - Tipo de evento
  - Nombre del usuario
  - Edad
  - Iglesia
  - Socket ID (identificador técnico)
- **No invasivo**: Si falla el envío de analíticas, no afecta la experiencia del usuario

### 7. 🌐 **Aplicación Web Progresiva (PWA)**
- **Instalable**: Se puede instalar en el dispositivo como una app nativa
- **Funciona offline**: Capacidad de funcionar sin conexión (limitada)
- **Iconos y splash screens**: Iconos personalizados para todas las plataformas
- **Manifest configurado**: Optimizado para iOS y Android
- **Service Worker**: Cacheo inteligente de recursos

### 8. 📄 **Página de Propósito/Misión**
- **Ruta `/proposito`**: Página dedicada a explicar la visión
- **Fundamento bíblico**: Versículos relevantes sobre la oración:
  - 1 Tesalonicenses 5:17
  - Mateo 18:20
  - Santiago 5:16
  - Lucas 18:1
- **Visión y misión**: Explica el propósito del movimiento
- **4 pilares principales**:
  - 🔥 Mantener el fuego de oración
  - 🤝 Unir a la comunidad
  - 💪 Fortalecer la fe
  - 🌍 Impactar al mundo
- **Call to action**: Botón para regresar y comenzar a orar

### 9. 🎨 **Interfaz Moderna y Responsiva**
- **Diseño mobile-first**: Optimizado primero para dispositivos móviles
- **Tailwind CSS**: Estilos modernos y consistentes
- **Shadcn UI**: Componentes de alta calidad:
  - Cards elegantes
  - Botones accesibles
  - Skeletons para carga
  - Avatares
  - Formularios validados
- **Modo oscuro/claro**: Soporta preferencias del sistema
- **Animaciones sutiles**: Indicadores de estado (pulsos, transiciones)
- **Accesibilidad**: Cumple con estándares WCAG

### 10. 🔄 **Actualizaciones en Tiempo Real**
- **Socket.IO bidireccional**: Comunicación instantánea cliente-servidor
- **Sin refrescar**: Todas las actualizaciones son en tiempo real
- **Estados sincronizados**:
  - Contador de usuarios online
  - Lista de participantes actualizada
  - Conexiones y desconexiones instantáneas
- **Reconexión automática**: Si se pierde la conexión, intenta reconectar

### 11. 🔐 **Configuración de Seguridad**
- **CORS configurado**: Solo acepta peticiones de dominios autorizados
- **Variables de entorno**: Configuración sensible protegida
- **Validación de datos**: Sanitización de inputs del usuario
- **Timeouts**: Límites de tiempo en peticiones externas

### 12. 🌍 **Despliegue y Escalabilidad**
- **Frontend en Vercel**: Optimizado para Next.js
- **Backend en Fly.io**: Servidor Socket.IO en región GRU (São Paulo)
- **Docker configurado**: Contenedorización para despliegue consistente
- **Dominios personalizados**: `oremos.app` y `www.oremos.app`
- **SSL/HTTPS**: Conexiones seguras en producción

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático para mayor seguridad
- **React 18**: Librería UI moderna
- **Tailwind CSS**: Estilos utility-first
- **Shadcn UI**: Componentes de UI reutilizables
- **Radix UI**: Componentes accesibles sin estilos
- **Socket.IO Client**: Cliente WebSocket
- **Axios**: Cliente HTTP
- **Day.js**: Manejo de fechas
- **PapaParse**: Parser de CSV

### Backend
- **Node.js**: Entorno de ejecución
- **Express.js**: Framework web
- **Socket.IO**: WebSockets en tiempo real
- **CORS**: Control de acceso entre orígenes
- **dotenv**: Manejo de variables de entorno

### Integraciones
- **Google Sheets API**: Base de datos de motivos de oración
- **Google Apps Script**: Webhook para analíticas
- **YouTube API**: Reproductor de música

### DevOps
- **Vercel**: Hosting del frontend
- **Fly.io**: Hosting del backend
- **Docker**: Contenedorización
- **Git**: Control de versiones

---

## 📈 Flujo de Usuario

1. **Ingreso**: Usuario entra a `oremos.app`
2. **Modal de bienvenida**: Se presenta el modal fullscreen
3. **Registro**: Usuario ingresa su nombre, edad e iglesia
4. **Conexión**: Se conecta al servidor Socket.IO
5. **Visualización**: Ve el motivo de oración de la hora actual
6. **Música**: El reproductor comienza automáticamente (si el navegador lo permite)
7. **Comunidad**: Ve cuántas personas están orando y quiénes son
8. **Oración**: El usuario ora por el motivo presentado
9. **Compartir**: Opcionalmente comparte el motivo con otros
10. **Analíticas**: Toda su actividad se registra en Google Sheets
11. **Desconexión**: Al cerrar/salir, se registra su salida

---

## 🎯 Casos de Uso

1. **Oración comunitaria 24/7**: Asegurar que siempre haya alguien orando
2. **Motivos dirigidos**: Guiar la oración con temas específicos por hora
3. **Conexión espiritual**: Sentir que se ora en comunidad aunque cada uno esté en su lugar
4. **Evangelización**: Compartir motivos de oración para invitar a otros
5. **Seguimiento de actividad**: Las analíticas ayudan a ver patrones de participación
6. **Música de adoración**: Crear ambiente propicio para la oración
7. **Movilización**: Ver en tiempo real cuántas personas están orando juntas

---

## 📱 Características Técnicas Destacadas

- ✅ **Progressive Web App (PWA)** completa
- ✅ **Responsive design** (móvil, tablet, desktop)
- ✅ **Real-time updates** con WebSockets
- ✅ **Offline-ready** con Service Worker
- ✅ **SEO optimizado** con meta tags dinámicos
- ✅ **Open Graph images** dinámicas para compartir
- ✅ **TypeScript** para type safety
- ✅ **Modern UI/UX** con animaciones y transiciones
- ✅ **Accessible** (ARIA labels, keyboard navigation)
- ✅ **Performance optimized** (lazy loading, code splitting)
- ✅ **Error handling** robusto en frontend y backend
- ✅ **Environment-based config** (dev/prod)
- ✅ **CORS security** configurado
- ✅ **Scalable architecture** (separación frontend/backend)

---

## 🚀 Comandos Principales

```bash
# Desarrollo (ambos servidores)
npm run dev

# Solo frontend (Next.js)
npm run dev:frontend

# Solo backend (Socket.IO)
npm run dev:backend

# Build de producción
npm run build

# Iniciar en producción
npm start

# Deploy a Fly.io (backend)
fly deploy

# Deploy a Vercel (frontend)
git push origin main
```

---

## 📞 URLs de Producción

- **Frontend**: https://oremos.app
- **Backend Socket.IO**: https://oremosapp.fly.dev

---

*Reporte generado: Octubre 2025*

