// matrix.gs
const MATRIX_SHEET_NAME = 'Memoria';
const MATRIX_START_ROW = 2;   // fila donde empiezan los encabezados de columna
const MATRIX_START_COL = 2;   // columna B, donde empiezan los encabezados de fila

function getMatrixSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(MATRIX_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(MATRIX_SHEET_NAME);
  return sheet;
}

/**
 * Dibuja/actualiza la matriz 16x16 completa: valores en hex + colores
 * de segmento (código vs datos). Llamar después de cada STEP/RESET/LOAD.
 */
function renderMemoryMatrix() {
  var sheet = getMatrixSheet_();
  var memory = getMemory_();

  // Encabezados de columna: 0,1,2...F (nibble bajo de la dirección)
  for (var col = 0; col < 16; col++) {
    sheet.getRange(MATRIX_START_ROW, MATRIX_START_COL + 1 + col)
         .setValue(col.toString(16).toUpperCase())
         .setFontWeight('bold')
         .setHorizontalAlignment('center');
  }

  // Encabezados de fila: 00,10,20...F0 (nibble alto de la dirección)
  for (var row = 0; row < 16; row++) {
    sheet.getRange(MATRIX_START_ROW + 1 + row, MATRIX_START_COL)
         .setValue('0x' + (row * 16).toString(16).toUpperCase().padStart(2, '0'))
         .setFontWeight('bold');
  }

  // Las 256 celdas de datos
  for (var r = 0; r < 16; r++) {
    for (var c = 0; c < 16; c++) {
      var address = r * 16 + c;
      var value = memory[address];
      var cell = sheet.getRange(MATRIX_START_ROW + 1 + r, MATRIX_START_COL + 1 + c);
      cell.setValue('0x' + value.toString(16).toUpperCase().padStart(2, '0'));
      cell.setHorizontalAlignment('center');
      cell.setBackground(address <= 0x7F ? '#CFE8FF' : '#D9F2D9'); // azul=código, verde=datos
    }
  }
}

/**
 * Simple trigger de Apps Script: se dispara SOLO por hacer clic en una celda,
 * sin que tengas que llamar ninguna función a mano.
 */
function onSelectionChange(e) {
  var sheet = e.range.getSheet();
  if (sheet.getName() !== MATRIX_SHEET_NAME) return;

  var r = e.range.getRow() - (MATRIX_START_ROW + 1);
  var c = e.range.getColumn() - (MATRIX_START_COL + 1);
  if (r < 0 || r > 15 || c < 0 || c > 15) return; // clic fuera de la cuadrícula

  mostrarDetalleCelda_(sheet, r * 16 + c);
}

function mostrarDetalleCelda_(sheet, address) {
  var value = getMemory_()[address];
  var hex = '0x' + value.toString(16).toUpperCase().padStart(2, '0');
  var bin = value.toString(2).padStart(8, '0');
  var mnemonic = (address <= 0x7F) ? (ISA[value] || '(operando / vacío)') : '(segmento de datos)';

  sheet.getRange(20, 2).setValue('Dirección:');
  sheet.getRange(20, 3).setValue('0x' + address.toString(16).toUpperCase().padStart(2, '0'));
  sheet.getRange(21, 2).setValue('Hexadecimal:');
  sheet.getRange(21, 3).setValue(hex);
  sheet.getRange(22, 2).setValue('Binario:');
  sheet.getRange(22, 3).setValue(bin);
  sheet.getRange(23, 2).setValue('Decimal:');
  sheet.getRange(23, 3).setValue(value.toString());
  sheet.getRange(24, 2).setValue('Mnemónico:');
  sheet.getRange(24, 3).setValue(mnemonic);
}