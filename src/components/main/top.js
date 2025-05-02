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
    const otro = this.state.states;
    fetch('/api/saveVariables', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(otro)
    })
      .then(res => res.json())
      .then(data => console.log('Respuesta PUT:', data))
      .catch(err => console.error('Error:', err));
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
    let url = '';
    if (this.state.deviceStates.LamparaComedor === 'Off') {
      url = "https://maker.ifttt.com/trigger/LamparaComedorOn/with/key/i4M0yNSEdCF7dQdEMs5e_XhA1BnQypmCTWIrlPVidUG";
      // this.setState({
      //   resetLabel: 'Roku'
      // });
    } else {
      url = "https://maker.ifttt.com/trigger/LamparaComedorOff/with/key/i4M0yNSEdCF7dQdEMs5e_XhA1BnQypmCTWIrlPVidUG";
    }
    const response = await fetch(url);
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
