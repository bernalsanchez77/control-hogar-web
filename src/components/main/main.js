import React, { Component } from 'react';

class Main extends Component {
  constructor() {
    super();
    const states = {
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
      Hdmi: {state: 'roku', label: 'Hdmi', id: 'Hdmi'},
    };
    this.state = {states: states,deviceStates: states};
    this.init();
  }
  async init() {
    this.getStates();
    setInterval(() => {this.getStates();}, 5000);
  }
  async getStates() {
    fetch('/api/getDeviceStates').then(res => res.json()).then(
      deviceStates => {this.setState({deviceStates: this.getUpdatedDeviceStates(deviceStates)})}
    ).catch(err => {});
  }
  getUpdatedDeviceStates(deviceStates) {
    const updatedDeviceStates = {};
    for (let device in this.state.deviceStates) {
      updatedDeviceStates[device] = {...this.state.deviceStates[device], state: deviceStates[device]};
    }
    return updatedDeviceStates;
  }
  async changeDevice(device, state) {
    // fetch('/api/sendIfttt?device=' + device + '&state=' + state);
    this.setState(prev => ({deviceStates: {...prev.deviceStates, [device.state]: state}}), () => {
      const deviceStates = this.state.deviceStates;
      fetch('/api/setDeviceStates', {method: 'PUT',headers: {'Content-Type': 'application/json',},body: JSON.stringify(deviceStates)}).then(res => res.json()).then(data => {}).catch(err => {});
    });
  }
  async triggerDevice(device) {
    if (this.state.deviceStates[device].state === 'On') {
      this.changeDevice(device, 'Off');
    } else {
      this.changeDevice(device, 'On');
    }
  }
  render() {
    return (
      <div>
        <div>
        <button onClick={() => this.triggerDevice(this.state.deviceStates.LamparaComedor.id)}>{this.state.deviceStates.LamparaComedor.label} {this.state.deviceStates.LamparaComedor.state}</button>
        </div>
        <div>
        <button onClick={() => this.triggerDevice(this.state.deviceStates.LamparaTurca.id)}>{this.state.deviceStates.LamparaTurca.label} {this.state.deviceStates.LamparaTurca.state}</button>
        </div>
      </div>
    );
  }
}

export default Main;
