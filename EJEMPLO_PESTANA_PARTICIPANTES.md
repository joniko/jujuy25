# 📋 Ejemplo de Estructura - Pestaña "Participantes"

## Estructura de Columnas

```
| nombre | grupo | rol | referentes | destino | whatsapp | contacto | medio_transporte | vuelo_ida | vuelo_vuelta | hora_llegada | hora_salida | aeropuerto_llegada | aeropuerto_salida | escala_salta | micro_salta_jujuy | dia_llegada | estado | notas |
```

## Ejemplo de Datos (Primeras filas)

```
| nombre | grupo | rol | referentes | destino | whatsapp | contacto | medio_transporte | vuelo_ida | vuelo_vuelta | hora_llegada | hora_salida | aeropuerto_llegada | aeropuerto_salida | escala_salta | micro_salta_jujuy | dia_llegada | estado | notas |
|--------|-------|-----|------------|---------|----------|----------|------------------|-----------|---------------|--------------|-------------|-------------------|------------------|--------------|-------------------|-------------|--------|-------|
| Abril Ojeda | 1 | | Flor y Juan | Humahuaca | +5491123456789 | revisar | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Noelia Diaz | 1 | | Flor y Juan | Humahuaca | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Juan Szkarlatiuk | 1 | Líder | Flor y Juan | Humahuaca | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Florencia Monsalvo | 1 | Líder | Flor y Juan | Humahuaca | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Sofia Caballero | 2 | | Adrian y Flavia | Jujuy Capital | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | SLA | Sí | Micro 18:00 - Flecha Bus | | Activo | |
| Lucas Amaya | 2 | | Adrian y Flavia | Jujuy Capital | +5491123456789 | | Micro | | | 20:00 | 22:00 | | | No | | | Activo | Viaja en micro desde BA |
| Adrian Muelas | 2 | Líder | Adrian y Flavia | Jujuy Capital | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Flavia Ramos | 2 | Líder | Adrian y Flavia | Jujuy Capital | +5491123456789 | | Auto | | | 16:00 | 19:00 | | | No | | | Activo | Viaja en auto |
| Camila Aguirre | 3 | | Eliseo y Ana | Jujuy Capital | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | SLA | Sí | Micro 18:00 - Balut | | Activo | |
| Eliseo Lisniczuk | 3 | Líder | Eliseo y Ana | Jujuy Capital | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Analia Lisniczuk | 3 | Líder | Eliseo y Ana | Jujuy Capital | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Agus Luna | 4 | | Robert | Abra Pampa | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Roberto Janik | 4 | Líder | Robert | Abra Pampa | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Brisa Mereles | 5 | | Fede y Karen | La Quiaca | +5491123456789 | | Micro | | | 20:00 | 22:00 | | | No | | | Activo | Viaja en micro |
| Federico Ruiz | 5 | Líder | Fede y Karen | La Quiaca | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Karen Galeano | 5 | Líder | Fede y Karen | La Quiaca | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Julieta Gomez | 6 | | Maxi-Anto / Maru-Joniko | Jujuy Capital | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | SLA | Sí | Micro 19:00 - Balut | | Activo | |
| Maximiliano Zeravika | 6 | Líder | Maxi-Anto / Maru-Joniko | Jujuy Capital | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Antonela Righi | 6 | Líder | Maxi-Anto / Maru-Joniko | Jujuy Capital | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Jonatan Flores | 6 | Líder | Maxi-Anto / Maru-Joniko | Jujuy Capital | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
| Marianela Liboa | 6 | Líder | Maxi-Anto / Maru-Joniko | Jujuy Capital | +5491123456789 | | Avión | AR1234 | AR5678 | 15:30 | 18:45 | EZE | JUJ | No | | | Activo | |
```

## Descripción de Columnas

### Columnas Obligatorias
- **nombre**: Nombre completo de la persona (ej: "Abril Ojeda", "Juan Szkarlatiuk")
- **grupo**: Número del grupo (1, 2, 3, 4, 5, 6)
- **destino**: Destino de salida ministerial del viernes:
  - `Humahuaca` (Grupo 1)
  - `Abra Pampa` (Grupo 4)
  - `La Quiaca` (Grupo 5)
  - `Jujuy Capital` (Grupos 2, 3, 6)

### Columnas Opcionales pero Recomendadas
- **rol**: `Líder` si es referente del grupo, dejar vacío si es participante
- **referentes**: Nombres de los referentes del grupo:
  - Grupo 1: `Flor y Juan`
  - Grupo 2: `Adrian y Flavia`
  - Grupo 3: `Eliseo y Ana`
  - Grupo 4: `Robert`
  - Grupo 5: `Fede y Karen`
  - Grupo 6: `Maxi-Anto / Maru-Joniko`
- **whatsapp**: Número completo con código de país (ej: `+5491123456789`)
- **contacto**: Notas sobre el contacto (ej: `revisar`, `jueves`, `sabado`)

### Columnas de Transporte (Opcionales)
- **medio_transporte**: Medio de transporte principal:
  - `Avión` - Viaja en avión directo a Jujuy o con escala en Salta
  - `Micro` - Viaja en micro/ómnibus
  - `Auto` - Viaja en auto particular
