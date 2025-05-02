import React, { Component } from 'react';

class Main extends Component {
  constructor() {
    super();
    const devices = {
      LamparaComedor: {state: 'Off', label: 'Lampara Comedor', id: 'LamparaComedor'},
      LamparaSala: {state: 'Off', label: 'Lampara Sala', id: 'LamparaSala'},
      LamparaTurca: {state: 'Off', label: 'Lampara Turca', id: 'LamparaTurca'},
      LamparaLava: {state: 'Off', label: 'Lampara Lava', id: 'LamparaLava'},
      LamparaRotatoria: {state: 'Off', label: 'Lampara Rotatoria', id: 'LamparaRotatoria'},
      Chimenea: {state: 'Off', label: 'Chimenea', id: 'Chimenea'},
      LamparasAbajo: {state: 'Off', label: 'Lamparas Abajo', id: 'LamparasAbajo'},
      ParlantesSala: {state: 'Off', label: 'Parlantes Sala', id: 'ParlantesSala'},
      CalentadorNegro: {state: 'Off', label: 'Calentador Lizzie', id: 'CalentadorNegro'},
      CalentadorBlanco: {state: 'Off', label: 'Calentador Amy', id: 'CalentadorBlanco'},
      ProyectorMute: {state: 'Off', label: 'Proyector Mute', id: 'ProyectorMute'},
      SalaMute: {state: 'Off', label: 'Sala Mute', id: 'SalaMute'},
      CuartoMute: {state: 'Off', label: 'Cuarto Mute', id: 'CuartoMute'},
      Hdmi: {state: 'roku', label: 'Hdmi', id: 'Hdmi'}
    };
    this.state = {devices: devices};
    this.init();
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
    this.setState(prev => ({devices: {...prev.devices, [device]: this.getUpdatedDevice(device, state)}}), () => {
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
