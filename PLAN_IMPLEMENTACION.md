# 🚀 Plan de Implementación - App Viaje Misionero Jujuy

## 📋 Fase 1: Preparación y Estructura Base

### 1.1 Actualizar Configuración
- [ ] Actualizar `env.example` con nuevas variables de entorno para las hojas de Google Sheets
- [ ] Crear estructura de carpetas para nuevas páginas
- [ ] Actualizar `TopNav.tsx` con nuevas rutas de navegación

### 1.2 Tipos TypeScript
- [ ] Crear `types/viaje.ts` con interfaces para:
  - `Actividad` (programa) - incluir campos: dia, hora, actividad, descripcion, lugar, ubicacion, grupo_destino, responsable, tipo, programa_especial
  - `Persona` (listado) - incluir campos: nombre, grupo, rol, referentes, destino, whatsapp, contacto, vuelo_ida, vuelo_vuelta, hora_llegada, hora_salida, aeropuerto_llegada, aeropuerto_salida, dia_llegada, estado, notas
  - `Direccion` (agenda)
  - `Contacto` (números útiles)

### 1.3 Helpers y Utilidades
- [ ] Crear `lib/sheets.ts` con funciones para:
  - Fetch de diferentes hojas de Google Sheets
  - Parsing de CSV con PapaParse
  - Cache management
- [ ] Crear `lib/maps.ts` para generar links de Google Maps
- [ ] Crear `lib/whatsapp.ts` para generar links de WhatsApp

---

## 📅 Fase 2: Programa de los 3 Días

### 2.1 Página `/programa`
- [ ] Crear `app/programa/page.tsx`
- [ ] Implementar fetch de datos desde Google Sheets
- [ ] Crear componente `ProgramaDay` para mostrar actividades por día
- [ ] Implementar tabs o secciones para los 3 días (Viernes, Sábado, Domingo)
- [ ] **Vista especial para Viernes**:
  - [ ] Sección destacada "Salidas Ministeriales (5:00)" con 3 cards/badges:
    - Humahuaca
    - Abra Pampa
    - La Quiaca
  - [ ] Sección "Programa General" para actividades en Jujuy Capital
  - [ ] Sección separada "Programa TBM" (Templo Bíblico MARANATA) con estilo diferenciado
- [ ] Agregar indicador de actividad actual
- [ ] Agregar filtros por tipo de actividad
- [ ] Agregar filtros por ubicación (especialmente útil para Viernes)
- [ ] Agregar búsqueda de actividades
- [ ] Agregar botón "Abrir en Maps" para cada lugar

### 2.2 Componentes
- [ ] Crear `components/ProgramaCard.tsx` para mostrar cada actividad
- [ ] Crear `components/SalidasMinisteriales.tsx` para la sección especial del viernes
- [ ] Crear `components/ProgramaTBM.tsx` para el programa diferenciado del TBM
- [ ] Crear `components/ProgramaFilters.tsx` para filtros
- [ ] Crear `components/ProgramaSearch.tsx` para búsqueda
- [ ] Crear `components/UbicacionBadge.tsx` para mostrar badges de ubicación (Humahuaca, Abra Pampa, La Quiaca, Jujuy Capital)

### 2.3 Funcionalidades
- [ ] Detectar actividad actual basada en hora del día
- [ ] Resaltar actividades próximas
- [ ] Generar links de Google Maps desde direcciones
- [ ] Diferenciar visualmente las salidas ministeriales del viernes (5:00) con badges/colores distintivos
- [ ] Agrupar actividades del programa TBM en sección separada el viernes
- [ ] Manejar rangos de horas (ej: "10:30 - 12:30", "17:00 a 17:45")

---

## 👥 Fase 3: Listado de Personas

### 3.1 Página `/personas`
- [ ] Crear `app/personas/page.tsx`
- [ ] Implementar fetch de datos desde Google Sheets
- [ ] Crear vista de lista/cards de personas
- [ ] Implementar búsqueda por nombre y apellido
- [ ] **Vista por grupo (prioritaria)**: Vista que agrupa personas por grupo para facilitar seguimiento de líderes
- [ ] Implementar filtros por grupo (1-6) - **Crítico**: Permite a líderes ver rápidamente su grupo completo
- [ ] Implementar filtros por destino (Humahuaca, Abra Pampa, La Quiaca, Jujuy Capital)
- [ ] Implementar filtros por referente/líder
- [ ] Implementar filtros por rol (Líder, Participante)
- [ ] Implementar filtros por estado (Activo, BAJA, Revisar)
- [ ] Agregar vista de vuelos destacada
- [ ] **Vista agrupada por grupo como vista por defecto** (facilita seguimiento durante el viaje)
- [ ] **Acceso rápido para líderes**: Botón o sección que muestre solo el grupo del líder actual

