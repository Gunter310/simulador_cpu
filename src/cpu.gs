// src/cpu.gs

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