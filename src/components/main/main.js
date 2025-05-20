import React, { useState, useEffect, useCallback, useRef } from 'react';
import eruda from 'eruda';
import Screens from './screens/screens';
import Devices from './devices/devices';
import Controls from './controls/controls';
import Credentials from './credentials/credentials';
import Dev from './dev/dev';
import { devicesOriginal } from '../../global/devices';
import Utils from '../../global/utils';
import './main.css';

function Main() {
  const utils = useRef({});
  utils.current = new Utils();
  const loadingDevices = useRef(false);
  const gettingInRange = useRef(false);
  const userActive = useRef(true);
  const iftttDisabled = useRef(false);
  const [channelsDisabled, setChannelDisabled] = useState(true);
  const [updatesDisabled, setUpdatesDisabled] = useState(true);
  const [devicesState, setDevicesState] = useState(devicesOriginal);
  const devicesStateUpdated = useRef(devicesState);
  const [inRange, setInRange] = useState(false);
  const [screenSelected, setScreenSelected] = useState('teleSala');
  const [credential, setCredential] = useState('');
  const ownerCredential = useRef('owner');
  const guestCredential = useRef('guest');
  const devCredential = useRef('dev');
  const user = useRef(utils.current.getUser(`${window.screen.width}x${window.screen.height}`));

  const fetchIfttt = (text) => {
    if (!iftttDisabled.current) {
      fetch(text);
    }
  }

  const changeControlHogarData = (device, key, value, save = true) => {
    const devices = {...devicesStateUpdated.current};
    let saveState = true;
    device.forEach(item => {
      let send = true;
      if (iftttDisabled.current) {
        send = false;
      } else if (channelsDisabled && item === 'hdmiSala') {
        send = false;
        saveState = false;
      }
      if (send) {
        fetchIfttt('/api/sendIfttt?device=' + item + '&key=' + key[0] + '&value=' + value[0]);
      }
      if (save) {
        if (key[1]) {
          devices[item][key[0]] = {...devices[item][key[0]], [key[1]]: value[1] || value[0]};
        } else {
          devices[item] = {...devices[item], [key[0]]: value[1] || value[0]};
        }
      }
    });
    if (save) {
      setDevicesState(devices);
      if (saveState) {
        fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devices)}).then(res => res.json()).then(data => {}).catch(err => {});
      }
    }
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
        if (data.dev) {
          localStorage.setItem('user', data.dev);
          setCredential(devCredential.current);
        } else {
          localStorage.setItem('user', ownerCredential.current);
          setCredential(ownerCredential.current);
        }
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
    setInterval(() => {
      if (!updatesDisabled) {
        getStates();
      }
    }, 5000);
    setInterval(() => {getPosition();}, 300000);
    utils.current.sendLogs(user.current + ' entro');
    getVisibility();
  }, [getStates, getPosition, getVisibility, user]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (credential === devCredential.current) {
      eruda.init();
    }
    devicesStateUpdated.current = devicesState;
  }, [devicesState, credential, devCredential]);

  const resetDevices = () => {
    fetch('/api/setDevices', {method: 'PUT',headers: {'Content-Type': 'application/json',}, body: JSON.stringify(devicesOriginal)});
  }

  const disableIfttt = () => {
    if (iftttDisabled.current === true) {
      iftttDisabled.current = false;
    } else {
      iftttDisabled.current = true;
    }
  }

  const disableUpdates = () => {
    if (updatesDisabled === true) {
      setUpdatesDisabled(false);
    } else {
      setUpdatesDisabled(true);
    }
  }

  const removeStorage = () => {
    localStorage.setItem('user', '');
  }

  const disableChannels = () => {
    if (channelsDisabled === true) {
      setChannelDisabled(false);
      setUpdatesDisabled(false);
    } else {
      setChannelDisabled(true);
      setUpdatesDisabled(true);
    }
  }

  const changeDev = (name) => {
    const fn = devActions[name];
    if (typeof fn === 'function') {
      fn();
    }
  }

  const devActions = {
    resetDevices,
    disableIfttt,
    removeStorage,
    disableChannels,
    disableUpdates
  };

  return (
    <div className="main">
      <Credentials
        credential={credential}
        guestCredential={guestCredential.current}
        setCredentialsParent={setCredentials}>
      </Credentials>
      {credential &&
      <div className='main-components'>
        {inRange || (credential === ownerCredential.current || credential === devCredential.current) ?
        <div>
          <Screens
            credential={credential}
            ownerCredential={ownerCredential.current}
            devCredential={devCredential.current}
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
            devCredential={devCredential.current}
            inRange={inRange}
            devicesState={devicesState}
            loadingDevices={loadingDevices}
            changeDeviceParent={changeDevice}>
          </Devices>
          {credential === devCredential.current &&
          <Dev
            iftttDisabled={iftttDisabled}
            channelsDisabled={channelsDisabled}
            updatesDisabled={updatesDisabled}
            changeDevParent={changeDev}>
          </Dev>
          }
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
