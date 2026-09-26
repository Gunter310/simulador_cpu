// log.gs
const LOG_SHEET_NAME = 'Log';

function getLogSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LOG_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(LOG_SHEET_NAME);
  return sheet;
}

function agregarLog(mensaje) {
  var sheet = getLogSheet_();
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1).setValue(mensaje);
}

function limpiarLog() {
  getLogSheet_().clearContents();
}

function toHex_(n) {
  return '0x' + n.toString(16).toUpperCase().padStart(2, '0');
}