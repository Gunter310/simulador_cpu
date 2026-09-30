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
  var maxIteraciones = 2000;
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

    // --- NUEVO: mismo resaltado de memoria que usa ejecutarPaso() ---
    if (nuevoEstado.lastFaseEjecutada === 'FETCH' || nuevoEstado.lastFaseEjecutada === 'DECODE') {
      resaltarCeldaMemoria_(nuevoEstado.MAR, '#FFCC80'); // naranja: lectura
    } else if (nuevoEstado.lastFaseEjecutada === 'STORE' && nuevoEstado.lastWriteTarget && nuevoEstado.lastWriteTarget.address !== undefined) {
      resaltarCeldaMemoria_(nuevoEstado.lastWriteTarget.address, '#A5D6A7'); // verde: escritura
    }

    SpreadsheetApp.flush();
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