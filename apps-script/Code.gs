// Script para Google Apps Script — deployar como Web App
// Ejecutar como: "Yo" | Acceso: "Cualquiera"

var SHEET_NAME = 'Horas';

var MONTH_NAMES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

function doGet(e) {
  var action = e.parameter.action;
  if (action === 'list') return handleList();
  if (action === 'add') return handleAdd(e.parameter);
  return jsonResponse({ status: 'error', message: 'Acción no reconocida' });
}

function handleAdd(params) {
  var sheet = getSheet();
  var nextRow = sheet.getLastRow() + 1;

  // Fuerza texto en columnas fecha y mes para que Sheets no las convierta a Date
  var range = sheet.getRange(nextRow, 1, 1, 5);
  range.setNumberFormats([['@', '0.##', '@', '@', '@']]);
  range.setValues([[
    params.fecha,
    parseFloat(params.horas),
    params.descripcion,
    params.mes,
    params.timestamp,
  ]]);

  return jsonResponse({ status: 'ok' });
}

function handleList() {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();

  var entries = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    entries.push({
      id: String(i),
      fecha: formatFecha(row[0]),
      horas: row[1],
      descripcion: row[2],
      mes: formatMes(row[3]),
      timestamp: row[4],
    });
  }

  return jsonResponse({ status: 'ok', entries: entries });
}

// Convierte Date o string a "DD/MM/YYYY"
function formatFecha(val) {
  if (val instanceof Date) {
    var d = String(val.getDate()).padStart(2, '0');
    var m = String(val.getMonth() + 1).padStart(2, '0');
    var y = val.getFullYear();
    return d + '/' + m + '/' + y;
  }
  return String(val);
}

// Convierte Date o string a "Mes YYYY"
function formatMes(val) {
  if (val instanceof Date) {
    return MONTH_NAMES[val.getMonth()] + ' ' + val.getFullYear();
  }
  return String(val);
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().trim() === SHEET_NAME) {
      return sheets[i];
    }
  }
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
