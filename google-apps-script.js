/**
 * INSTRUCCIONES PARA CONFIGURAR EL WEBHOOK DE GOOGLE APPS SCRIPT:
 * 
 * 1. Crea un nuevo Google Sheet con el nombre "Registro Oremos"
 * 2. En la primera fila (encabezados), escribe: Timestamp | Evento | Nombre | Edad | Iglesia | Tipo Asistencia | Comentario | Socket ID
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
    // Obtener la pestaña específica "Actividad"
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName('Actividad');
    
    // Si no existe la pestaña "Actividad", crearla
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Actividad');
      // Agregar encabezados si es una pestaña nueva
      sheet.appendRow(['Timestamp', 'Evento', 'Nombre', 'Edad', 'Iglesia', 'Tipo Asistencia', 'Comentario', 'Socket ID']);
    }
    
    // Parsear los datos del request
    var data = JSON.parse(e.postData.contents);
    
    // Crear timestamp en formato legible
    var timestamp = new Date();
    
    // Agregar nueva fila con los datos
    sheet.appendRow([
      timestamp,
      data.event || 'unknown',
      data.name || 'Anónimo',
      data.age || 'N/A',
      data.church || 'N/A',
      data.attendance || 'online',
      data.comment || '',
      data.socketId || 'N/A'
    ]);
    
    // Retornar respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Datos registrados exitosamente en pestaña Actividad',
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

// Función de prueba para autorizar manualmente antes de implementar
function test() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('Actividad');
  
  // Si no existe la pestaña "Actividad", crearla
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Actividad');
    // Agregar encabezados
    sheet.appendRow(['Timestamp', 'Evento', 'Nombre', 'Edad', 'Iglesia', 'Tipo Asistencia', 'Comentario', 'Socket ID']);
  }
  
  sheet.appendRow([
    new Date(), 
    "test", 
    "Test User", 
    "25", 
    "Test Church", 
    "online",
    "Comentario de prueba",
    "test-id"
  ]);
  Logger.log("Test completado exitosamente en pestaña Actividad");
}
