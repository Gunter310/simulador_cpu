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

function ejecutarPaso() {
  step();       // calcula
  updateUI();   // ← ESTA línea pinta las celdas
}

function reiniciarSimulador() {
  resetCPU();
  updateUI();   // ← ESTA línea pinta las celdas
}

function step() {
  var state = getCpuState_();
  if (state.halted) return; // HLT detiene el reloj, como pide el PDF

  switch (state.fase) {
    case 'FETCH':   state = fetchStep(state);   state.fase = 'DECODE';  break;
    case 'DECODE':  state = decodeStep(state);  state.fase = 'EXECUTE'; break;
    case 'EXECUTE': state = executeStep(state); state.fase = 'STORE';   break;
    case 'STORE':   state = storeStep(state);   state.fase = 'FETCH';   break;
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

// 2. Fase Decode: identifica el opcode y trae el operando (2do byte)
function decodeStep(state) {
  state.MAR = state.PC;
  state.MDR = read(state.MAR);
  var operand = state.MDR;
  state.PC = (state.PC + 1) & 0xFF;

  state.decoded = {
    mnemonic: decodeOpcode_(state.IR),
    operand: operand
  };
  return state;
}

// 3. Fase Execute: la ALU calcula y arma el "paquete" a escribir en Store
function executeStep(state) {
  var d = state.decoded || { mnemonic: 'NOP', operand: 0 };
  var r;

  switch (d.mnemonic) {
    case 'MOV_AX_IMM': state.writeBack = { reg: 'AX', value: d.operand }; break;
    case 'MOV_BX_IMM': state.writeBack = { reg: 'BX', value: d.operand }; break;
    case 'MOV_AX_BX':  state.writeBack = { reg: 'AX', value: state.BX }; break;
    case 'MOV_BX_AX':  state.writeBack = { reg: 'BX', value: state.AX }; break;

    case 'LOAD_AX': state.writeBack = { reg: 'AX', value: read(d.operand) }; break;
    case 'LOAD_BX': state.writeBack = { reg: 'BX', value: read(d.operand) }; break;

    case 'STORE_AX': state.writeBack = { address: d.operand, value: state.AX }; break;
    case 'STORE_BX': state.writeBack = { address: d.operand, value: state.BX }; break;

    case 'ADD_AX_IMM': r = aluOperate('ADD', state.AX, d.operand); aplicarFlags_(state, r); state.writeBack = { reg: 'AX', value: r.result }; break;
    case 'ADD_AX_BX':  r = aluOperate('ADD', state.AX, state.BX);  aplicarFlags_(state, r); state.writeBack = { reg: 'AX', value: r.result }; break;
    case 'SUB_AX_IMM': r = aluOperate('SUB', state.AX, d.operand); aplicarFlags_(state, r); state.writeBack = { reg: 'AX', value: r.result }; break;
    case 'SUB_AX_BX':  r = aluOperate('SUB', state.AX, state.BX);  aplicarFlags_(state, r); state.writeBack = { reg: 'AX', value: r.result }; break;

    case 'INC_AX': r = aluOperate('INC', state.AX, 0); aplicarFlags_(state, r); state.writeBack = { reg: 'AX', value: r.result }; break;
    case 'INC_BX': r = aluOperate('INC', state.BX, 0); aplicarFlags_(state, r); state.writeBack = { reg: 'BX', value: r.result }; break;
    case 'DEC_AX': r = aluOperate('DEC', state.AX, 0); aplicarFlags_(state, r); state.writeBack = { reg: 'AX', value: r.result }; break;
    case 'DEC_BX': r = aluOperate('DEC', state.BX, 0); aplicarFlags_(state, r); state.writeBack = { reg: 'BX', value: r.result }; break;

    case 'CMP_AX_IMM': r = aluOperate('CMP', state.AX, d.operand); aplicarFlags_(state, r); break; // no hay writeBack: CMP no guarda resultado
    case 'CMP_AX_BX':  r = aluOperate('CMP', state.AX, state.BX);  aplicarFlags_(state, r); break;

    case 'JMP': state.PC = d.operand; break;
    case 'JZ':  if (state.ZF === 1) state.PC = d.operand; break;
    case 'JNZ': if (state.ZF === 0) state.PC = d.operand; break;

    case 'HLT': state.halted = true; break;
    case 'NOP': default: break;
  }
  return state;
}

function aplicarFlags_(state, r) {
  state.ZF = r.ZF; state.CF = r.CF; state.SF = r.SF;
}

// 4. Fase Store: aquí SÍ se escribe de verdad, en registro o en RAM
function storeStep(state) {
  if (state.writeBack) {
    if (state.writeBack.reg) {
      state[state.writeBack.reg] = state.writeBack.value; // AX o BX
    } else if (state.writeBack.address !== undefined) {
      state.MAR = state.writeBack.address;
      state.MDR = state.writeBack.value;
      write(state.MAR, state.MDR); // MDR → RAM[MAR], tal como dice el PDF
    }
    state.writeBack = null;
  }
  return state;
}