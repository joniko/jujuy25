# 📋 SPEC - App Viaje Misionero Jujuy

## 🎯 Descripción General
Aplicación web progresiva (PWA) para compartir información del viaje misionero a Jujuy con 120 personas divididas en grupos y responsables. La app utiliza Google Sheets como backend para facilitar la actualización de información sin necesidad de código.

---

## 📱 Funcionalidades Principales

### 1. 📅 **Programa de los 3 Días**
- **Descripción**: Mostrar el cronograma completo de actividades para los 3 días del viaje (Viernes, Sábado, Domingo)
- **Estructura de datos** (Google Sheets):
  - `dia`: Día del viaje (Viernes, Sábado, Domingo) o número (1, 2, 3)
  - `hora`: Hora de la actividad (formato: "5:00", "10:30 - 12:30", "17:00 a 17:45")
  - `actividad`: Nombre/título de la actividad
  - `descripcion`: Descripción detallada (opcional)
  - `lugar`: Lugar donde se realiza (ej: "Regimiento", "Iglesias", "Templo Bíblico MARANATA")
  - `ubicacion`: Ubicación específica para salidas ministeriales (ej: "Humahuaca", "Abra Pampa", "La Quiaca", "Jujuy Capital")
  - `grupo_destino`: Grupos que participan en esta actividad (opcional, para actividades específicas)
  - `responsable`: Persona o grupo responsable (opcional)
  - `tipo`: Tipo de actividad (ej: "Salida Ministerial", "Evangelismo", "Taller", "Almuerzo", "Adoración", "Cena", "Desayuno")
  - `programa_especial`: Indica si es parte de un programa diferenciado (ej: "TBM" para Templo Bíblico MARANATA)
- **Estructura especial para Viernes**:
  - **Salidas Ministeriales Temprano (5:00)**: Actividades diferenciadas para 3 destinos:
    - Humahuaca
    - Abra Pampa
    - La Quiaca
  - **Programa General**: Actividades para todos en Jujuy Capital
  - **Programa Diferenciado TBM**: Actividades específicas en Templo Bíblico MARANATA (taller, altar de adoración, regreso)
- **UI/UX**:
  - Vista por día (tabs o secciones: Viernes, Sábado, Domingo)
  - **Vista especial para Viernes**:
    - Sección destacada para "Salidas Ministeriales" (5:00) con badges/indicadores por destino
    - Sección para "Programa General" en Jujuy Capital
    - Sección separada para "Programa TBM" (Templo Bíblico MARANATA)
  - Indicador de actividad actual (si aplica)
  - Filtros por tipo de actividad
  - Filtros por ubicación (para Viernes)
  - Búsqueda de actividades
  - Link a Maps para cada lugar
  - Badges visuales para diferenciar actividades por ubicación/destino

### 2. 👥 **Listado de Personas**
- **Descripción**: Directorio completo de las 120 personas que viajan, organizadas en 6 grupos con referentes/líderes
- **Función de los Grupos**:
  - **Organización durante todo el viaje**: Cada grupo tiene líderes responsables de asegurar que ningún miembro se pierda durante los 3 días del viaje
  - **Destino del viernes**: El grupo también define a qué destino van el viernes temprano (5:00) para las salidas ministeriales
- **Estructura de Grupos**:
  - **Grupo 1**: Referentes: Flor y Juan - Destino Viernes: **Humahuaca**
  - **Grupo 2**: Referentes: Adrian y Flavia - Destino Viernes: Jujuy Capital
  - **Grupo 3**: Referentes: Eliseo y Ana - Destino Viernes: Jujuy Capital
  - **Grupo 4**: Referentes: Robert - Destino Viernes: **Abra Pampa**
  - **Grupo 5**: Referentes: Fede y Karen - Destino Viernes: **La Quiaca**
  - **Grupo 6**: Referentes: Maxi-Anto / Maru-Joniko - Destino Viernes: Jujuy Capital
