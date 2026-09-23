// src/cpu.gs (Continuación)

// Ejecuta una micro-operación o fase según el ciclo de reloj
function step() {
  switch (cpuState.fase) {
    case 'FETCH':
      fetchStep();
      cpuState.fase = 'DECODE';
      break;
    case 'DECODE':
      decodeStep();
      cpuState.fase = 'EXECUTE';
      break;
    case 'EXECUTE':
      executeStep();
      cpuState.fase = 'STORE';
      break;
    case 'STORE':
      storeStep();
      cpuState.fase = 'FETCH'; // Vuelve a empezar el ciclo
      break;
  }
}

// 1. Fase Fetch (Búsqueda)
function fetchStep() {
  cpuState.MAR = cpuState.PC;           // MAR ← PC[cite: 4]
  cpuState.MDR = read(cpuState.MAR);    // MDR ← RAM[MAR][cite: 4]
  cpuState.IR = cpuState.MDR;           // IR ← MDR[cite: 4]
  cpuState.PC = (cpuState.PC + 1) & 0xFF; // PC ← PC + 1 (con límite de 8 bits)[cite: 4]
}

// 2. Fase Decode (Decodificación)
function decodeStep() {
  // La Unidad de Control interpreta el Opcode en IR
  // Aquí prepararemos los operandos en las siguientes fases
}

// 3. Fase Execute (Ejecución)
function executeStep() {
  // La ALU procesa la instrucción actual
}

// 4. Fase Store (Almacenamiento / Write-back)
function storeStep() {
  // Se guarda el resultado final en registros o memoria
}