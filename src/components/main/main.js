import React, { useState, useEffect, useCallback, useRef } from 'react';
import eruda from 'eruda';
import Screens from './screens/screens';
import Devices from './devices/devices';
import Controls from './controls/controls';
import Credentials from './credentials/credentials';
import Dev from './dev/dev';
import { devicesOriginal } from '../../global/devices';
import Utils from '../../global/utils';
import Requests from '../../global/requests';
import './main.css';

function Main() {
  const utils = useRef({});
  utils.current = new Utils();
  const requests = useRef({});
  requests.current = new Requests();
  const loadingDevices = useRef(false);
  const gettingInRange = useRef(false);
  const userActive = useRef(true);

  const [iftttDisabled, setIftttDisabled] = useState(false);
  const [updatesDisabled, setUpdatesDisabled] = useState(false);
  const updatesDisabledRef = useRef(updatesDisabled);
  const [credential, setCredential] = useState('');
  const [channelCategory, setChannelCategory] = useState(['default']);
  const [deviceState, setDeviceState] = useState('default');

  const [devicesState, setDevicesState] = useState(devicesOriginal);
  const devicesStateUpdated = useRef(devicesState);
  const [inRange, setInRange] = useState(false);
  const [screenSelected, setScreenSelected] = useState('teleSala');
  const ownerCredential = useRef('owner');
  const guestCredential = useRef('guest');
  const devCredential = useRef('dev');
  const user = useRef(utils.current.getUser(`${window.screen.width}x${window.screen.height}`));

  const changeControlHogarDevice = (device, key, value, saveChange = true) => {
    const devices = {...devicesStateUpdated.current};
    device.forEach(item => {
      if (!iftttDisabled) {
        requests.current.sendIfttt({device: item, key: key[0], value: value[0]});
      }
      if (saveChange) {
        if (key[1]) {
          devices[item][key[0]] = {...devices[item][key[0]], [key[1]]: value[1] || value[0]};
        } else {
          devices[item] = {...devices[item], [key[0]]: value[1] || value[0]};
        }
      }
    });
    if (saveChange) {
      setDevicesState(devices);
      requests.current.setDevices(devices);
    }
  }

  const changeControlHogarData = (device, key, value, saveChange = true) => {
    const devices = {...devicesStateUpdated.current};
    device.forEach(item => {
      if (!iftttDisabled) {
        requests.current.sendControl({device: item.ifttt, key: key[0], value: value[0]}, devicesState.rokuSala.id);
      }
      if (saveChange) {
        if (key[1]) {
          devices[item.device][key[0]] = {...devices[item.device][key[0]], [key[1]]: value[1] || value[0]};
        } else {
          devices[item.device] = {...devices[item.device], [key[0]]: value[1] || value[0]};
        }
      }
    });
    if (saveChange) {
      setDevicesState(devices);
      requests.current.setDevices(devices);
    }
  }

  const changeChannelCategory = (category) => {
    setChannelCategory(category);
  }

  const changeDeviceState = (state) => {
    setDeviceState(state);
  }

  const changeDevice = (device, key, value, save) => {
    changeControlHogarDevice(device, key, value, save);
  }

  const changeControl = (device, key, value, save) => {
    changeControlHogarData(device, key, value, save);
  }

  const changeScreen = (screen) => {
    setScreenSelected(screen);
    localStorage.setItem('screen', screen);
  }

  const setCredentials = async (userCredential) => {
    if (userCredential === guestCredential.current) {
      localStorage.setItem('user', userCredential);
      setCredential(userCredential);
    } else {
      const response = await requests.current.setCredentials(userCredential);
      if (response.status === 200 && response.data.validUser) {
        if (response.data.dev) {
          localStorage.setItem('user', response.data.dev);
          setCredential(devCredential.current);
        } else {
          localStorage.setItem('user', ownerCredential.current);
          setCredential(ownerCredential.current);
        }
      }
    }
  }

  const getStates = useCallback(async (firstTime) => {
    let updatesEnabled = !updatesDisabledRef.current;
    if (firstTime) {
      updatesEnabled = true;
    }
    if (userActive.current && updatesEnabled) {
      loadingDevices.current = true;
      const response = await requests.current.getStates();
      if (response.status === 200) {
        setDevicesState(response.data);
        loadingDevices.current = false;
      }
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
      requests.current.sendLogs(message);
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
    if (localStorage.getItem('user')) {
      getStates(true);
    }
    setInterval(() => {
      if (localStorage.getItem('user')) {
        getStates();
      }
    }, 5000);
    setInterval(() => {getPosition();}, 300000);
    requests.current.sendLogs(user.current + ' entro');
    getVisibility();
  }, [getStates, getPosition, getVisibility, user]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    updatesDisabledRef.current = updatesDisabled;
  }, [updatesDisabled]);

  useEffect(() => {
    if (credential === 'dev') {
      setUpdatesDisabled(true);
    }
  }, [credential]);

  useEffect(() => {
    if (credential === devCredential.current) {
        eruda.init();
        console.log('version 14');
    }
  }, [credential]);

  useEffect(() => {
    devicesStateUpdated.current = devicesState;
  }, [devicesState]);

  const resetDevices = async () => {
    await requests.current.setDevices(devicesOriginal);
  }

  const disableIfttt = () => {
    if (iftttDisabled === true) {
      setIftttDisabled(false);
    } else {
      setIftttDisabled(true);
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
            channelCategory={channelCategory}
            deviceState={deviceState}
            changeChannelCategoryParent={changeChannelCategory}
            changeDeviceStateParent={changeDeviceState}
            changeControlParent={changeControl}>
          </Controls>
          <Devices
            credential={credential}
            ownerCredential={ownerCredential.current}
            devCredential={devCredential.current}
            inRange={inRange}
            devicesState={devicesState}
            loadingDevices={loadingDevices}
            deviceState={deviceState}
            changeDeviceStateParent={changeDeviceState}
            changeDeviceParent={changeDevice}>
          </Devices>
          {credential === devCredential.current &&
          <Dev
            iftttDisabled={iftttDisabled}
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