- **Estructura de datos** (Google Sheets):
  - `nombre`: Nombre completo (puede incluir apellido en el mismo campo)
  - `apellido`: Apellido (opcional, puede estar en nombre)
  - `grupo`: Grupo al que pertenece (1, 2, 3, 4, 5, 6)
  - `referentes`: Referentes del grupo (ej: "Flor y Juan", "Adrian y Flavia")
  - `destino`: Destino de salida ministerial del viernes (Humahuaca, Abra Pampa, La Quiaca, Jujuy Capital) - **Nota**: El grupo permanece junto durante todo el viaje, este campo solo indica el destino del viernes temprano
  - `rol`: Rol de la persona (Líder, Participante) - opcional
  - `whatsapp`: Número de WhatsApp (formato: +5491123456789)
  - `contacto`: Campo adicional para contacto (puede contener notas como "revisar", "jueves", "sabado")
  - `medio_transporte`: Medio de transporte principal (Avión, Micro, Auto) - opcional
  - `vuelo_ida`: Número de vuelo de ida (si viaja en avión)
  - `vuelo_vuelta`: Número de vuelo de vuelta (si viaja en avión)
  - `hora_llegada`: Hora de llegada a Jujuy (formato: "15:30")
  - `hora_salida`: Hora de salida desde Jujuy (formato: "18:45")
  - `aeropuerto_llegada`: Aeropuerto de llegada (ej: "JUJ" para Jujuy, "SLA" para Salta)
  - `aeropuerto_salida`: Aeropuerto de salida (ej: "JUJ", "SLA")
  - `escala_salta`: Indica si hace escala en Salta (Sí/No) - opcional
  - `micro_salta_jujuy`: Información sobre el micro desde Salta a Jujuy (horario, empresa, etc.) - opcional
  - `dia_llegada`: Día de llegada (jueves, viernes, sabado) - opcional
  - `estado`: Estado de la persona (Activo, BAJA, Revisar) - opcional
  - `notas`: Notas adicionales sobre transporte o viaje (opcional)
- **UI/UX**:
  - Lista filtrable y buscable
  - **Vista por grupo**: Vista destacada para líderes que muestre todos los miembros de su grupo
  - Filtros por grupo (1-6) - **Importante**: Permite a líderes ver rápidamente su grupo completo
  - Filtros por destino (Humahuaca, Abra Pampa, La Quiaca, Jujuy Capital)
  - Filtros por referente/líder
  - Filtros por rol (Líder, Participante)
  - Cards con información organizada
  - Badge visual para mostrar el destino del viernes del grupo
  - Badge visual para líderes (destacado)
  - Botón para contactar por WhatsApp (abre chat) - **Útil para líderes contactar a su grupo**
  - Vista de transporte destacada (vuelos, micros, autos)
  - Indicadores visuales para vuelos próximos
  - Badge visual para medio de transporte (Avión, Micro, Auto)
  - Información destacada para quienes hacen escala en Salta
  - Indicador visual para personas con estado "BAJA" o "Revisar"
  - **Vista agrupada por grupo** (recomendada por defecto para facilitar seguimiento)
  - Contador de personas por grupo
  - **Lista rápida de líderes** con acceso directo a su grupo
  - Exportar a CSV/PDF (opcional)

### 3. 🗺️ **Agenda de Direcciones**
- **Descripción**: Direcciones importantes con links a Maps
- **Estructura de datos** (Google Sheets):
  - `nombre`: Nombre del lugar (ej: "Iglesia Central Jujuy")
  - `tipo`: Tipo de lugar (ej: "Iglesia", "Hospedaje", "Aeropuerto", "Restaurante")
  - `direccion`: Dirección completa
  - `coordenadas`: Coordenadas GPS (lat, lng) - opcional
  - `telefono`: Teléfono de contacto
  - `horario`: Horario de atención (opcional)
  - `descripcion`: Descripción adicional
  - `link_maps`: Link directo a Google Maps (generado automáticamente si hay dirección)
- **UI/UX**:
  - Cards organizadas por tipo
  - Botón "Abrir en Maps" para cada lugar
  - Filtros por tipo de lugar
  - Vista de mapa integrada (opcional, usando Google Maps embed)
  - Indicador de distancia desde ubicación actual (si hay permisos de geolocalización)

