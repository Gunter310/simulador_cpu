function updateUI() {
  var state = getCpuState_();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("B2").setValue(state.PC);   // antes: "0x" + state.PC.toString(16)...
  sheet.getRange("B3").setValue(state.IR);
  sheet.getRange("B4").setValue(state.AX);
  sheet.getRange("B5").setValue(state.BX);
  sheet.getRange("B6").setValue(state.ZF);
  sheet.getRange("B7").setValue(state.CF);
  sheet.getRange("B8").setValue(state.SF);
  sheet.getRange("B9").setValue(state.fase);
  sheet.getRange("B10").setValue(state.MAR);
  sheet.getRange("B11").setValue(state.MDR);
}

function ejecutarPaso() {
  step();
  updateUI();
  renderMemoryMatrix();
}

function reiniciarSimulador() {
  resetCPU();
  updateUI();
  renderMemoryMatrix(); 
}