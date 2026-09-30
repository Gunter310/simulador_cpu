// log.gs
const LOG_SHEET_NAME = 'CPU';
const LOG_COL = 10;         // columna G (misma que la matriz)
const LOG_START_ROW = 21;  // debajo del título del log, en fila 19

function getLogSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG_SHEET_NAME);
}

function limpiarLog() {
  var sheet = getLogSheet_();
  var maxRows = sheet.getMaxRows();
  sheet.getRange(LOG_START_ROW, LOG_COL, maxRows - LOG_START_ROW + 1, 1).clearContent();
  PropertiesService.getScriptProperties().setProperty('LOG_NEXT_ROW', String(LOG_START_ROW));
}

function agregarLog(mensaje) {
  var sheet = getLogSheet_();
  var props = PropertiesService.getScriptProperties();
  var nextRow = parseInt(props.getProperty('LOG_NEXT_ROW'), 10);
  if (isNaN(nextRow)) nextRow = LOG_START_ROW;

  sheet.getRange(nextRow, LOG_COL).setValue(mensaje);
  props.setProperty('LOG_NEXT_ROW', String(nextRow + 1));
}