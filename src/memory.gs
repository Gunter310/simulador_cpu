// La memoria se guarda como JSON en PropertiesService para persistir entre ejecuciones
const RAM_SIZE = 256;

function getMemory_() {
  var raw = PropertiesService.getScriptProperties().getProperty('RAM');
  return raw ? JSON.parse(raw) : new Array(RAM_SIZE).fill(0);
}

function saveMemory_(memory) {
  PropertiesService.getScriptProperties().setProperty('RAM', JSON.stringify(memory));
}

/**
 * Lee el valor almacenado en una dirección de memoria específica.
 */
function read(address) {
  if (address < 0 || address > 255) {
    throw new Error("Dirección de memoria fuera de rango: " + address);
  }
  return getMemory_()[address];
}

/**
 * Escribe un valor en una dirección de memoria específica.
 */
function write(address, value) {
  if (address < 0 || address > 255) {
    throw new Error("Dirección de memoria fuera de rango: " + address);
  }
  var memory = getMemory_();
  memory[address] = value & 0xFF;
  saveMemory_(memory);
}

/** Reinicia toda la RAM a ceros (útil para LOAD PROGRAM y pruebas) */
function resetMemory() {
  saveMemory_(new Array(RAM_SIZE).fill(0));
}