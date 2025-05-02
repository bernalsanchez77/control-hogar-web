import React, { Component } from 'react';

class Main extends Component {
  constructor() {
    super();
    const states = {
      LamparaComedor: {status: 'Off', label: 'Lampara Comedor', id: 'LamparaComedor'},
      LamparaSala: {status: 'Off', label: 'Lampara Sala', id: 'LamparaSala'},
      LamparaTurca: {status: 'Off', label: 'Lampara Turca', id: 'LamparaTurca'},
      LamparaLava: {status: 'Off', label: 'Lampara Lava', id: 'LamparaLava'},
      LamparaRotatoria: {status: 'Off', label: 'Lampara Rotatoria', id: 'LamparaRotatoria'},
      Chimenea: {status: 'Off', label: 'Chimenea', id: 'Chimenea'},
      LamparasAbajo: {status: 'Off', label: 'Lamparas Abajo', id: 'LamparasAbajo'},
      ParlantesSala: {status: 'Off', label: 'Parlantes Sala', id: 'ParlantesSala'},
      CalentadorNegro: {status: 'Off', label: 'Calentador Lizzie', id: 'CalentadorNegro'},
      CalentadorBlanco: {status: 'Off', label: 'Calentador Amy', id: 'CalentadorBlanco'},
      ProyectorMute: {status: 'Off', label: 'Proyector Mute', id: 'ProyectorMute'},
      SalaMute: {status: 'Off', label: 'Sala Mute', id: 'SalaMute'},
      CuartoMute: {status: 'Off', label: 'Cuarto Mute', id: 'CuartoMute'},
      Hdmi: {status: 'roku', label: 'Hdmi', id: 'Hdmi'},
    };
    this.state = {states: states,deviceStates: states};
    this.init();
  }
  async init() {
    this.getStates();
    setInterval(() => {this.getStates();}, 5000);
  }
  async getStates() {
    fetch('/api/getDeviceStatus').then(res => res.json()).then(
      deviceStates => {this.setState({deviceStates: this.getUpdatedDeviceStates(deviceStates)})}
    ).catch(err => {});
  }
  getUpdatedDeviceStates(deviceStates) {
    const updatedDeviceStates = {};
    for (let device in this.state.deviceStates) {
      updatedDeviceStates[device] = {...this.state.deviceStates[device], status: deviceStates[device]};
    }
    return updatedDeviceStates;
  }
  getUpdatedDevice(device, status) {
    return {...this.state.deviceStates[device], status: status};
  }
  async changeDevice(device, status) {
    // fetch('/api/sendIfttt?device=' + device + '&status=' + status);
    this.setState(prev => ({deviceStates: {...prev.deviceStates, [device]: this.getUpdatedDevice(device, status)  }}), () => {
      const deviceStates = this.state.deviceStates;
      fetch('/api/setDeviceStatus', {method: 'PUT',headers: {'Content-Type': 'application/json',},body: JSON.stringify(deviceStates)}).then(res => res.json()).then(data => {}).catch(err => {});
    });
  }
  async triggerDevice(device) {
    if (this.state.deviceStates[device].status === 'On') {
      this.changeDevice(device, 'Off');
    } else {
      this.changeDevice(device, 'On');
    }
  }
  render() {
    return (
      <div>
        <div>
        <button onClick={() => this.triggerDevice(this.state.deviceStates.LamparaComedor.id)}>{this.state.deviceStates.LamparaComedor.label} {this.state.deviceStates.LamparaComedor.status}</button>
        </div>
        <div>
        <button onClick={() => this.triggerDevice(this.state.deviceStates.LamparaTurca.id)}>{this.state.deviceStates.LamparaTurca.label} {this.state.deviceStates.LamparaTurca.status}</button>
        </div>
      </div>
    );
  }
}

export default Main;
