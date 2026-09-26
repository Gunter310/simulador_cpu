// main.gs
function cargarPrograma() {
  resetMemory();
  var programa = [
    0x01, 0x00,   // 00: MOV AX, 0
    0x02, 0x05,   // 02: MOV BX, 5
    0x10, 0x03,   // 04: ADD AX, 3      <- inicio del bucle
    0x17, 0x00,   // 06: DEC BX
    0x22, 0x04,   // 08: JNZ 0x04
    0x07, 0x80,   // 0A: STORE [0x80], AX
    0xFF, 0x00    // 0C: HLT
  ];
  for (var i = 0; i < programa.length; i++) {
    write(i, programa[i]);
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A13").setValue("Programa 3x5 cargado (14 bytes)");
  renderMemoryMatrix();	
}
function verificarHalted() {
  var state = getCpuState_();
  Logger.log("Halted: " + state.halted);
  Logger.log("AX final: " + state.AX);
  Logger.log("Memoria[128]: " + read(128));
}