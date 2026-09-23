/**
 * Actualiza los valores de los registros, banderas y fase actual 
 * en las celdas de la hoja de cálculo para cumplir con la visualización de la rúbrica.
 */
function updateUI() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Mapeo de registros y banderas en celdas específicas de la hoja
  sheet.getRange("B2").setValue("0x" + cpuState.PC.toString(16).toUpperCase());
  sheet.getRange("B3").setValue("0x" + cpuState.IR.toString(16).toUpperCase());
  sheet.getRange("B4").setValue("0x" + cpuState.AX.toString(16).toUpperCase());
  sheet.getRange("B5").setValue("0x" + cpuState.BX.toString(16).toUpperCase());
  sheet.getRange("B6").setValue(cpuState.ZF);
  sheet.getRange("B7").setValue(cpuState.CF);
  sheet.getRange("B8").setValue(cpuState.SF);
  sheet.getRange("B9").setValue(cpuState.fase);
}

/**
 * Función vinculada al botón "Ejecutar Paso" en Google Sheets.
 * Avanza una fase del ciclo y refresca la interfaz visual.
 */
function ejecutarPaso() {
  step();
  updateUI();
}

/**
 * Función vinculada al botón "Reiniciar" en Google Sheets.
 * Resetea el procesador y la interfaz.
 */
function reiniciarSimulador() {
  resetCPU();
  updateUI();
}