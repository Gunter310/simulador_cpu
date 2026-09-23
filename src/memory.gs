// Lee un byte desde la dirección de memoria especificada (00h a FFh / 0 a 255)
function read(addr) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Calcula la fila y columna correspondiente en una matriz de 16x16
  var row = Math.floor(addr / 16) + 5; // Supone que la tabla inicia en la fila 5
  var col = (addr % 16) + 2;          // Supone que la tabla inicia en la columna B (2)
  return sheet.getRange(row, col).getValue();
}

// Escribe un valor en la celda de memoria correspondiente
function write(addr, val) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var row = Math.floor(addr / 16) + 5;
  var col = (addr % 16) + 2;
  sheet.getRange(row, col).setValue(val);
}