// Script para Google Apps Script — deployar como Web App
// Ejecutar como: "Yo" | Acceso: "Cualquiera"

var SHEET_NAME = 'Horas';

function doGet(e) {
  var action = e.parameter.action;

  if (action === 'list') {
    return handleList();
  }

  if (action === 'add') {
    return handleAdd(e.parameter);
  }

  return jsonResponse({ status: 'error', message: 'Acción no reconocida' });
}

function handleAdd(params) {
  var sheet = getSheet();

  // Agrega fila al final
  sheet.appendRow([
    params.fecha,
    parseFloat(params.horas),
    params.descripcion,
    params.mes,
    params.timestamp,
  ]);

  return jsonResponse({ status: 'ok' });
}

function handleList() {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();

  // Fila 1 son los headers — la salteamos
  var entries = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue; // fila vacía
    entries.push({
      id: String(i),
      fecha: row[0],
      horas: row[1],
      descripcion: row[2],
      mes: row[3],
      timestamp: row[4],
    });
  }

  return jsonResponse({ status: 'ok', entries: entries });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Busca insensible a espacios en blanco por si el nombre tiene trailing space
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().trim() === SHEET_NAME) {
      return sheets[i];
    }
  }

  // No existe — la crea con headers
  var sheet = ss.insertSheet(SHEET_NAME);
  sheet.appendRow(['Fecha', 'Horas', 'Descripción', 'Mes', 'Timestamp']);
  sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  return sheet;
}

function jsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
