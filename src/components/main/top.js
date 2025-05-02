import React, { Component } from 'react';

class Top extends Component {
  constructor() {
    super();
    const states = {
      LamparaComedor:"Off",
      LamparaSala:"Off",
      LamparaTurca:"Off",
      LamparaLava:"Off",
      LamparaRotatoria:"Off",
      Chimenea:"Off",
      LamparasAbajo:"Off",
      ParlantesSala:"Off",
      CalentadorNegro:"Off",
      CalentadorBlanco:"Off",
      ProyectorMute:"Off",
      SalaMute:"Off",
      CuartoMute:"off",
      Hdmi:"roku"};
    this.state = {
      states: states,
      deviceStates: states
    };
    this.init();
  }
  async init() {
    this.getVariables();
    setInterval(() => {
      this.getVariables();
    }, 5000);
  }
  async getVariables() {
    fetch('/api/getVariables').then(res => res.json()).then(data => {
      this.setState({
        deviceStates: data
      });
    }).catch(err => {});
  }
  async changeDevice(key, value) {
    this.setState(prev => ({deviceStates: {...prev.deviceStates,[key]: value}}), () => {
      const deviceStates = this.state.deviceStates;
      fetch('/api/saveVariables', {method: 'PUT',headers: {'Content-Type': 'application/json',},body: JSON.stringify(deviceStates)}).then(res => res.json()).then(data => {}).catch(err => {});
    });
  }
  async triggerDevice(device) {
    if (this.state.deviceStates[device] === 'On') {
      fetch('/api/saveIfttt?device=' + device + '&state=Off');
      this.changeDevice(device, 'Off');
    } else {
      fetch('/api/saveIfttt?device=' + device + '&state=On');
      this.changeDevice(device, 'On');
    }
  }
  render() {
    return (
      <div>
        <div>
        <button onClick={() => this.triggerDevice('LamparaComedor')}>Lampara Comedor: {this.state.deviceStates.LamparaComedor}</button>
        </div>
      </div>
    );
  }
}

export default Top;
