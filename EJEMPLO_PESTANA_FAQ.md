# 📋 Configuración de la Pestaña FAQ

## Estructura de la Pestaña

La pestaña **FAQ** debe contener las siguientes columnas:

| pregunta | respuesta | categoria |
|----------|-----------|-----------|

### Columnas Requeridas

1. **pregunta** (string): La pregunta frecuente
2. **respuesta** (string): La respuesta completa. Puede incluir comas para separar párrafos
3. **categoria** (string): Categoría a la que pertenece la pregunta

## Categorías Disponibles

Las categorías se agrupan automáticamente y se muestran con iconos:

- **Logística General** 🚌
- **Alimentación** 🍽️
- **Costos** 💰
- **Salud y Seguridad** ⚕️

Si usas una categoría diferente, se mostrará con el icono ❓

## Ejemplo de Datos

```csv
pregunta,respuesta,categoria
¿Dónde nos encontramos para salir y a qué hora?,El programa requerido para participar del viaje misionero es estar en la Iglesia el día viernes 26/12 a las 05:00 hs hasta el domingo 28/12 a las 13:00 hs,Logística General
¿Cuál es el costo total del viaje?,"Cada uno es responsable de sacar su propio pasaje para ir a Jujuy. Puede organizar su agenda y costos sea en avión, micro o auto. El costo de $47.000 solo incluye hospedaje y comida (pero NO almuerzo).",Costos
```

## Configuración en Google Sheets

1. **Crea una nueva pestaña** llamada "FAQ" en tu Google Sheet
2. **Copia el contenido** del archivo `EJEMPLO_PESTANA_FAQ.csv`
3. **Publica la pestaña**:
   - Archivo → Compartir → Publicar en la web
   - Selecciona la pestaña "FAQ"
   - Tipo: Valores separados por comas (.csv)
   - Copia la URL generada

4. **Agrega la URL** a tu archivo `.env.local`:
   ```bash
   NEXT_PUBLIC_FAQ_SHEETS_URL=https://docs.google.com/spreadsheets/d/e/TU_ID/pub?gid=TU_GID&single=true&output=csv
   ```

## Formato de Respuestas

### Respuestas Simples
Para respuestas de un solo párrafo:
```
¿Necesito llevar mi DNI?,Es de carácter OBLIGATORIO que cada uno lleve su DNI.,Logística General
```

### Respuestas con Múltiples Párrafos
Para separar párrafos, usa comas en la respuesta:
```
¿Qué ropa debo llevar?,"Ropa cómoda y fresca, Campera liviana, Zapatillas deportivas",Alimentación
```

## Actualización en Tiempo Real

Los cambios que hagas en Google Sheets se reflejarán automáticamente en la app:
- Las FAQs se recargan cada vez que un usuario ingresa a `/faq`
- Los datos se cachean offline para acceso sin internet
- Los usuarios verán los cambios al refrescar la página

## Troubleshooting

### Las FAQs no se muestran
1. Verifica que `NEXT_PUBLIC_FAQ_SHEETS_URL` esté configurada
2. Asegúrate de que la URL sea pública y termine en `output=csv`
3. Verifica que las columnas tengan exactamente estos nombres: `pregunta`, `respuesta`, `categoria`

### Las categorías no tienen íconos
- Verifica que el nombre de la categoría coincida exactamente con: "Logística General", "Alimentación", "Costos", o "Salud y Seguridad"
- Si usas otra categoría, aparecerá con el ícono por defecto ❓

### Las respuestas se ven mal formateadas
- Si la respuesta tiene comas, asegúrate de encerrarla entre comillas dobles: `"respuesta, con, comas"`
- Google Sheets hace esto automáticamente al exportar a CSV

