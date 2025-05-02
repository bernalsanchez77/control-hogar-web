import React, { Component } from 'react';

class Main extends Component {
  constructor() {
    super();
    const states = {LamparaComedor:"Off",LamparaSala:"Off",LamparaTurca:"Off",LamparaLava:"Off",LamparaRotatoria:"Off",Chimenea:"Off",LamparasAbajo:"Off",ParlantesSala:"Off",CalentadorNegro:"Off",CalentadorBlanco:"Off",ProyectorMute:"Off",SalaMute:"Off",CuartoMute:"off",Hdmi:"roku"};
    this.state = {states: states,deviceStates: states};
    this.init();
  }
  async init() {
    this.getStates();
    setInterval(() => {this.getStates();}, 5000);
  }
  async getStates() {
    fetch('/api/getDeviceStates').then(res => res.json()).then(
      deviceStates => {this.setState({deviceStates: deviceStates})}
    ).catch(err => {});
  }
  async changeDevice(device, state) {
    fetch('/api/sendIfttt?device=' + device + '&state=' + state);
    this.setState(prev => ({deviceStates: {...prev.deviceStates,[device]: state}}), () => {
      const deviceStates = this.state.deviceStates;
      fetch('/api/setDeviceStates', {method: 'PUT',headers: {'Content-Type': 'application/json',},body: JSON.stringify(deviceStates)}).then(res => res.json()).then(data => {}).catch(err => {});
    });
  }
  async triggerDevice(device) {
    if (this.state.deviceStates[device] === 'On') {
      this.changeDevice(device, 'Off');
    } else {
      this.changeDevice(device, 'On');
    }
  }
  render() {
    return (
      <div>
        <div>
        <button onClick={() => this.triggerDevice('LamparaComedor')}>Lampara Comedor: {this.state.deviceStates.LamparaComedor}</button>
        </div>
        <div>
        <button onClick={() => this.triggerDevice('LamparaTurca')}>Lampara Turca: {this.state.deviceStates.Turca}</button>
        </div>
      </div>
    );
  }
}

export default Main;
