function updateUI() {
  var state = getCpuState_();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("B2").setValue(state.PC);   // antes: "0x" + state.PC.toString(16)...
  sheet.getRange("B3").setValue(state.IR);
  sheet.getRange("B4").setValue(state.AX);
  sheet.getRange("B5").setValue(state.BX);
  sheet.getRange("B6").setValue(state.ZF);
  sheet.getRange("B7").setValue(state.CF);
  sheet.getRange("B8").setValue(state.SF);
  sheet.getRange("B9").setValue(state.fase);
  sheet.getRange("B10").setValue(state.MAR);
  sheet.getRange("B11").setValue(state.MDR);
}

function ejecutarPaso() {
  step();
  var state = getCpuState_();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  updateUI();
  resaltarFase_(sheet, state.lastFaseEjecutada, state);
  renderMemoryMatrix();

  // Resalta también la celda de memoria que se tocó en esta fase
  if (state.lastFaseEjecutada === 'FETCH' || state.lastFaseEjecutada === 'DECODE') {
    resaltarCeldaMemoria_(state.MAR, '#FFCC80'); // naranja: lectura
  } else if (state.lastFaseEjecutada === 'STORE' && state.lastWriteTarget && state.lastWriteTarget.address !== undefined) {
    resaltarCeldaMemoria_(state.lastWriteTarget.address, '#A5D6A7'); // verde: escritura
  }
}

function reiniciarSimulador() {
  setRunning_(false); // ← nuevo: detiene cualquier RUN en curso
  resetCPU();
  limpiarLog();
  agregarLog('--- Sistema reiniciado ---');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  limpiarResaltado_(sheet);
  updateUI();
  renderMemoryMatrix();
}

const REG_CELLS = { PC:'B2', IR:'B3', AX:'B4', BX:'B5', ZF:'B6', CF:'B7', SF:'B8', MAR:'B10', MDR:'B11' };

function limpiarResaltado_(sheet) {
  for (var key in REG_CELLS) {
    sheet.getRange(REG_CELLS[key]).setBackground(null);
  }
}

function resaltarFase_(sheet, fase, state) {
  limpiarResaltado_(sheet);
  var AMARILLO = '#FFF59D';
  var CELESTE  = '#90CAF9';
  var VERDE    = '#A5D6A7';

  if (fase === 'FETCH') {
    [REG_CELLS.PC, REG_CELLS.MAR, REG_CELLS.MDR, REG_CELLS.IR].forEach(function(c) {
      sheet.getRange(c).setBackground(AMARILLO);
    });
  } else if (fase === 'DECODE') {
    [REG_CELLS.MAR, REG_CELLS.MDR].forEach(function(c) {
      sheet.getRange(c).setBackground(AMARILLO);
    });
  } else if (fase === 'EXECUTE') {
    [REG_CELLS.AX, REG_CELLS.BX, REG_CELLS.ZF, REG_CELLS.CF, REG_CELLS.SF].forEach(function(c) {
      sheet.getRange(c).setBackground(CELESTE);
    });
  } else if (fase === 'STORE' && state.lastWriteTarget && state.lastWriteTarget.reg) {
    sheet.getRange(REG_CELLS[state.lastWriteTarget.reg]).setBackground(VERDE);
  }
}