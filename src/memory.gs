// Inicializamos la memoria RAM con 256 celdas (256 bytes), todas en 0x00
var memory = new Array(256).fill(0x00);

/**
 * Lee el valor almacenado en una dirección de memoria específica.
 * @param {number} address - Dirección de 0 a 255 (00h a FFh)
 * @return {number} Valor de 8 bits contenido en esa dirección
 */
function read(address) {
  if (address < 0 || address > 255) {
    throw new Error("Dirección de memoria fuera de rango: " + address);
  }
  return memory[address];
}

/**
 * Escribe un valor en una dirección de memoria específica.
 * @param {number} address - Dirección de 0 a 255 (00h a FFh)
 * @param {number} value - Valor de 8 bits a almacenar
 */
function write(address, value) {
  if (address < 0 || address > 255) {
    throw new Error("Dirección de memoria fuera de rango: " + address);
  }
  // Nos aseguramos de que el valor esté truncado a 8 bits (0 a 255)
  memory[address] = value & 0xFF;
}