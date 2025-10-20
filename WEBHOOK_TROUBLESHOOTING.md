# Solución de Problemas: Error 404 al Autorizar Google Apps Script

## Problema
Al intentar implementar el Apps Script como aplicación web, aparece un error 404 durante el proceso de autorización OAuth.

## Soluciones

### Solución 1: Autorizar Primero en el Editor ⭐ (Recomendada)

1. En el editor de Apps Script, **antes de implementar**:
   - Selecciona `doPost` en el menú desplegable de funciones (arriba)
   - Haz clic en **Ejecutar** (▶️)
   - Aparecerá "Autorización necesaria"
   - Haz clic en **Revisar permisos**
   - Selecciona tu cuenta de Google
   - Si aparece "Esta app no está verificada":
     - Haz clic en **Avanzado**
     - Haz clic en **Ir a [nombre del proyecto] (no seguro)**
   - Haz clic en **Permitir**
   - Espera que termine la ejecución (puede dar error, no importa)

2. **Ahora sí**, haz la implementación:
   - Implementar → Nueva implementación
   - Tipo: Aplicación web
   - Ejecutar como: Yo
   - Quién tiene acceso: Cualquier persona
   - Implementar

### Solución 2: Asociar con Proyecto de Google Cloud

1. En el editor de Apps Script, ve a: **Configuración del proyecto** (⚙️ en la barra lateral)
2. Busca "Proyecto de Google Cloud Platform (GCP)"
3. Haz clic en **Cambiar proyecto**
4. Si no tienes un proyecto GCP:
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un nuevo proyecto
   - Copia el **número del proyecto**
5. Pega el número del proyecto en Apps Script
6. Guarda y vuelve a intentar la implementación

### Solución 3: Usar Ventana de Incógnito

A veces los permisos en caché causan problemas:

1. Cierra todas las ventanas del navegador
2. Abre una ventana de incógnito
3. Ve a tu Google Sheet
4. Abre Apps Script
5. Intenta el proceso de autorización nuevamente

### Solución 4: Script Simplificado (Sin Autorización Compleja)

Si ninguna solución funciona, usa esta versión más simple del script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),
      data.event,
      data.name,
      data.age,
      data.church,
      data.socketId
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: 'active'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función de prueba para autorizar manualmente
function test() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([new Date(), "test", "Test User", "25", "Test Church", "test-id"]);
}
```

**Pasos con el script simplificado:**
1. Reemplaza el código actual con este
2. Guarda el proyecto
3. Ejecuta la función `test` primero
4. Autoriza cuando te lo pida
5. Luego implementa como aplicación web

### Solución 5: Verificar Permisos del Sheet

Asegúrate de que tu cuenta tenga permisos de edición en el Google Sheet:

1. Abre tu Google Sheet
2. Verifica que seas el propietario o tengas permisos de edición
3. Si el script está en una cuenta diferente, comparte el sheet con esa cuenta

### Solución 6: Limpiar Autorizaciones Previas

1. Ve a [Google Account Permissions](https://myaccount.google.com/permissions)
2. Busca tu proyecto de Apps Script
3. Revoca el acceso
4. Vuelve a autorizar desde cero

## Verificación del Webhook

Una vez implementado correctamente, verifica que funciona:

### Prueba GET (en navegador)
Abre la URL del webhook en tu navegador:
```
https://script.google.com/macros/s/TU_SCRIPT_ID/exec
```

Deberías ver:
```json
{"status":"active","message":"Webhook de Oremos está funcionando correctamente","timestamp":"..."}
```

### Prueba POST (con curl)
```bash
curl -X POST \
  https://script.google.com/macros/s/TU_SCRIPT_ID/exec \
  -H "Content-Type: application/json" \
  -d '{
    "event": "test",
    "name": "Test User",
    "age": "25",
    "church": "Test Church",
    "socketId": "test-123"
  }'
```

Deberías ver en tu Google Sheet una nueva fila con los datos de prueba.

## Errores Comunes

### "Authorization needed" después de implementar
- **Causa**: No autorizaste antes de implementar
- **Solución**: Usa Solución 1

### "Redirect URI mismatch" o Error 404
- **Causa**: Proyecto GCP no configurado correctamente
- **Solución**: Usa Solución 2

### "Script function not found: doPost"
- **Causa**: El código no se guardó o tiene errores de sintaxis
- **Solución**: Guarda el script y verifica errores en el editor

### El webhook responde pero no guarda datos
- **Causa**: Problemas con permisos del sheet o nombres de columnas
- **Solución**: Verifica que los encabezados estén en la fila 1

## ¿Todavía no funciona?

Si después de intentar todas estas soluciones sigues con problemas, considera estas alternativas:

1. **Google Form con Webhook**: Más simple pero menos flexible
2. **Supabase**: Requiere setup inicial pero es más robusto
3. **Firebase Realtime Database**: Gratis y fácil de configurar
4. **Log a archivo local en el backend**: Simple pero no centralizado

¿Necesitas ayuda con alguna alternativa?

