# Configuración del Webhook de Google Apps Script

Este documento explica cómo configurar el webhook para registrar las entradas y salidas de usuarios en un Google Sheet.

## Paso 1: Crear el Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea un nuevo documento y nómbralo "Registro Oremos"
3. Crea o renombra una pestaña como **"Actividad"** (debe llamarse exactamente así)
4. En la primera fila de la pestaña "Actividad" (encabezados), escribe:
   - A1: `Timestamp`
   - B1: `Evento`
   - C1: `Nombre`
   - D1: `Edad`
   - E1: `Iglesia`
   - F1: `Socket ID`

**Nota:** El script automáticamente creará la pestaña "Actividad" con los encabezados si no existe, pero es mejor crearla manualmente para tener control.

## Paso 2: Configurar el Apps Script

1. En tu Google Sheet, ve al menú: **Extensiones** → **Apps Script**
2. Verás un editor de código con una función `myFunction()` por defecto
3. **Borra todo el código** que viene por defecto
4. Copia y pega el código que está en el archivo `google-apps-script.js` de este repositorio
5. Haz clic en el icono de **Guardar** (💾)
6. Dale un nombre al proyecto (ej: "Webhook Oremos")

## Paso 2.5: ⚠️ IMPORTANTE - Autorizar ANTES de Implementar

**ANTES de implementar como aplicación web, debes autorizar el script:**

1. En el menú desplegable de funciones (arriba), selecciona **test**
2. Haz clic en el botón **Ejecutar** (▶️)
3. Aparecerá un mensaje "Autorización necesaria"
4. Haz clic en **Revisar permisos**
5. Selecciona tu cuenta de Google
6. Si aparece "Google no ha verificado esta aplicación":
   - Haz clic en **Avanzado** (abajo a la izquierda)
   - Haz clic en **Ir a [nombre del proyecto] (no seguro)**
7. Haz clic en **Permitir**
8. Espera que termine la ejecución
9. Ve a tu Google Sheet y verifica que se haya agregado una fila de prueba
10. **Elimina la fila de prueba** del sheet

✅ Ahora sí estás listo para implementar

## Paso 3: Implementar como Aplicación Web

1. En el editor de Apps Script, haz clic en el botón **Implementar** (arriba a la derecha)
2. Selecciona **Nueva implementación**
3. Haz clic en el icono de ⚙️ junto a "Selecciona el tipo"
4. Selecciona **Aplicación web**
5. Configura lo siguiente:
   - **Descripción**: "Webhook Oremos" (o el nombre que prefieras)
   - **Ejecutar como**: "Yo" (tu cuenta de Google)
   - **Quién tiene acceso**: "Cualquier persona"
6. Haz clic en **Implementar**
7. Es posible que te pida autorizar el script:
   - Haz clic en **Autorizar acceso**
   - Selecciona tu cuenta de Google
   - Si aparece una advertencia de seguridad, haz clic en "Avanzado" → "Ir a [nombre del proyecto]"
   - Haz clic en **Permitir**
8. Copia la **URL de la aplicación web** que te muestra (algo como: `https://script.google.com/macros/s/AKfycby.../exec`)

## Paso 4: Configurar la Variable de Entorno

### Para desarrollo local:

Crea un archivo `.env` en la raíz del proyecto (si no existe) y agrega:

```bash
WEBHOOK_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
```

Reemplaza `TU_SCRIPT_ID` con la URL que copiaste en el paso anterior.

### Para producción (Fly.io u otro):

Configura la variable de entorno en tu plataforma de deployment:

**Fly.io:**
```bash
fly secrets set WEBHOOK_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
```

**Vercel:**
Ve a tu proyecto → Settings → Environment Variables → Agrega:
- Name: `WEBHOOK_URL`
- Value: Tu URL del script

**Otras plataformas:**
Consulta la documentación de tu plataforma para agregar variables de entorno.

## Paso 5: Verificar que Funciona

1. Reinicia tu servidor backend
2. Abre la aplicación y completa el formulario de entrada
3. Ve a tu Google Sheet → pestaña **"Actividad"** - deberías ver una nueva fila con los datos del usuario
4. Cierra la aplicación o recarga la página
5. Deberías ver otra entrada con el evento "leave" en la pestaña "Actividad"

## Estructura de los Datos

Cada entrada en el Google Sheet tendrá:

- **Timestamp**: Fecha y hora del evento
- **Evento**: "join" (entrada) o "leave" (salida)
- **Nombre**: Nombre del usuario (o "Anónimo" si no se proporcionó)
- **Edad**: Edad del usuario (o "N/A" si no se proporcionó)
- **Iglesia**: Iglesia del usuario (o "N/A" si no se proporcionó)
- **Socket ID**: Identificador único de la conexión

## Solución de Problemas

### El webhook no registra datos

1. Verifica que la URL del webhook esté correctamente configurada en las variables de entorno
2. Revisa los logs del backend para ver si hay errores
3. Prueba acceder a la URL del webhook en un navegador - deberías ver un JSON con `status: "active"`

### Error de autorización

1. Ve al Apps Script → Ejecutar → Función: `doPost`
2. Autoriza nuevamente el script
3. Vuelve a implementar la aplicación web

### Los datos no se guardan correctamente

1. Verifica que exista una pestaña llamada exactamente **"Actividad"** en tu Google Sheet
2. Verifica que los encabezados estén en la primera fila de la pestaña "Actividad"
3. Asegúrate de que el script tenga permisos de escritura en el sheet
4. Revisa la consola de Apps Script para ver errores (Ver → Registros)
5. Si la pestaña no existe, el script la creará automáticamente con los encabezados

## Notas Importantes

- ✅ El webhook es completamente **gratuito** con Google Apps Script
- ✅ Puede manejar **múltiples usuarios simultáneos** sin problemas
- ✅ Si el webhook falla, la aplicación **continúa funcionando** normalmente (solo no se registran los datos)
- ✅ Los datos se guardan automáticamente en tu Google Sheet con timestamp
- 📊 Puedes crear gráficos y análisis directamente en Google Sheets con estos datos

## Análisis de Datos Sugeridos

Con estos datos puedes crear:

1. **Total de usuarios únicos** por día/semana/mes
2. **Horas pico** de oración (cuándo hay más gente conectada)
3. **Duración promedio** de las sesiones (tiempo entre join y leave)
4. **Iglesias más activas** en el movimiento
5. **Tendencias de crecimiento** del movimiento

¡Disfruta del registro automático de tu comunidad de oración! 🙏🔥

