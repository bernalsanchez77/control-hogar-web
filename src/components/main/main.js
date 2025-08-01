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
import YoutubeDummyData from '../../global/youtube-dummy-data';
import './main.css';

function Main() {
  const utils = useRef({});
  utils.current = new Utils();
  const requests = useRef({});
  requests.current = new Requests();
  const youtubeDummyData = useRef({});
  youtubeDummyData.current = new YoutubeDummyData();
  const loadingDevices = useRef(false);
  const gettingInRange = useRef(false);
  const userActive = useRef(true);
  const [userActive2, setUserActive2] = useState(false);

  const [sendDisabled, setSendDisabled] = useState(false);
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
  const youtubeSearchVideos = useRef([]);
  const youtubeLizVideos = useRef([]);

  const triggerVibrate = (length = 100) => {
    if (navigator.vibrate) {
      navigator.vibrate([length]);
    }
  }

  const changeChannelCategory = (category) => {
    triggerVibrate();
    setChannelCategory(category);
  }

  const searchYoutube = async (text) => {
    // youtubeSearchVideos.current = await requests.current.searchYoutube(text);
    youtubeSearchVideos.current = youtubeDummyData.current.getYoutubeDummyData();
  }

  const changeDeviceState = async (state) => {
    if (state === 'youtube') {
      if (youtubeLizVideos.current.length === 0) {
        youtubeLizVideos.current = await requests.current.getYoutubeLizVideos();
        youtubeLizVideos.current = youtubeLizVideos.current.data;
      }
    }
    triggerVibrate();
    setDeviceState(state);
  }

  const changeControl = (params) => {
    requests.current.sendControl(sendDisabled, params);
    const media = params.massMedia || params.ifttt || [];
    if (media.length > 0) {
      const devices = {...devicesStateUpdated.current};
      media.forEach(el => {
        if (Array.isArray(el.key)) {
          devices[el.device][el.key[0]] = {...devices[el.device][el.key[0]], [el.key[1]]: el.value};
        } else {
          devices[el.device] = {...devices[el.device], [el.key]: el.value};
          if (el.key === 'video') {
            const video = youtubeLizVideos.current.find(video => video.videoId === el.value);
            if (video) {
              video.videoDate = new Date().toISOString();
              requests.current.updateYoutubeLizVideo({videoId: video.videoId, videoDate: new Date().toISOString()});
            }
          }
        }
      });
      setDevicesState(devices);
      requests.current.setDevices(devices);
    }
  }

  const triggerControl = (params) => {
    if (!params.ignoreVibration) {
      triggerVibrate();
    }
    if (validateRangeAndCredential) {
      if (!loadingDevices.current) {
        changeControl(params);
      } else {
        setTimeout(() => {
          triggerControl(params);
        }, 1000);
      }
    }
  }

  const changeScreen = (screen) => {
    triggerVibrate();
    if (validateRangeAndCredential) {
      if (!loadingDevices.current) {
        setScreenSelected(screen);
        localStorage.setItem('screen', screen);
      } else {
        setTimeout(() => {
          setScreenSelected(screen);
          localStorage.setItem('screen', screen);
        }, 1000);
      }
    }
  }

  const validateRangeAndCredential = () => {
    return inRange || (credential === ownerCredential.current || credential === devCredential.current);
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
  
  const getRokuData = useCallback(async (firstTime) => {
    let updatesEnabled = !updatesDisabledRef.current;
    if (firstTime) {
      updatesEnabled = true;
    }
    if (userActive.current && updatesEnabled) {
      let changed = false;
      const devices = {...devicesStateUpdated.current};
      let response = await requests.current.getRokuData('active-app');
      if (response && response.status === 200) {
        if (devicesState.rokuSala.apps[devicesState.rokuSala.app].rokuId !== response.data['active-app'].app.id) {
          devices.rokuSala.app = Object.values(devicesState.rokuSala.apps).find(app => app.rokuId === response.data['active-app'].app.id).id;
          changed = true;
        }
      }
      response = await requests.current.getRokuData('media-player');
      if (response && response.status === 200) {
        if (devicesState.rokuSala.state !== response.data.player.state) {
          devices.rokuSala.state = response.data.player.state;
          changed = true;
        }
      }
      if (changed) {
        setDevicesState(devices);
        requests.current.setDevices(devices);
      }
    }
  }, []);

  const getMassMediaData = useCallback(async (firstTime) => {
    let updatesEnabled = !updatesDisabledRef.current;
    if (firstTime) {
      updatesEnabled = true;
    }
    if (userActive.current && updatesEnabled) {
      loadingDevices.current = true;
      const response = await requests.current.getMassMediaData();
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
        setUserActive2(true);
        message = user.current + ' regreso';
      } else {
        userActive.current = false;
        setUserActive2(false);
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
      getMassMediaData(true);
      getRokuData(true);
    }
    setInterval(() => {
      if (localStorage.getItem('user')) {
        getMassMediaData();
        getRokuData();
      }
    }, 10000);
    setInterval(() => {getPosition();}, 300000);
    requests.current.sendLogs(user.current + ' entro');
    getVisibility();
    if (document.readyState === "complete") {
      document.body.classList.add("loaded");
    } else {
      window.addEventListener("load", document.body.classList.add("loaded"));
    }
    console.log('version 26');
  }, [getMassMediaData, getRokuData, getPosition, getVisibility, user]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    updatesDisabledRef.current = updatesDisabled;
  }, [updatesDisabled]);

  useEffect(() => {
    if (credential === 'dev') {
      setSendDisabled(true);
    }
    if (credential === devCredential.current) {
        eruda.init();
    }
  }, [credential]);

  useEffect(() => {
    devicesStateUpdated.current = devicesState;
  }, [devicesState]);

  const resetDevices = async () => {
    await requests.current.setDevices(devicesOriginal);
  }

  const disableIfttt = () => {
    if (sendDisabled === true) {
      setSendDisabled(false);
    } else {
      setSendDisabled(true);
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
    <div className="main fade-in">
      {!credential &&
      <Credentials
        credential={credential}
        guestCredential={guestCredential.current}
        setCredentialsParent={setCredentials}>
      </Credentials>
      }
      {credential &&
      <div className='main-components'>
        {validateRangeAndCredential() ?
        <div>
          <Screens
            credential={credential}
            ownerCredential={ownerCredential.current}
            devCredential={devCredential.current}
            devicesState={devicesState}
            screenSelected={screenSelected}
            userActive={userActive2}
            changeScreenParent={changeScreen}>
          </Screens>
          <Controls
            devicesState={devicesState}
            screenSelected={screenSelected}
            channelCategory={channelCategory}
            deviceState={deviceState}
            youtubeSearchVideos={youtubeSearchVideos}
            youtubeLizVideos={youtubeLizVideos}
            changeChannelCategoryParent={changeChannelCategory}
            changeDeviceStateParent={changeDeviceState}
            changeControlParent={triggerControl}
            triggerVibrateParent={triggerVibrate}
            searchYoutubeParent={searchYoutube}>
          </Controls>
          {deviceState === 'default' &&
          <Devices
            credential={credential}
            ownerCredential={ownerCredential.current}
            devCredential={devCredential.current}
            devicesState={devicesState}
            deviceState={deviceState}
            changeDeviceStateParent={changeDeviceState}
            changeControlParent={triggerControl}>
          </Devices>
          }
          {credential === devCredential.current && deviceState === 'default' &&
          <Dev
            sendDisabled={sendDisabled}
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