### 4. 📞 **Números Útiles**
- **Descripción**: Contactos importantes del viaje
- **Estructura de datos** (Google Sheets):
  - `nombre`: Nombre del contacto (ej: "Combi Principal", "Charter Jujuy")
  - `tipo`: Tipo de contacto (ej: "Transporte", "Emergencia", "Organización", "Hotel")
  - `telefono`: Número de teléfono
  - `whatsapp`: Número de WhatsApp (si es diferente)
  - `email`: Email (opcional)
  - `descripcion`: Descripción o notas
  - `prioridad`: Nivel de prioridad (Alta, Media, Baja) para ordenar
- **UI/UX**:
  - Cards con botones de acción rápida
  - Botón "Llamar" (tel: link)
  - Botón "WhatsApp" (wa.me link)
  - Botón "Email" (mailto: link)
  - Organizados por prioridad
  - Filtros por tipo

### 5. 🏠 **Página de Inicio**
- **Descripción**: Dashboard principal con información destacada
- **Contenido**:
  - Resumen del día actual (si está dentro del rango de fechas del viaje)
  - Próximas actividades
  - Contador de días restantes
  - Accesos rápidos a secciones principales
  - Alertas/notificaciones importantes

### 6. 📱 **Navegación**
- **Menú principal**:
  - Inicio
  - Programa
  - Personas
  - Direcciones
  - Contactos
  - Biblioteca (mantener si es útil)

---

## 🗂️ Estructura de Google Sheets

### Hoja 1: "Programa"
```
| dia | hora | actividad | descripcion | lugar | ubicacion | grupo_destino | responsable | tipo | programa_especial |
|-----|------|-----------|-------------|-------|-----------|---------------|-------------|------|-------------------|
| Viernes | 5:00 | Salidas ministeriales | Salidas ministeriales | - | Humahuaca | - | - | Salida Ministerial | - |
| Viernes | 5:00 | Salidas ministeriales | Salidas ministeriales | - | Abra Pampa | - | - | Salida Ministerial | - |
| Viernes | 5:00 | Salidas ministeriales | Salidas ministeriales | - | La Quiaca | - | - | Salida Ministerial | - |
| Viernes | 10:30 - 12:30 | Evangelismo puerta a puerta | Evangelismo puerta a puerta | - | Jujuy Capital | - | - | Evangelismo | - |
| Viernes | 13:00 | Almuerzo en iglesias | Almuerzo en iglesias | Iglesias | Jujuy Capital | - | - | Almuerzo | - |
| Viernes | 15:00 - 17:00 | Mensaje de salvación + altar de adoración | Mensaje de salvación + altar de adoración | - | Jujuy Capital | - | - | Adoración | - |
| Viernes | 17:00 a 17:45 | Taller | Taller | Templo Bíblico MARANATA | Jujuy Capital | - | - | Taller | TBM |
| Viernes | 18 a 19:45 | Altar de adoración | Altar de adoración | Templo Bíblico MARANATA | Jujuy Capital | - | - | Adoración | TBM |
| Viernes | 20:00 | Regreso al regimiento | Regreso al regimiento | Regimiento | Jujuy Capital | - | - | Transporte | TBM |
| Viernes | 17:30 - 20:30 | Vuelta al regimiento | Vuelta al regimiento | Regimiento | Jujuy Capital | - | - | Transporte | - |
| Viernes | 20:30 | Cena todos juntos en regimiento | Cena todos juntos en regimiento | Regimiento | Jujuy Capital | - | - | Cena | - |
| Sábado | 7:00 - 7:30 | Desayuno | Desayuno | - | Jujuy Capital | - | - | Desayuno | - |
| Sábado | 8:30 - 10:00 | Taller Jovs IEE + Jovs TBM | Taller Jovs IEE + Jovs TBM | - | Jujuy Capital | - | - | Taller | - |
| Sábado | 10:15 | Salidas ministeriales (Evangelismo) | Salidas ministeriales (Evangelismo) | - | Jujuy Capital | - | - | Salida Ministerial | - |
| Sábado | 13:30 | Almuerzo | Almuerzo | - | Jujuy Capital | - | - | Almuerzo | - |
| Sábado | 16:30 - 17:30 | Taller | Taller | - | Jujuy Capital | - | - | Taller | - |
| Sábado | 17:00 - 20:00 | Adoración Pública + Evangelismo + Intercesión | Adoración Pública + Evangelismo + Intercesión | - | Jujuy Capital | - | - | Adoración | - |
| Sábado | 21:00 | Cena + Acto Profético | Cena + Acto Profético | - | Jujuy Capital | - | - | Cena | - |
| Sábado | 23:00 | Vuelta al Hospedaje | Vuelta al Hospedaje | Hospedaje | Jujuy Capital | - | - | Transporte | - |
| Domingo | 8:00 - 8:30 | Desayuno | Desayuno | - | Jujuy Capital | - | - | Desayuno | - |
| Domingo | 9:30 - 10:30 | Visita a Iglesias TBM | Visita a Iglesias TBM | Iglesias TBM | Jujuy Capital | - | - | Visita | - |
| Domingo | 11:00 - 12:30 | Almuerzo (corre por cuenta de cada uno) | Almuerzo (corre por cuenta de cada uno) | - | Jujuy Capital | - | - | Almuerzo | - |
| Domingo | 13:00 - 23:00 | Tiempo Libre + Preparación para la vuelta de los Jovs | Tiempo Libre + Preparación para la vuelta de los Jovs | - | Jujuy Capital | - | - | Tiempo Libre | - |
```

