import React, { Component } from 'react';

class Main extends Component {
  constructor() {
    super();
    const devices = {
      LamparaComedor: {state: 'off', label: 'Lampara Comedor', id: 'lamparaComedor'},
      LamparaSala: {state: 'off', label: 'Lampara Sala', id: 'lamparaSala'},
      LamparaTurca: {state: 'off', label: 'Lampara Turca', id: 'lamparaTurca'},
      LamparaLava: {state: 'off', label: 'Lampara Lava', id: 'lamparaLava'},
      LamparaRotatoria: {state: 'off', label: 'Lampara Rotatoria', id: 'lamparaRotatoria'},
      Chimenea: {state: 'off', label: 'Chimenea', id: 'chimenea'},
      LamparasAbajo: {state: 'off', label: 'Lamparas Abajo', id: 'lamparasAbajo'},
      ParlantesSala: {state: 'off', label: 'Parlantes Sala', id: 'parlantesSala'},
      CalentadorNegro: {state: 'off', label: 'Calentador Lizzie', id: 'calentadorNegro'},
      CalentadorBlanco: {state: 'off', label: 'Calentador Amy', id: 'calentadorBlanco'},
      ProyectorMute: {state: 'off', label: 'Proyector Mute', id: 'proyectorMute'},
      SalaMute: {state: 'off', label: 'Sala Mute', id: 'salaMute'},
      CuartoMute: {state: 'off', label: 'Cuarto Mute', id: 'cuartoMute'},
      Hdmi: {state: 'roku', label: 'Roku', id: 'hdmi'}
    };
    this.state = {devices: devices};
    // this.init();
  }
  async init() {
    this.getStates();
    setInterval(() => {this.getStates();}, 5000);
  }
  async getStates() {
    fetch('/api/getDevices').then(res => res.json()).then(
      devices => {this.setState({devices: this.getUpdatedDevices(devices)})}
    ).catch(err => {});
  }
  getUpdatedDevices(devices) {
    const updatedDevices = {};
    for (let device in this.state.devices) {
      updatedDevices[device] = {...this.state.devices[device], state: devices[device].state};
    }
    return updatedDevices;
  }
  getUpdatedDevice(device, state) {
    return {...this.state.devices[device], state: state};
  }
  async changeDevice(device, state) {
    // fetch('/api/sendIfttt?device=' + device + '&state=' + state);
    this.setState(prev => ({devices: {...prev.devices, [device]: {...this.state.devices[device], state: state}}}), () => {
      const devices = this.state.devices;
      fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devices)}).then(res => res.json()).then(data => {}).catch(err => {});
    });
  }
  async triggerDevice(device) {
    if (this.state.devices[device].state === 'On') {
      this.changeDevice(device, 'Off');
    } else {
      this.changeDevice(device, 'On');
    }
  }
  resetDevices() {
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(this.state.devices)});
  }
  render() {
    return (
      <div>
        <div>
        <button onClick={() => this.triggerDevice(this.state.devices.LamparaComedor.id)}>{this.state.devices.LamparaComedor.label} {this.state.devices.LamparaComedor.id}</button>
        </div>
        <div>
        <button onClick={() => this.triggerDevice(this.state.devices.LamparaTurca.id)}>{this.state.devices.LamparaTurca.label} {this.state.devices.LamparaTurca.id}</button>
        </div>
        <div>
        <button onClick={() => this.resetDevices()}>Reset</button>
        </div>
      </div>
    );
  }
}

export default Main;