### 3.2 Componentes
- [ ] Crear `components/PersonaCard.tsx` para mostrar cada persona
- [ ] Crear `components/GrupoSection.tsx` para agrupar personas por grupo (vista principal)
- [ ] Crear `components/PersonaFilters.tsx` para filtros (grupo, destino, referente, estado)
- [ ] Crear `components/PersonaSearch.tsx` para búsqueda
- [ ] Crear `components/VueloBadge.tsx` para mostrar info de vuelos
- [ ] Crear `components/DestinoBadge.tsx` para mostrar el destino del viernes del grupo
- [ ] Crear `components/EstadoBadge.tsx` para mostrar estado (BAJA, Revisar)
- [ ] Crear `components/RolBadge.tsx` para mostrar si es Líder
- [ ] Crear `components/LiderQuickAccess.tsx` para acceso rápido de líderes a su grupo

### 3.3 Funcionalidades
- [ ] Botón "Contactar por WhatsApp" que abre chat (solo si tiene whatsapp)
- [ ] Formatear números de teléfono
- [ ] Indicadores visuales para vuelos próximos
- [ ] Mostrar información de referentes/líderes en cada card
- [ ] Mostrar destino del viernes del grupo con badge visual
- [ ] Mostrar badge "Líder" para personas con rol "Líder"
- [ ] **Vista agrupada por grupo como predeterminada** (facilita seguimiento durante el viaje)
- [ ] **Sección destacada por grupo** con header mostrando referentes y destino del viernes
- [ ] Indicadores visuales para personas con estado "BAJA" (gris, tachado)
- [ ] Indicadores visuales para personas que necesitan "Revisar" contacto
- [ ] Contador de personas por grupo (mostrar en header de cada grupo)
- [ ] Contador de líderes por grupo
- [ ] **Funcionalidad para líderes**: Botón "Ver mi grupo" que filtra automáticamente su grupo
- [ ] **Lista de contactos del grupo**: Fácil acceso a WhatsApp de todos los miembros del grupo

---

## 🗺️ Fase 4: Agenda de Direcciones

### 4.1 Página `/direcciones`
- [ ] Crear `app/direcciones/page.tsx`
- [ ] Implementar fetch de datos desde Google Sheets
- [ ] Crear vista de cards organizadas por tipo
- [ ] Implementar filtros por tipo de lugar
- [ ] Agregar vista de mapa (opcional, embed de Google Maps)

### 4.2 Componentes
- [ ] Crear `components/DireccionCard.tsx` para mostrar cada lugar
- [ ] Crear `components/DireccionFilters.tsx` para filtros
- [ ] Crear `components/MapsEmbed.tsx` para mapa integrado (opcional)

### 4.3 Funcionalidades
- [ ] Botón "Abrir en Maps" que genera link correcto
- [ ] Usar coordenadas si están disponibles, sino usar dirección
- [ ] Agrupar por tipo de lugar
- [ ] Mostrar información adicional (teléfono, horario)

---

## 📞 Fase 5: Números Útiles

### 5.1 Página `/contactos`
- [ ] Crear `app/contactos/page.tsx`
- [ ] Implementar fetch de datos desde Google Sheets
- [ ] Crear vista de cards con botones de acción
- [ ] Organizar por prioridad

### 5.2 Componentes
- [ ] Crear `components/ContactoCard.tsx` para mostrar cada contacto
- [ ] Agregar botones de acción (Llamar, WhatsApp, Email)

### 5.3 Funcionalidades
- [ ] Botón "Llamar" (tel: link)
- [ ] Botón "WhatsApp" (wa.me link)
- [ ] Botón "Email" (mailto: link)
- [ ] Ordenar por prioridad

---

## 🏠 Fase 6: Página de Inicio Actualizada

### 6.1 Dashboard Principal
- [ ] Actualizar `app/page.tsx` para mostrar:
  - Resumen del día actual (si está en rango de fechas)
  - Próximas actividades
  - Contador de días restantes
  - Accesos rápidos a secciones
  - Alertas/notificaciones importantes

### 6.2 Componentes
- [ ] Crear `components/DashboardCard.tsx` para secciones del dashboard
- [ ] Crear `components/CountdownTimer.tsx` para días restantes
- [ ] Crear `components/QuickLinks.tsx` para accesos rápidos

