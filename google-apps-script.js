/**
 * INSTRUCCIONES PARA CONFIGURAR EL WEBHOOK DE GOOGLE APPS SCRIPT:
 * 
 * 1. Crea un nuevo Google Sheet con el nombre "Registro Oremos"
 * 2. En la primera fila (encabezados), escribe: Timestamp | Evento | Nombre | Edad | Iglesia | Socket ID
 * 3. En el Google Sheet, ve a Extensiones > Apps Script
 * 4. Borra el código por defecto y pega este código
 * 5. Haz clic en "Implementar" > "Nueva implementación"
 * 6. Tipo: "Aplicación web"
 * 7. Ejecutar como: "Yo"
 * 8. Quién tiene acceso: "Cualquier persona"
 * 9. Copia la URL que te da (será algo como: https://script.google.com/macros/s/XXXXX/exec)
 * 10. Usa esa URL como WEBHOOK_URL en tu backend
 */

function doPost(e) {
  try {
    // Obtener el sheet activo
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parsear los datos del request
    const data = JSON.parse(e.postData.contents);
    
    // Crear timestamp en formato legible
    const timestamp = new Date();
    
    // Agregar nueva fila con los datos
    sheet.appendRow([
      timestamp,
      data.event || 'unknown',
      data.name || 'Anónimo',
      data.age || 'N/A',
      data.church || 'N/A',
      data.socketId || 'N/A'
    ]);
    
    // Retornar respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Datos registrados exitosamente',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Manejar errores
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Endpoint GET para verificar que el webhook está funcionando
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'active',
      message: 'Webhook de Oremos está funcionando correctamente',
      timestamp: new Date()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

