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
      resetLabel: 'Reset',
      rokuLabel: 'Cable',
      states: states,
      deviceStates: states
    };
    this.init();
  }
  async init() {
    fetch('/api/getVariables').then(res => res.json()).then(data => {
      this.setState({
        deviceStates: data
      });
  })
  .catch(err => console.log('Error: ', err));

    setInterval(() => {
      fetch('/api/getVariables').then(res => res.json()).then(data => {
          this.setState({
            deviceStates: data
          });
      }).catch(err => console.log('Error: ', err));
    }, 5000);
  }
  async resetDevices() {
    this.setState({
      resetLabel: 'Reset done'
    });
    const state = this.state.states;
    fetch('/api/saveVariables', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state)
    }).then(res => res.json()).then(data => {}).catch(err => {});
  }
  async changeDevice(key, value) {
    this.setState(prevState => ({
      deviceStates: {
        ...prevState.deviceStates,
        [key]: value,
      }
    }));
    console.log(this.state.deviceStates);
    const deviceStates = this.state.deviceStates;
    fetch('/api/saveVariables', {method: 'PUT',headers: {'Content-Type': 'application/json',},body: JSON.stringify(deviceStates)});
  }
  async changeRoku() {
  }
  async changeLamparaComedor() {
    if (this.state.deviceStates.LamparaComedor === 'On') {
      fetch('/api/saveIfttt?device=LamparaComedor&state=Off');
      this.changeDevice('LamparaComedor', 'Off');
    } else {
      fetch('/api/saveIfttt?device=LamparaComedor&state=On');
      this.changeDevice('LamparaComedor', 'On');
    }
  }
  render() {
    return (
      <div>
        <div>
        <button onClick={() => this.resetDevices()}>{this.state.resetLabel}</button>
        </div>
        <div>
        <button onClick={() => this.changeRoku()}>{this.state.rokuLabel}</button>
        </div>
        <div>
        <button onClick={() => this.changeLamparaComedor()}>Lampara Comedor: {this.state.deviceStates.LamparaComedor}</button>
        </div>
      </div>
    );
  }
}

export default Top;