---

## 🎨 Fase 7: UI/UX y Navegación

### 7.1 Navegación
- [ ] Actualizar `components/TopNav.tsx` con nuevas rutas:
  - Inicio
  - Programa
  - Personas
  - Direcciones
  - Contactos
  - Biblioteca (mantener)

### 7.2 Estilos y Componentes
- [ ] Asegurar consistencia visual en todas las páginas
- [ ] Agregar skeletons de carga
- [ ] Agregar estados vacíos
- [ ] Agregar manejo de errores

### 7.3 Responsive Design
- [ ] Verificar que todas las páginas sean responsive
- [ ] Optimizar para móviles
- [ ] Probar en diferentes tamaños de pantalla

---

## 🔧 Fase 8: Funcionalidades Offline y PWA

### 8.1 Service Worker
- [ ] Actualizar Service Worker para cachear datos de Google Sheets
- [ ] Implementar estrategia de cache para datos
- [ ] Agregar sincronización en background

### 8.2 LocalStorage
- [ ] Implementar cache de datos en localStorage
- [ ] Agregar timestamps para invalidar cache
- [ ] Manejar actualizaciones de datos

### 8.3 PWA
- [ ] Verificar que la app sea instalable
- [ ] Actualizar manifest.json si es necesario
- [ ] Probar instalación en iOS y Android

---

## 🧪 Fase 9: Testing y Optimización

### 9.1 Testing
- [ ] Probar carga de datos desde Google Sheets
- [ ] Probar filtros y búsquedas
- [ ] Probar links (WhatsApp, Maps, Teléfono)
- [ ] Probar funcionalidad offline
- [ ] Probar en diferentes navegadores

### 9.2 Optimización
- [ ] Optimizar imágenes y assets
- [ ] Minimizar bundle size
- [ ] Optimizar carga inicial
- [ ] Agregar lazy loading donde sea necesario

### 9.3 Performance
- [ ] Verificar Core Web Vitals
- [ ] Optimizar re-renders
- [ ] Optimizar fetch de datos

---

## 📝 Fase 10: Documentación y Deploy

### 10.1 Documentación
- [ ] Crear guía de uso de Google Sheets
- [ ] Documentar estructura de datos requerida
- [ ] Crear README con instrucciones de setup
- [ ] Documentar variables de entorno

### 10.2 Deploy
- [ ] Configurar variables de entorno en producción
- [ ] Hacer build de producción
- [ ] Probar en producción
- [ ] Verificar que todo funcione correctamente

---

## 📊 Orden de Implementación Recomendado

1. **Fase 1** (Preparación) - 1-2 horas
2. **Fase 2** (Programa) - 2-3 horas
3. **Fase 3** (Personas) - 2-3 horas
4. **Fase 4** (Direcciones) - 1-2 horas
5. **Fase 5** (Contactos) - 1 hora
6. **Fase 6** (Dashboard) - 1-2 horas
7. **Fase 7** (UI/UX) - 1-2 horas
8. **Fase 8** (Offline/PWA) - 1-2 horas
9. **Fase 9** (Testing) - 1-2 horas
10. **Fase 10** (Deploy) - 1 hora

**Tiempo estimado total: 12-20 horas**

---

## 🎯 Prioridades

### Alta Prioridad (MVP)
- ✅ Programa de los 3 días
- ✅ Listado de personas con WhatsApp
- ✅ Agenda de direcciones con Maps
- ✅ Números útiles con acciones rápidas

### Media Prioridad
- Dashboard actualizado
- Filtros y búsqueda avanzada
- Funcionalidad offline

### Baja Prioridad (Nice to have)
- Vista de mapa integrada
- Notificaciones push
- Exportar datos

---

## ❓ Preguntas para el Usuario

1. **Fechas del viaje**: ¿Cuáles son las fechas exactas del viaje? (para el contador de días)
2. **Estructura de grupos**: ¿Cómo están organizados los grupos? (nombres, cantidad de personas por grupo)
3. **Responsables**: ¿Hay responsables por grupo o solo algunos grupos tienen responsables?
4. **Lugares**: ¿Ya tienen las direcciones completas o necesitan ayuda para estructurarlas?
5. **Contactos**: ¿Qué tipos de contactos necesitan? (solo transporte, o también hoteles, restaurantes, etc.)
6. **Diseño**: ¿Quieren mantener el diseño actual o prefieren un tema específico para el viaje?
7. **Funcionalidades adicionales**: ¿Hay algo más que les gustaría agregar?

---

*Plan creado: Diciembre 2024*

