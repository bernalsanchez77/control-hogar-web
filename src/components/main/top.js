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
      })
      .catch(err => console.log('Error: ', err));
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
    })
      .then(res => res.json())
      .then(data => console.log('Respuesta PUT:', data))
      .catch(err => console.error('Error:', err));
  }
  async changeDevice(device, state) {
    this.state.deviceStates[device] = state;
    console.log(this.state.deviceStates);
    const deviceStates = this.state.deviceStates;
    fetch('/api/saveVariables', {method: 'PUT',headers: {'Content-Type': 'application/json',},body: JSON.stringify(deviceStates)});
  }
  async changeRoku() {
    const url = "https://maker.ifttt.com/trigger/LamparaComedorOn/with/key/i4M0yNSEdCF7dQdEMs5e_XhA1BnQypmCTWIrlPVidUG?value1=" + this.state.deviceStates;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return;
      }
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }
  async changeLamparaComedor() {
    if (this.state.deviceStates.LamparaComedor === 'On') {
      fetch('/api/saveIfttt?device=LamparaComedor&state=Off');
      this.changeDevice('LamparaComedor', 'On');
    } else {
      fetch('/api/saveIfttt?device=LamparaComedor&state=On');
      this.changeDevice('LamparaComedor', 'Off');
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
        <button onClick={() => this.changeLamparaComedor()}>{this.state.deviceStates.LamparaComedor}</button>
        </div>
      </div>
    );
  }
}

export default Top;
