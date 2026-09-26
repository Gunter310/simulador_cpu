// control.gs
function isRunning_() {
  return PropertiesService.getScriptProperties().getProperty('RUNNING') === 'true';
}

function setRunning_(value) {
  PropertiesService.getScriptProperties().setProperty('RUNNING', value ? 'true' : 'false');
}

function getDelay_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var val = sheet.getRange("B12").getValue();
  var delay = parseInt(val, 10);
  return (isNaN(delay) || delay < 50) ? 500 : delay; // mínimo 50ms de seguridad
}

/**
 * Modo Continuo (RUN): ejecuta pasos automáticamente hasta HLT,
 * hasta que se presione PAUSE, o hasta un límite de seguridad de iteraciones.
 */
function ejecutarContinuo() {
  setRunning_(true);
  var delay = getDelay_();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var maxIteraciones = 2000; // límite de seguridad, evita bucles infinitos accidentales
  var i = 0;

  while (isRunning_() && i < maxIteraciones) {
    var state = getCpuState_();
    if (state.halted) {
      agregarLog('--- RUN detenido: CPU en HLT ---');
      break;
    }

    step();
    var nuevoEstado = getCpuState_();
    updateUI();
    resaltarFase_(sheet, nuevoEstado.lastFaseEjecutada, nuevoEstado);
    renderMemoryMatrix();

    SpreadsheetApp.flush(); // fuerza que los cambios se vean YA, no al final de la función
    Utilities.sleep(delay);
    i++;
  }
  setRunning_(false);
}

/**
 * PAUSE: solo cambia la bandera. La función ejecutarContinuo(),
 * que está corriendo en otra ejecución, la revisa en cada vuelta del while.
 */
function pausarSimulador() {
  setRunning_(false);
  agregarLog('--- PAUSA solicitada por el usuario ---');
}