- **vuelo_ida**: Número de vuelo de ida (si viaja en avión, ej: `AR1234`)
- **vuelo_vuelta**: Número de vuelo de vuelta (si viaja en avión, ej: `AR5678`)
- **hora_llegada**: Hora de llegada a Jujuy (formato: `15:30` o `3:30 PM`)
- **hora_salida**: Hora de salida desde Jujuy (formato: `18:45` o `6:45 PM`)
- **aeropuerto_llegada**: Código del aeropuerto de llegada:
  - `JUJ` - Aeropuerto de Jujuy (llegada directa)
  - `SLA` - Aeropuerto de Salta (si hace escala)
  - `EZE` o `AEP` - Aeropuerto de salida desde Buenos Aires
- **aeropuerto_salida**: Código del aeropuerto de salida (ej: `JUJ`, `SLA`)
- **escala_salta**: Indica si hace escala en Salta:
  - `Sí` - Vuela a Salta y luego toma micro a Jujuy
  - `No` - Vuela directo a Jujuy o viaja en micro/auto
- **micro_salta_jujuy**: Información sobre el micro desde Salta a Jujuy (si aplica):
  - Formato: `Micro [hora] - [empresa]` (ej: `Micro 18:00 - Flecha Bus`)
  - O simplemente la hora y empresa
- **dia_llegada**: Día de llegada si es diferente al viernes (ej: `jueves`, `sabado`)

### Columnas de Estado (Opcionales)
- **estado**: Estado de la persona:
  - `Activo` (por defecto)
  - `BAJA` (si no va)
  - `Revisar` (si necesita revisión)
- **notas**: Cualquier nota adicional

## Valores Predefinidos por Grupo

### Grupo 1 (27 personas)
- **referentes**: `Flor y Juan`
- **destino**: `Humahuaca`
- **líderes**: Juan Szkarlatiuk, Florencia Monsalvo

### Grupo 2 (14 personas)
- **referentes**: `Adrian y Flavia`
- **destino**: `Jujuy Capital`
- **líderes**: Adrian Muelas, Flavia Ramos

### Grupo 3 (17 personas)
- **referentes**: `Eliseo y Ana`
- **destino**: `Jujuy Capital`
- **líderes**: Eliseo Lisniczuk, Analia Lisniczuk

### Grupo 4 (26 personas)
- **referentes**: `Robert`
- **destino**: `Abra Pampa`
- **líderes**: Roberto Janik

### Grupo 5 (28 personas)
- **referentes**: `Fede y Karen`
- **destino**: `La Quiaca`
- **líderes**: Federico Ruiz, Karen Galeano

### Grupo 6 (18 personas)
- **referentes**: `Maxi-Anto / Maru-Joniko`
- **destino**: `Jujuy Capital`
- **líderes**: Maximiliano Zeravika, Antonela Righi, Jonatan Flores, Marianela Liboa

## Formato de WhatsApp

El formato debe ser: `+549` + código de área + número (sin espacios ni guiones)

Ejemplos:
- Buenos Aires: `+5491123456789`
- Jujuy: `+5493884123456`

## Fechas del Viaje

- **Viernes 26**: Día 1 del programa
- **Sábado 27**: Día 2 del programa
- **Domingo 28**: Día 3 del programa

## Tips para Llenar la Planilla

1. **Copiar desde CSV**: Si ya tienes un CSV con los nombres, puedes copiarlo directamente
2. **Usar fórmulas**: Puedes usar fórmulas para llenar automáticamente `referentes` y `destino` basado en el `grupo`
3. **Validación de datos**: Usa validación de datos en Google Sheets para:
   - `grupo` (1-6)
   - `destino` (lista desplegable: Humahuaca, Abra Pampa, La Quiaca, Jujuy Capital)
   - `medio_transporte` (lista desplegable: Avión, Micro, Auto)
   - `escala_salta` (lista desplegable: Sí, No)
4. **Formato condicional**: Puedes usar formato condicional para:
   - Resaltar líderes
   - Resaltar personas con estado "BAJA"
   - Resaltar personas que hacen escala en Salta (para seguimiento especial)
5. **Notas sobre transporte**:
   - Si `medio_transporte` = "Avión" y `escala_salta` = "Sí", completar `micro_salta_jujuy`
   - Si `medio_transporte` = "Micro" o "Auto", dejar `vuelo_ida` y `vuelo_vuelta` vacíos

## Ejemplo de Fórmula para Referentes

Si quieres autocompletar `referentes` basado en el grupo, puedes usar:

```
=IFS(
  B2=1, "Flor y Juan",
  B2=2, "Adrian y Flavia",
  B2=3, "Eliseo y Ana",
  B2=4, "Robert",
  B2=5, "Fede y Karen",
  B2=6, "Maxi-Anto / Maru-Joniko",
  TRUE, ""
)
```

(Asumiendo que `nombre` está en A2 y `grupo` en B2)

## Ejemplo de Fórmula para Destino

```
=IFS(
  B2=1, "Humahuaca",
  B2=4, "Abra Pampa",
  B2=5, "La Quiaca",
  OR(B2=2, B2=3, B2=6), "Jujuy Capital",
  TRUE, ""
)
```

---

*Ejemplo creado: Diciembre 2024*

