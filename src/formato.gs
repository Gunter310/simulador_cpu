// formato.gs
function formatearInterfaz() {
  formatearCPU_();
}

function formatearCPU_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CPU');

  var maxCols = sheet.getMaxColumns();
  if (maxCols < 30) {
    sheet.insertColumnsAfter(maxCols, 30 - maxCols);
  }

  var etiquetasTexto = ['PC','IR','AX','BX','ZF','CF','SF','Fase','MAR','MDR'];
  for (var i = 0; i < etiquetasTexto.length; i++) {
    sheet.getRange(2 + i, 1).setValue(etiquetasTexto[i]);
  }
  sheet.getRange(12, 1).setValue('Delay (ms)');

  sheet.setColumnWidth(1, 110);
  sheet.setColumnWidth(2, 90);

  sheet.getRange("A1:F1").breakApart();

  sheet.getRange("A1:B1").merge()
       .setValue("SIMULADOR CPU")
       .setFontSize(12).setFontWeight('bold')
       .setBackground('#1A237E').setFontColor('white')
       .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 30);

  sheet.getRange("A2:B11")
       .setBorder(true, true, true, true, true, true, '#9E9E9E', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange("A2:A11").setFontWeight('bold').setBackground('#F5F5F5');
  sheet.getRange("B2:B11").setHorizontalAlignment('center').setFontFamily('Roboto Mono');

  sheet.getRange("A12:B12")
       .setBorder(true, true, true, true, true, true, '#9E9E9E', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange("A12").setFontWeight('bold').setBackground('#F5F5F5');
  sheet.getRange("B12").setHorizontalAlignment('center');

  // Limpia cualquier resto de título/color en la posición VIEJA (columna G=7), por si quedó basura ahí
  sheet.getRange(1, 7, 20, 3).clearContent().setBackground(null);

  // Título de la matriz — AHORA en columna J (10)
  sheet.getRange(1, 10).setValue("MATRIZ DE MEMORIA RAM (00h–FFh)")
       .setFontSize(12).setFontWeight('bold').setFontColor('white');
  sheet.getRange(1, 10, 1, 17).setBackground('#1A237E');

  // Limpia cualquier resto del log viejo en la columna Z
  sheet.getRange(1, 26, sheet.getMaxRows(), 1).clearContent().setBackground(null);

  // Título del log — AHORA también en columna J (10), debajo de la matriz
  sheet.getRange(19, 10).setValue("LOG DE MICRO-OPERACIONES")
       .setFontSize(12).setFontWeight('bold').setFontColor('white');
  sheet.getRange(19, 10, 1, 17).setBackground('#1A237E');

  sheet.setHiddenGridlines(true);
}

function formatearMemoria_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Memoria');
  if (!sheet) return; // NUEVO: si ya no existe esa pestaña (la fusionaste con CPU), no hace nada

  sheet.getRange("A1:R1").breakApart();

  sheet.getRange("A1")
       .setValue("MATRIZ DE MEMORIA RAM (256 bytes — 00h a FFh)")
       .setFontSize(13).setFontWeight('bold')
       .setBackground('#1A237E').setFontColor('white');
  sheet.getRange("A1:R1").setBackground('#1A237E');
  sheet.setRowHeight(1, 30);

  sheet.getRange("T3").setValue("Segmento de Código").setBackground('#CFE8FF');
  sheet.getRange("T4").setValue("Segmento de Datos").setBackground('#D9F2D9');
  sheet.getRange("T5").setValue("Celda en lectura").setBackground('#FFCC80');
  sheet.getRange("T6").setValue("Celda en escritura").setBackground('#A5D6A7');

  sheet.setFrozenRows(2);
  sheet.setFrozenColumns(1);

  for (var c = 2; c <= 17; c++) sheet.setColumnWidth(c, 45);

  sheet.setHiddenGridlines(true);
}

function formatearLog_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Log');
  if (!sheet) return; // NUEVO: mismo caso, evita error si ya no existe

  sheet.insertRowBefore(1);
  sheet.getRange("A1").setValue("LOG DE MICRO-OPERACIONES")
       .setFontWeight('bold').setFontSize(13)
       .setBackground('#1A237E').setFontColor('white');
  sheet.setRowHeight(1, 30);
  sheet.setFrozenRows(1);

  sheet.setColumnWidth(1, 500);
  sheet.getRange("A2:A2000").setFontFamily('Roboto Mono').setFontSize(10);

  sheet.setHiddenGridlines(true);
}