**Notas importantes**:
- Las salidas ministeriales del viernes (5:00) deben mostrarse como 3 actividades separadas, una por cada destino
- El programa TBM (Templo Bíblico MARANATA) debe mostrarse como una sección diferenciada el viernes
- El campo `ubicacion` diferencia entre "Jujuy Capital" y los destinos de las salidas ministeriales

### Hoja 2: "Personas"
```
| nombre | grupo | rol | referentes | destino | whatsapp | contacto | vuelo_ida | vuelo_vuelta | hora_llegada | hora_salida | aeropuerto_llegada | aeropuerto_salida | dia_llegada | estado | notas |
|--------|-------|-----|------------|---------|----------|----------|-----------|---------------|--------------|-------------|-------------------|------------------|-------------|--------|-------|
| Abril Ojeda | 1 | - | Flor y Juan | Humahuaca | +5491123456789 | revisar | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Noelia Diaz | 1 | - | Flor y Juan | Humahuaca | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Juan Szkarlatiuk | 1 | Líder | Flor y Juan | Humahuaca | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Florencia Monsalvo | 1 | Líder | Flor y Juan | Humahuaca | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Sofia Caballero | 2 | - | Adrian y Flavia | Jujuy Capital | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Lucas Amaya | 2 | - | Adrian y Flavia | Jujuy Capital | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Adrian Muelas | 2 | Líder | Adrian y Flavia | Jujuy Capital | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Agus Luna | 4 | - | Robert | Abra Pampa | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Roberto Janik | 4 | Líder | Robert | Abra Pampa | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Brisa Mereles | 5 | - | Fede y Karen | La Quiaca | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Federico Ruiz | 5 | Líder | Fede y Karen | La Quiaca | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Karen Galeano | 5 | Líder | Fede y Karen | La Quiaca | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Rocio Mansilla | 6 | - | Maxi-Anto / Maru-Joniko | Jujuy Capital | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
| Maximiliano Zeravika | 6 | Líder | Maxi-Anto / Maru-Joniko | Jujuy Capital | +5491123456789 | - | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | - | Activo | - |
```

**Notas importantes**:
- El campo `rol` con "Líder" identifica a los referentes/líderes de cada grupo
- Los referentes se pueden inferir del grupo o estar explícitos en la columna `referentes`
- El campo `destino` indica a dónde va cada grupo el viernes temprano (5:00)
- Grupos 1, 4 y 5 tienen destinos específicos (Humahuaca, Abra Pampa, La Quiaca)
- Grupos 2, 3 y 6 permanecen en Jujuy Capital
- El campo `contacto` puede contener: "revisar", "jueves", "sabado", etc.
- El campo `estado` puede ser: "Activo", "BAJA", "Revisar"

