function defaultCpuState_() {
  return {
    PC: 0x00, IR: 0x00, MAR: 0x00, MDR: 0x00,
    AX: 0x00, BX: 0x00,
    ZF: 0, CF: 0, SF: 0,
    fase: 'FETCH'
  };
}

function getCpuState_() {
  var raw = PropertiesService.getScriptProperties().getProperty('CPU_STATE');
  return raw ? JSON.parse(raw) : defaultCpuState_();
}

function saveCpuState_(state) {
  PropertiesService.getScriptProperties().setProperty('CPU_STATE', JSON.stringify(state));
}

function resetCPU() {
  saveCpuState_(defaultCpuState_());
}

// Ejecuta una fase del ciclo de reloj
function step() {
  var state = getCpuState_();
  switch (state.fase) {
    case 'FETCH':
      state = fetchStep(state);
      state.fase = 'DECODE';
      break;
    case 'DECODE':
      state = decodeStep(state);
      state.fase = 'EXECUTE';
      break;
    case 'EXECUTE':
      state = executeStep(state);
      state.fase = 'STORE';
      break;
    case 'STORE':
      state = storeStep(state);
      state.fase = 'FETCH';
      break;
  }
  saveCpuState_(state);
}

// 1. Fase Fetch
function fetchStep(state) {
  state.MAR = state.PC;
  state.MDR = read(state.MAR);
  state.IR = state.MDR;
  state.PC = (state.PC + 1) & 0xFF;
  return state;
}

// 2. Fase Decode (siguiente issue: decodificador ISA)
function decodeStep(state) {
  return state;
}

// 3. Fase Execute (siguiente issue)
function executeStep(state) {
  return state;
}

// 4. Fase Store (siguiente issue)
function storeStep(state) {
  return state;
}s