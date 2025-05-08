import React, { useState, useEffect, useCallback, useRef } from 'react';
import Screen from './screen/screen';
import Devices from './devices/devices';
import Credentials from './credentials/credentials';
import { devicesOriginal } from '../../global/devices';
import Utils from '../../global/utils';
import './main.css';

function Main() {
  const utils = useRef({});
  const loadingDevices = useRef(false);
  const gettingInRange = useRef(false);
  const [devicesState, setDevicesState] = useState(devicesOriginal);
  const [inRange, setInRange] = useState(false);
  const [credential, setCredential] = useState('');
  const ownerCredential = 'owner';
  const guestCredential = 'guest';

  const changeDevice = (device, state, nuevo) => {
    const devices = {...devicesState};
    if (typeof device === 'object') {
      device.forEach(item => {
        if (nuevo) {
          // fetch('/api/sendIfttt?device=' + item + '&state=' + state + '&nuevo=true');
        } else {
          // fetch('/api/sendIfttt?device=' + item + '&state=' + state);
        }
        devices[item] = {...devices[item], state: state};
      });
    } else {
      if (nuevo) {
        // fetch('/api/sendIfttt?device=' + device + '&state=' + state + '&nuevo=true');
      } else {
        // fetch('/api/sendIfttt?device=' + device + '&state=' + state);
      }
     devices[device] = {...devices[device], state: state};
    }
    setDevicesState(devices);
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devices)}).then(res => res.json()).then(data => {}).catch(err => {});
  }

  const setCredentials = async (credential) => {
    if (credential === guestCredential) {
      localStorage.setItem('controlhogar', credential);
      setCredential(credential);
    } else {
      const res = await fetch("/api/validateCredentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({key: credential}),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('controlhogar', ownerCredential);
        setCredential(ownerCredential);
      }
    }
  }

  const getStates = useCallback(async () => {
    loadingDevices.current = true;
    gettingInRange.current = true;
    fetch('/api/getDevices').then(res => res.json()).then(
      devices => {
        setDevicesState(devices);
        loadingDevices.current = false;
      }
    ).catch(err => {});
    const inRange = await utils.current.getGeolocationPosition();
    setInRange(inRange);
    gettingInRange.current = false;
  }, []);

  const init = useCallback(async () => {
    const credential = localStorage.getItem('controlhogar');
    setCredential(credential);
    utils.current = new Utils();
    alert('va a traer geo');
    const inRange = await utils.current.getGeolocationPosition();
    alert('geo ready');
    setInRange(inRange);
    getStates();
    setInterval(() => {getStates();}, 5000);
  }, [getStates]);

  useEffect(() => {
    init();
  }, [init]);

  const resetDevices = () => {
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devicesOriginal)});
  }
  return (
    <div className="main">
      <Credentials
        credential={credential}
        guestCredential={guestCredential}
        setCredentialsParent={setCredentials}>
      </Credentials>
      {credential &&
        <div>
          {inRange || credential === ownerCredential ?
          <div>
            <Screen
              credential={credential}>
            </Screen>
            <Devices
              credential={credential}
              guestCredential={ownerCredential}
              inRange={inRange}
              devicesState={devicesState}
              loadingDevices={loadingDevices}
              changeDeviceParent={changeDevice}>
            </Devices>
            {/* <div>
              <button onClick={resetDevices}>
                Reset
              </button>
            </div> */}
          </div> :
          <div>
            <span style={{color: "white"}}>Fuera del Area Permitida</span>
          </div>
          }
        </div>
      }
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