**Notas importantes**:
- El campo `destino` indica a dónde va cada grupo el viernes temprano (5:00)
- Grupos 1, 4 y 5 tienen destinos específicos (Humahuaca, Abra Pampa, La Quiaca)
- Grupos 2, 3 y 6 permanecen en Jujuy Capital
- El campo `contacto` puede contener: "revisar", "jueves", "sabado", etc.
- El campo `estado` puede ser: "Activo", "BAJA", "Revisar"
- El campo `dia_llegada` indica si llegan antes del viernes (jueves) o después (sabado)

### Hoja 3: "Direcciones"
```
| nombre | tipo | direccion | coordenadas | telefono | horario | descripcion |
|--------|------|-----------|-------------|----------|---------|-------------|
| Iglesia Central | Iglesia | Av. Principal 123, Jujuy | -24.1858,-65.2995 | +5493884123456 | 9:00-18:00 | Iglesia principal |
```

### Hoja 4: "Contactos"
```
| nombre | tipo | telefono | whatsapp | email | descripcion | prioridad |
|--------|------|----------|----------|-------|-------------|-----------|
| Combi Principal | Transporte | +5493884123456 | +5493884123456 | combi@email.com | Transporte del grupo | Alta |
```

---

## 🎨 Diseño y UX

### Principios de Diseño
- **Mobile-first**: Optimizado para uso en celulares durante el viaje
- **Offline-first**: Funciona sin conexión (con Service Worker)
- **Rápido y ligero**: Carga rápida incluso con datos móviles limitados
- **Accesible**: Fácil de usar incluso en situaciones de estrés

### Componentes Reutilizables
- Cards para actividades, personas, direcciones
- Filtros y búsqueda
- Botones de acción (WhatsApp, Maps, Teléfono)
- Modales para detalles
- Tabs para días del programa

### Paleta de Colores
- Mantener el esquema actual o adaptarlo al tema del viaje
- Colores distintivos por tipo de contenido

---

## 🔧 Configuración Técnica

### Variables de Entorno
```env
# Google Sheets URLs (una por hoja o usar GIDs)
NEXT_PUBLIC_SHEETS_PROGRAMA_URL=
NEXT_PUBLIC_SHEETS_PERSONAS_URL=
NEXT_PUBLIC_SHEETS_DIRECCIONES_URL=
NEXT_PUBLIC_SHEETS_CONTACTOS_URL=

# O usar GIDs si todo está en un mismo Sheet
NEXT_PUBLIC_SHEETS_PROGRAMA_GID=
NEXT_PUBLIC_SHEETS_PERSONAS_GID=
NEXT_PUBLIC_SHEETS_DIRECCIONES_GID=
NEXT_PUBLIC_SHEETS_CONTACTOS_GID=
```

### Rutas de la Aplicación
- `/` - Inicio/Dashboard
- `/programa` - Programa de los 3 días
- `/personas` - Listado de personas
- `/direcciones` - Agenda de direcciones
- `/contactos` - Números útiles
- `/biblioteca` - Biblioteca (mantener si es útil)

---

## 📊 Flujo de Datos

1. **Carga inicial**: Fetch de todas las hojas de Google Sheets
2. **Actualización**: Auto-refresh cada 30-60 segundos
3. **Cache**: Almacenar datos en localStorage para uso offline
4. **Sincronización**: Detectar cambios y actualizar UI

---

## ✅ Criterios de Éxito

- ✅ Todos los datos se cargan desde Google Sheets
- ✅ La app funciona offline (con datos cacheados)
- ✅ Búsqueda y filtros funcionan correctamente
- ✅ Links a WhatsApp, Maps y teléfono funcionan
- ✅ UI responsive y fácil de usar
- ✅ Carga rápida (< 3 segundos)
- ✅ PWA instalable en móviles

---

## 🚀 Funcionalidades Futuras (Opcional)

- Notificaciones push para actividades próximas
- Chat grupal integrado
- Galería de fotos del viaje
- Check-in de asistencia
- Mapa interactivo con ubicaciones
- Compartir información específica (actividad, persona, etc.)

---

*Spec creado: Diciembre 2024*

