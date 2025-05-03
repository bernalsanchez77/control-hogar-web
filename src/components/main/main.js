import React, { useState, useEffect, useCallback, useRef } from 'react';
import Screen from './screen';
import { devicesOriginal } from '../../global/devices';

function Main() {
  const loadingDevices = useRef(false);
  const [devicesState, setDevicesState] = useState(devicesOriginal);

  const changeDevice = (device, state) => {
    // fetch('/api/sendIfttt?device=' + device + '&state=' + state);
    const devices = {...devicesState};
    devices[device] = {...devices[device], state: state};
    setDevicesState(devices);
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devices)}).then(res => res.json()).then(data => {}).catch(err => {});
  }
  const triggerDevice = (device) => {
    if (!loadingDevices.current) {
    if (devicesState[device].state === 'on') {
      changeDevice(device, 'off');
    } else {
      changeDevice(device, 'on');
    }
  }
  }

  const getStates = useCallback(() => {
    loadingDevices.current = true;
    fetch('/api/getDevices').then(res => res.json()).then(
      devices => {
        setDevicesState(devices);
        loadingDevices.current = false;
      }
    ).catch(err => {});
  }, []);

  const init = useCallback(() => {
    getStates();
    setInterval(() => {
      getStates();
    }, 5000);
  }, [getStates]);

  useEffect(() => {
    init();
  }, [init]);

  const resetDevices = () => {
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devicesOriginal)});
  }
  return (
    <div>
      <Screen></Screen>
      <div>
      <button onClick={() => triggerDevice(devicesState.lamparaComedor.id)}>{devicesState.lamparaComedor.label} {devicesState.lamparaComedor.state}</button>
      </div>
      <div>
      <button onClick={() => triggerDevice(devicesState.lamparaTurca.id)}>{devicesState.lamparaTurca.label} {devicesState.lamparaTurca.state}</button>
      </div>
      <div>
      <button onClick={resetDevices}>Reset</button>
      </div>
    </div>
  );
}

// class Main extends Component {
//   constructor() {
//     super();
//     const devices = {
//       lamparaComedor: {state: 'off', label: 'Lampara Comedor', id: 'lamparaComedor'},
//       lamparaSala: {state: 'off', label: 'Lampara Sala', id: 'lamparaSala'},
//       lamparaTurca: {state: 'off', label: 'Lampara Turca', id: 'lamparaTurca'},
//       lamparaLava: {state: 'off', label: 'Lampara Lava', id: 'lamparaLava'},
//       lamparaRotatoria: {state: 'off', label: 'Lampara Rotatoria', id: 'lamparaRotatoria'},
//       chimenea: {state: 'off', label: 'Chimenea', id: 'chimenea'},
//       lamparasAbajo: {state: 'off', label: 'Lamparas Abajo', id: 'lamparasAbajo'},
//       parlantesSala: {state: 'off', label: 'Parlantes Sala', id: 'parlantesSala'},
//       palentadorNegro: {state: 'off', label: 'Calentador Lizzie', id: 'calentadorNegro'},
//       calentadorBlanco: {state: 'off', label: 'Calentador Amy', id: 'calentadorBlanco'},
//       proyectorMute: {state: 'off', label: 'Proyector Mute', id: 'proyectorMute'},
//       salaMute: {state: 'off', label: 'Sala Mute', id: 'salaMute'},
//       cuartoMute: {state: 'off', label: 'Cuarto Mute', id: 'cuartoMute'},
//       hdmi: {state: 'roku', label: 'Roku', id: 'hdmi'}
//   };
//     this.state = {devices: devices, devicesOriginal: devices};
//     this.init();
//   }
//   async init() {
//     this.getStates();
//     setInterval(() => {this.getStates();}, 5000);
//   }
//   async getStates() {
//     fetch('/api/getDevices').then(res => res.json()).then(
//       devices => {this.setState({devices: this.getUpdatedDevices(devices)})}
//     ).catch(err => {});
//   }
//   getUpdatedDevices(devices) {
//     const updatedDevices = {};
//     for (let device in this.state.devices) {
//       updatedDevices[device] = {...this.state.devices[device], state: devices[device].state};
//     }
//     return updatedDevices;
//   }
//   async changeDevice(device, state) {
//     // fetch('/api/sendIfttt?device=' + device + '&state=' + state);
//     this.setState(prev => ({devices: {...prev.devices, [device]: {...this.state.devices[device], state: state}}}), () => {
//       const devices = this.state.devices;
//       fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devices)}).then(res => res.json()).then(data => {}).catch(err => {});
//     });
//   }
//   async triggerDevice(device) {
//     if (this.state.devices[device].state === 'on') {
//       this.changeDevice(device, 'off');
//     } else {
//       this.changeDevice(device, 'on');
//     }
//   }
//   resetDevices() {
//     fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(this.state.devicesOriginal)});
//   }
//   render() {
//     return (
//       <div>
//         <Screen></Screen>
//         <div>
//         <button onClick={() => this.triggerDevice(this.state.devices.lamparaComedor.id)}>{this.state.devices.lamparaComedor.label} {this.state.devices.lamparaComedor.state}</button>
//         </div>
//         <div>
//         <button onClick={() => this.triggerDevice(this.state.devices.lamparaTurca.id)}>{this.state.devices.lamparaTurca.label} {this.state.devices.lamparaTurca.state}</button>
//         </div>
//         <div>
//         <button onClick={() => this.resetDevices()}>Reset</button>
//         </div>
//       </div>
//     );
//   }
// }

export default Main;
