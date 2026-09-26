function updateUI() {
  var state = getCpuState_();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("B2").setValue("0x" + state.PC.toString(16).toUpperCase());
  sheet.getRange("B3").setValue("0x" + state.IR.toString(16).toUpperCase());
  sheet.getRange("B4").setValue("0x" + state.AX.toString(16).toUpperCase());
  sheet.getRange("B5").setValue("0x" + state.BX.toString(16).toUpperCase());
  sheet.getRange("B6").setValue(state.ZF);
  sheet.getRange("B7").setValue(state.CF);
  sheet.getRange("B8").setValue(state.SF);
  sheet.getRange("B9").setValue(state.fase);
}