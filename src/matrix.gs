// matrix.gs
const MATRIX_SHEET_NAME = 'CPU';       // antes decía 'Memoria'
const MATRIX_START_ROW = 2;             // arranca en la fila 1
const MATRIX_START_COL = 10;             // arranca en la columna D, para no chocar con A-B (registros)

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
function getMatrixFormat_() {
  return PropertiesService.getScriptProperties().getProperty('MATRIX_FORMAT') || 'HEX';
}

function formatearValor_(value, formato, address) {
  if (formato === 'INS') {
    // En el segmento de código, las direcciones pares son opcodes
    if (address <= 0x7F && address % 2 === 0 && ISA[value]) return ISA[value];
    return String(value);
  }
  if (formato === 'DEC') return String(value);
  if (formato === 'BIN') return value.toString(2).padStart(8, '0');
  return '0x' + value.toString(16).toUpperCase().padStart(2, '0');
}

function renderMemoryMatrix() {
  var sheet = getMatrixSheet_();
  var memory = getMemory_();
  var formato = getMatrixFormat_();

  // Encabezados de columna: 0..F
  var encCol = [];
  for (var c = 0; c < 16; c++) encCol.push(c.toString(16).toUpperCase());
  sheet.getRange(MATRIX_START_ROW, MATRIX_START_COL + 1, 1, 16)
       .setValues([encCol]).setFontWeight('bold').setHorizontalAlignment('center');

  // Encabezados de fila: 0x00, 0x10, ... 0xF0
  var encFila = [];
  for (var r = 0; r < 16; r++) {
    encFila.push(['0x' + (r * 16).toString(16).toUpperCase().padStart(2, '0')]);
  }
  sheet.getRange(MATRIX_START_ROW + 1, MATRIX_START_COL, 16, 1)
       .setValues(encFila).setFontWeight('bold');

  // Las 256 celdas, escritas de una sola vez
  var valores = [];
  var colores = [];
  for (var f = 0; f < 16; f++) {
    var filaV = [];
    var filaC = [];
    for (var k = 0; k < 16; k++) {
      var address = f * 16 + k;
      filaV.push(formatearValor_(memory[address], formato, address));
      filaC.push(address <= 0x7F ? '#CFE8FF' : '#D9F2D9');  // azul=código, verde=datos
    }
    valores.push(filaV);
    colores.push(filaC);
  }
  var rango = sheet.getRange(MATRIX_START_ROW + 1, MATRIX_START_COL + 1, 16, 16);
  rango.setNumberFormat('@');          // texto plano, para que "00000001" no se vuelva el número 1
  rango.setValues(valores).setBackgrounds(colores).setHorizontalAlignment('center');
}

// Cambia de vista y ajusta el ancho (el binario ocupa 8 caracteres)
function cambiarVista_(formato) {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('MATRIX_FORMAT', formato);
  if (formato !== 'INS') props.setProperty('LAST_NUM_FORMAT', formato); // recuerda la última vista numérica
  var sheet = getMatrixSheet_();
  var ancho = (formato === 'BIN') ? 80 : (formato === 'INS') ? 100 : 55;
  for (var k = 1; k <= 16; k++) sheet.setColumnWidth(MATRIX_START_COL + k, ancho);
  renderMemoryMatrix();
}

// Botón INSTRU: alterna entre instrucciones y la última vista numérica
function vistaInstru() {
  if (getMatrixFormat_() === 'INS') {
    var anterior = PropertiesService.getScriptProperties().getProperty('LAST_NUM_FORMAT') || 'HEX';
    cambiarVista_(anterior);
  } else {
    cambiarVista_('INS');
  }
}

function vistaHex() { cambiarVista_('HEX'); }
function vistaDec() { cambiarVista_('DEC'); }
function vistaBin() { cambiarVista_('BIN'); }

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
  var mnemonic = (address <= 0x7F)
  ? (address % 2 === 0 ? (ISA[value] || '(vacío)') : '(operando)')
  : '(segmento de datos)';

  // Ahora en columnas D-E, filas 21-25 (debajo de la matriz, lejos de los botones en A-C)
  sheet.getRange(21, 4).setValue('Dirección:');
  sheet.getRange(21, 5).setValue('0x' + address.toString(16).toUpperCase().padStart(2, '0'));
  sheet.getRange(22, 4).setValue('Hexadecimal:');
  sheet.getRange(22, 5).setValue(hex);
  sheet.getRange(23, 4).setValue('Binario:');
  sheet.getRange(23, 5).setValue(bin);
  sheet.getRange(24, 4).setValue('Decimal:');
  sheet.getRange(24, 5).setValue(value.toString());
  sheet.getRange(25, 4).setValue('Mnemónico:');
  sheet.getRange(25, 5).setValue(mnemonic);
}

function resaltarCeldaMemoria_(address, color) {
  var sheet = getMatrixSheet_();
  var row = Math.floor(address / 16);
  var col = address % 16;
  sheet.getRange(MATRIX_START_ROW + 1 + row, MATRIX_START_COL + 1 + col).setBackground(color);
}
