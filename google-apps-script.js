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
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    
    // Detectar tipo de operación
    if (data.action) {
      // Operaciones de Admin (CRUD)
      return handleAdminAction(spreadsheet, data);
    } else {
      // Operaciones de Analytics (join, leave, comment)
      return handleAnalytics(spreadsheet, data);
    }
      
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

// Función para manejar analytics (join, leave, comment)
function handleAnalytics(spreadsheet, data) {
  var sheet = spreadsheet.getSheetByName('Actividad');
  
  // Si no existe la pestaña "Actividad", crearla
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Actividad');
    sheet.appendRow(['Timestamp', 'Evento', 'Nombre', 'Edad', 'Iglesia', 'Tipo Asistencia', 'Comentario', 'Socket ID']);
  }
  
  var timestamp = new Date();
  
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
  
  return ContentService
    .createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Datos registrados exitosamente en pestaña Actividad',
      timestamp: timestamp
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función para manejar operaciones de admin (CRUD)
function handleAdminAction(spreadsheet, data) {
  var sheetName = data.sheet; // 'Feed' o 'Biblioteca'
  var action = data.action; // 'create', 'update', 'delete'
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  // Si no existe la pestaña, crearla con encabezados
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    if (sheetName === 'Feed') {
      sheet.appendRow(['titulo', 'descripcion', 'media', 'destacado', 'fecha']);
    } else if (sheetName === 'Biblioteca') {
      sheet.appendRow(['titulo', 'bajada', 'url', 'nombre', 'tipo', 'peso']);
    }
  }
  
  if (action === 'create') {
    return createRow(sheet, sheetName, data.item);
  } else if (action === 'update') {
    return updateRow(sheet, sheetName, data.index, data.item);
  } else if (action === 'delete') {
    return deleteRow(sheet, data.index);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ 
      success: false, 
      error: 'Acción no reconocida' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Crear nueva fila
function createRow(sheet, sheetName, item) {
  try {
    if (sheetName === 'Feed') {
      sheet.appendRow([
        item.titulo || '',
        item.descripcion || '',
        item.media || '',
        item.destacado ? 'true' : 'false',
        item.fecha || new Date().toISOString()
      ]);
    } else if (sheetName === 'Biblioteca') {
      sheet.appendRow([
        item.titulo || '',
        item.bajada || '',
        item.url || '',
        item.nombre || '',
        item.tipo || '',
        item.peso || ''
      ]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Item creado exitosamente' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Actualizar fila existente
function updateRow(sheet, sheetName, index, item) {
  try {
    // index viene del frontend (0-based), pero Sheet es 1-based
    // +2 porque: +1 para convertir de 0-based a 1-based, +1 para saltar la fila de encabezados
    var rowNumber = index + 2;
    
    if (sheetName === 'Feed') {
      sheet.getRange(rowNumber, 1).setValue(item.titulo || '');
      sheet.getRange(rowNumber, 2).setValue(item.descripcion || '');
      sheet.getRange(rowNumber, 3).setValue(item.media || '');
      sheet.getRange(rowNumber, 4).setValue(item.destacado ? 'true' : 'false');
      sheet.getRange(rowNumber, 5).setValue(item.fecha || new Date().toISOString());
    } else if (sheetName === 'Biblioteca') {
      sheet.getRange(rowNumber, 1).setValue(item.titulo || '');
      sheet.getRange(rowNumber, 2).setValue(item.bajada || '');
      sheet.getRange(rowNumber, 3).setValue(item.url || '');
      sheet.getRange(rowNumber, 4).setValue(item.nombre || '');
      sheet.getRange(rowNumber, 5).setValue(item.tipo || '');
      sheet.getRange(rowNumber, 6).setValue(item.peso || '');
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Item actualizado exitosamente' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Eliminar fila
function deleteRow(sheet, index) {
  try {
    // index viene del frontend (0-based), pero Sheet es 1-based
    // +2 porque: +1 para convertir de 0-based a 1-based, +1 para saltar la fila de encabezados
    var rowNumber = index + 2;
    sheet.deleteRow(rowNumber);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Item eliminado exitosamente' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
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
