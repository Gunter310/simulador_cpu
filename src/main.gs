// main.gs
function cargarPrograma() {
  resetMemory();
  var programa = [
    1, 0,       // dirección 0:  MOV AX, 0
    6, 129,     // dirección 2:  LOAD BX, [129]
    16, 3,      // dirección 4:  ADD AX, 3    <- inicio del bucle
    23, 0,      // dirección 6:  DEC BX
    34, 4,      // dirección 8:  JNZ 4
    7, 128,     // dirección 10: STORE [128], AX
    255, 0      // dirección 12: HLT
  ];
  for (var i = 0; i < programa.length; i++) {
    write(i, programa[i]);
  }
  write(129, 5);   // dato de entrada: cuántas veces sumar, en el segmento de datos
  renderMemoryMatrix();
}


function verificarHalted() {
  var state = getCpuState_();
  Logger.log("Halted: " + state.halted);
  Logger.log("AX final: " + state.AX);
  Logger.log("Memoria[128]: " + read(128));
}
function evidenciaALU() {
  Logger.log("ADD 200+100 = " + JSON.stringify(aluOperate('ADD', 200, 100)));
  Logger.log("SUB 5-10 = "   + JSON.stringify(aluOperate('SUB', 5, 10)));
  Logger.log("INC 255 = "    + JSON.stringify(aluOperate('INC', 255, 0)));
  Logger.log("DEC 0 = "      + JSON.stringify(aluOperate('DEC', 0, 0)));
  Logger.log("AND 12,10 = "  + JSON.stringify(aluOperate('AND', 12, 10)));
  Logger.log("OR 12,10 = "   + JSON.stringify(aluOperate('OR', 12, 10)));
  Logger.log("XOR 12,10 = "  + JSON.stringify(aluOperate('XOR', 12, 10)));
  Logger.log("NOT 0 = "      + JSON.stringify(aluOperate('NOT', 0, 0)));
  Logger.log("CMP 5,5 = "    + JSON.stringify(aluOperate('CMP', 5, 5)));
}
