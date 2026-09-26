// isa.gs
// Tabla de opcodes. Cada instrucción ocupa 2 bytes: [opcode][operando]
const ISA = {
  0x01: 'MOV_AX_IMM',  0x02: 'MOV_BX_IMM',
  0x03: 'MOV_AX_BX',   0x04: 'MOV_BX_AX',
  0x05: 'LOAD_AX',     0x06: 'LOAD_BX',
  0x07: 'STORE_AX',    0x08: 'STORE_BX',
  0x10: 'ADD_AX_IMM',  0x11: 'ADD_AX_BX',
  0x12: 'SUB_AX_IMM',  0x13: 'SUB_AX_BX',
  0x14: 'INC_AX',      0x15: 'INC_BX',
  0x16: 'DEC_AX',      0x17: 'DEC_BX',
  0x18: 'CMP_AX_IMM',  0x19: 'CMP_AX_BX',
  0x20: 'JMP',         0x21: 'JZ',        0x22: 'JNZ',
  0xFF: 'HLT'
};

function decodeOpcode_(opcode) {
  return ISA[opcode] || 'NOP'; // opcode desconocido -> no hace nada
}