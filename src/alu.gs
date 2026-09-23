// Ejecuta una operación aritmética o lógica y actualiza las banderas (ZF, CF, SF)
function aluOperate(op, a, b) {
  let result = 0;
  let cf = 0;
  let zf = 0;
  let sf = 0;

  switch (op) {
    // --- Operaciones Aritméticas ---
    case 'ADD':
      let sum = a + b;
      result = sum & 0xFF; // Trunca a 8 bits
      cf = sum > 255 ? 1 : 0; // Carry si supera los 8 bits
      break;
      
    case 'SUB':
    case 'CMP':
      let sub = a - b;
      result = sub & 0xFF;
      cf = a < b ? 1 : 0; // Carry como préstamo en resta
      break;
      
    case 'INC':
      let inc = a + 1;
      result = inc & 0xFF;
      cf = inc > 255 ? 1 : 0;
      break;
      
    case 'DEC':
      let dec = a - 1;
      result = dec & 0xFF;
      cf = a < 0 ? 1 : 0;
      break;

    // --- Operaciones Lógicas ---
    case 'AND':
      result = (a & b) & 0xFF;
      cf = 0; // Las operaciones lógicas no generan carry aritmético
      break;
      
    case 'OR':
      result = (a | b) & 0xFF;
      cf = 0;
      break;
      
    case 'XOR':
      result = (a ^ b) & 0xFF;
      cf = 0;
      break;
      
    case 'NOT':
      result = (~a) & 0xFF; // Invierte los bits del acumulador
      cf = 0;
      break;

    default:
      result = a;
  }

  // Actualizar banderines de estado (comunes para aritmética y lógica)
  zf = (result === 0) ? 1 : 0;
  sf = (result & 0x80) ? 1 : 0; // Bit 7 como signo

  return { result: result, ZF: zf, CF: cf, SF: sf };
}