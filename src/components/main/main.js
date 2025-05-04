import React, { useState, useEffect, useCallback, useRef } from 'react';
import Screen from './screen/screen';
import Devices from './devices/devices';
import { devicesOriginal } from '../../global/devices';
import './main.css';

function Main() {
  const loadingDevices = useRef(false);
  const [devicesState, setDevicesState] = useState(devicesOriginal);
  const [permitido, setPermitido] = useState(false);

  const changeDevice = (device, state) => {
    fetch('/api/sendIfttt?device=' + device + '&state=' + state);
    const devices = {...devicesState};
    devices[device] = {...devices[device], state: state};
    setDevicesState(devices);
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devices)}).then(res => res.json()).then(data => {}).catch(err => {});
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
    setInterval(() => {getStates();}, 5000);
  }, [getStates]);

  const estaEnZonaPermitida = (lat, lon) => {
    // Ejemplo: dentro de Bogotá (latitud y longitud aproximadas)
    // lat: 9.9622781
    // lon: -84.0783371
    return lat > 7 && lat < 11 && lon > -86 && lon < -82;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('lat: ', latitude);
        console.log('lon: ', longitude);

        // Verifica si está dentro del área deseada
        if (estaEnZonaPermitida(latitude, longitude)) {
          setPermitido(true);
        } else {
          setPermitido(false);
        }
      },
      (error) => {
        console.error('Error al obtener ubicación:', error);
        setPermitido(false); // Denegado o error = no permitido
      }
    );
    if (permitido) {
      alert('permitido');
    } else {
      alert ('no permitido');
    }

    init();
  }, [init]);

  const resetDevices = () => {
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devicesOriginal)});
  }
  return (
    <div className="main">
      <Screen></Screen>
      <Devices devicesState={devicesState} loadingDevices={loadingDevices} changeDeviceParent={changeDevice}></Devices>
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
