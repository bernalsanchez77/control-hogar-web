import React, { useState, useEffect, useCallback, useRef } from 'react';
import Screens from './screens/screens';
import Devices from './devices/devices';
import Controls from './controls/controls';
import Credentials from './credentials/credentials';
import { devicesOriginal } from '../../global/devices';
import Utils from '../../global/utils';
import './main.css';

function Main() {
  const utils = useRef({});
  utils.current = new Utils();
  const loadingDevices = useRef(false);
  const gettingInRange = useRef(false);
  const userActive = useRef(true);
  const [devicesState, setDevicesState] = useState(devicesOriginal);
  const devicesStateUpdated = useRef(devicesState);
  const [inRange, setInRange] = useState(false);
  const [screenSelected, setScreenSelected] = useState('teleSala');
  const [credential, setCredential] = useState('');
  const ownerCredential = useRef('owner');
  const guestCredential = useRef('guest');
  const user = useRef(utils.current.getUser(`${window.screen.width}x${window.screen.height}`));

  const fetchIfttt = (text) => {
    fetch(text);
  }

  const changeControlHogarData = (device, key, value) => {
    const devices = {...devicesStateUpdated.current};
    device.forEach(item => {
      fetchIfttt('/api/sendIfttt?device=' + item + '&key=' + key + '&value=' + value);
      if (key[1]) {
        devices[item][key[0]] = {...devices[item][key[0]], [key[1]]: value};
      } else {
        devices[item] = {...devices[item], [key[0]]: value};
      }
    });
    setDevicesState(devices);
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devices)}).then(res => res.json()).then(data => {}).catch(err => {});
  }

  const changeDevice = (device, key, value) => {
    changeControlHogarData(device, key, value);
  }

  const changeControl = (device, key, value) => {
    changeControlHogarData(device, key, value);
  }

  const changeScreen = (screen) => {
    setScreenSelected(screen);
    localStorage.setItem('screen', screen);
  }

  const setCredentials = async (credential) => {
    if (credential === guestCredential.current) {
      localStorage.setItem('user', credential);
      setCredential(credential);
    } else {
      const res = await fetch("/api/validateCredentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({key: credential}),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', ownerCredential.current);
        setCredential(ownerCredential.current);
      }
    }
  }

  const getStates = useCallback(async () => {
    if (userActive.current) {
      loadingDevices.current = true;
      fetch('/api/getDevices').then(res => res.json()).then(
        devices => {
          setDevicesState(devices);
          loadingDevices.current = false;
        }
      ).catch(err => {});
    }
  }, []);

  const getPosition = useCallback(async () => {
    if (userActive.current) {
      gettingInRange.current = true;
      const inRange = await utils.current.getInRange();
      setInRange(inRange);
      gettingInRange.current = false;
    }
  }, []);

  const getVisibility = useCallback(() => {
    const handleVisibilityChange = () => {
      let message = '';
      if (document.visibilityState === 'visible') {
        userActive.current = true;
        message = user.current + ' regreso';
      } else {
        userActive.current = false;
        message = user.current + ' salio';
      }
      utils.current.sendLogs(message);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const init = useCallback(async () => {
    const localStorageScreen = localStorage.getItem('screen');
    if (localStorageScreen) {
      setScreenSelected(localStorageScreen);
    }
    setCredential(localStorage.getItem('user'));
    const inRange = await utils.current.getInRange();
    setInRange(inRange);
    getStates();
    setInterval(() => {getStates();}, 5000);
    setInterval(() => {getPosition();}, 300000);
    utils.current.sendLogs(user.current + ' entro');
    getVisibility();
  }, [getStates, getPosition, getVisibility, user]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    devicesStateUpdated.current = devicesState;
  }, [devicesState]);

  const resetDevices = () => {
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devicesOriginal)});
  }

  return (
    <div className="main">
      <Credentials
        credential={credential}
        guestCredential={guestCredential.current}
        setCredentialsParent={setCredentials}>
      </Credentials>
      {credential &&
        <div>
          {inRange || credential === ownerCredential.current ?
          <div>
            <Screens
              credential={credential}
              ownerCredential={ownerCredential.current}
              inRange={inRange}
              devicesState={devicesState}
              loadingDevices={loadingDevices}
              screenSelected={screenSelected}
              changeScreenParent={changeScreen}>
            </Screens>
            <Controls
              credential={credential}
              ownerCredential={ownerCredential.current}
              inRange={inRange}
              devicesState={devicesState}
              loadingDevices={loadingDevices}
              screenSelected={screenSelected}
              changeControlParent={changeControl}>
            </Controls>
            <Devices
              credential={credential}
              ownerCredential={ownerCredential.current}
              inRange={inRange}
              devicesState={devicesState}
              loadingDevices={loadingDevices}
              changeDeviceParent={changeDevice}>
            </Devices>
            <div>
              <button onClick={resetDevices}>
                Reset
              </button>
            </div>
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

export default Main;
