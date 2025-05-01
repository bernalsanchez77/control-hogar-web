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
      rokuLabel: 'Cable8',
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
    console.log(JSON.stringify(this.state.states));
    fetch('/api/saveVariables', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.deviceStates)
    })
      .then(res => res.json())
      .then(data => console.log('Respuesta PUT:', data))
      .catch(err => console.error('Error:', err));
  }
  async changeRoku() {
    this.setState({
      resetLabel: 'Roku'
    });
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
  render() {
    return (
      <div>
        <button onClick={() => this.resetDevices()}>{this.state.resetLabel}</button>
        <button onClick={() => this.changeRoku()}>{this.state.rokuLabel}</button>
        <div>
        <span>Lampara Comedor: {this.state.deviceStates.LamparaComedor}</span>
        </div>
      </div>
    );
  }
}

export default Top;
