// Estado global de los registros del CPU (8 bits cada uno)
var cpuState = {
  PC: 0x00,  // Program Counter
  IR: 0x00,  // Instruction Register
  MAR: 0x00, // Memory Address Register
  MDR: 0x00, // Memory Buffer Register
  AX: 0x00,  // Acumulador
  BX: 0x00,  // Registro de propósito general
  ZF: 0,     // Zero Flag
  CF: 0,     // Carry Flag
  SF: 0,     // Sign Flag
  fase: 'FETCH' // Estado actual del ciclo
};

// Función para reiniciar el CPU
function resetCPU() {
  cpuState.PC = 0x00;
  cpuState.IR = 0x00;
  cpuState.MAR = 0x00;
  cpuState.MDR = 0x00;
  cpuState.AX = 0x00;
  cpuState.BX = 0x00;
  cpuState.ZF = 0;
  cpuState.CF = 0;
  cpuState.SF = 0;
  cpuState.fase = 'FETCH';
}

// Ejecuta una fase del ciclo de reloj
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
      cpuState.fase = 'FETCH';
      break;
  }
}

// 1. Fase Fetch (Búsqueda)
function fetchStep() {
  cpuState.MAR = cpuState.PC;
  cpuState.MDR = read(cpuState.MAR);
  cpuState.IR = cpuState.MDR;
  cpuState.PC = (cpuState.PC + 1) & 0xFF;
}

// 2. Fase Decode (Decodificación)
function decodeStep() {
  // Aquí la Unidad de Control extrae el Opcode del registro IR
  // Por ahora dejamos preparado el espacio para interpretar la instrucción
}

// 3. Fase Execute (Ejecución)
function executeStep() {
  // La ALU o la unidad de control procesan la instrucción decodificada
}

// 4. Fase Store (Almacenamiento)
function storeStep() {
  // Se guardan los resultados definitivos en registros o memoria
}