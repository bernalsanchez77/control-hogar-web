import React, { Component } from 'react';
import Screen from './screen';
import { devices } from '../../global/devices';

class Main extends Component {
  constructor() {
    super();
    const devices = {};
    this.state = {devices: devices, devicesOriginal: devices};
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
  async changeDevice(device, state) {
    // fetch('/api/sendIfttt?device=' + device + '&state=' + state);
    this.setState(prev => ({devices: {...prev.devices, [device]: {...this.state.devices[device], state: state}}}), () => {
      const devices = this.state.devices;
      fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devices)}).then(res => res.json()).then(data => {}).catch(err => {});
    });
  }
  async triggerDevice(device) {
    if (this.state.devices[device].state === 'on') {
      this.changeDevice(device, 'off');
    } else {
      this.changeDevice(device, 'on');
    }
  }
  resetDevices() {
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(this.state.devicesOriginal)});
  }
  render() {
    return (
      <div>
        <Screen></Screen>
        <div>
        <button onClick={() => this.triggerDevice(this.state.devices.lamparaComedor.id)}>{this.state.devices.lamparaComedor.label} {this.state.devices.lamparaComedor.state}</button>
        </div>
        <div>
        <button onClick={() => this.triggerDevice(this.state.devices.lamparaTurca.id)}>{this.state.devices.lamparaTurca.label} {this.state.devices.lamparaTurca.state}</button>
        </div>
        <div>
        <button onClick={() => this.resetDevices()}>Reset</button>
        </div>
      </div>
    );
  }
}

export default Main;
