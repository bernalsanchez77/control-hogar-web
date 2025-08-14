import React, { useState, useEffect, useCallback, useRef } from 'react';
import eruda from 'eruda';
import supabase from '../../global/supabase-client';
import Screens from './screens/screens';
import Devices from './devices/devices';
import Controls from './controls/controls';
import Credentials from './credentials/credentials';
import Dev from './dev/dev';
import { devicesOriginal } from '../../global/devices';
import Utils from '../../global/utils';
import Requests from '../../global/requests';
import YoutubeDummyData from '../../global/youtube-dummy-data';
import CableChannelsDummyData from '../../global/cable-channels-dummy-data';
import CableChannelCategories from '../../global/cable-channel-categories';
import RokuAppsDummyData from '../../global/roku-apps-dummy-data';
import './main.css';

function Main() {
  const utils = useRef({});
  utils.current = new Utils();
  const requests = useRef({});
  requests.current = new Requests();
  const youtubeDummyData = useRef({});
  youtubeDummyData.current = new YoutubeDummyData();
  const cableChannelCategories = useRef({});
  cableChannelCategories.current = new CableChannelCategories();
  cableChannelCategories.current = cableChannelCategories.current.getCableChannelCategories();
  const cableChannelsDummyData = useRef({});
  cableChannelsDummyData.current = new CableChannelsDummyData();
  const rokuAppsDummyData = useRef({});
  rokuAppsDummyData.current = new RokuAppsDummyData();
  const loadingDevices = useRef(false);
  const gettingInRange = useRef(false);
  const userActive = useRef(true);
  const [userActive2, setUserActive2] = useState(false);
  const [sendDisabled, setSendDisabled] = useState(false);
  const [updatesDisabled, setUpdatesDisabled] = useState(false);
  const updatesDisabledRef = useRef(updatesDisabled);
  const [credential, setCredential] = useState('');
  const [devicesState, setDevicesState] = useState(devicesOriginal);
  const devicesStateUpdated = useRef(devicesState);
  const [inRange, setInRange] = useState(false);
  const [screenSelected, setScreenSelected] = useState('teleSala');
  const ownerCredential = useRef('owner');
  const guestCredential = useRef('guest');
  const devCredential = useRef('dev');
  const user = useRef(utils.current.getUser(`${window.screen.width}x${window.screen.height}`));
  const [youtubeSearchVideos, setYoutubeSearchVideos] = useState([]);
  const [youtubeVideosLiz, setYoutubeVideosLiz] = useState([]);
  const [youtubeChannelsLiz, setYoutubeChannelsLiz] = useState([]);
  const [cableChannels, setCableChannels] = useState([]);
  const [rokuApps, setRokuApps] = useState([]);
  const [hdmiSala, setHdmiSala] = useState([]);
  const [devices, setDevices] = useState([]);
  const [screens, setScreens] = useState([]);
  const setters = {setYoutubeVideosLiz, setRokuApps, setCableChannels, setHdmiSala, setDevices, setScreens};
  //const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const initialized = useRef(false);
  const supabaseChannelsRef = useRef({});
  const [view, setView] = useState(
    {
      selected: '',
      cable: {channels: {category: []}},
      roku: {apps: {selected: '', youtube: {mode: '', channel: ''}}},
      devices: {device: ''},
    }
  );
  const viewRef = useRef(view);
  const triggerVibrate = (length = 100) => {
    if (navigator.vibrate) {
      navigator.vibrate([length]);
    }
  };

  const searchYoutube = async (text) => {
    const videos = await requests.current.searchYoutube(text);
    setYoutubeSearchVideos(videos);
    // setYoutubeSearchVideos(youtubeDummyData.current.getYoutubeDummyData());
  };

  const subscribeToSupabaseChannel = useCallback(async (tableName) => {
    const channel = getSupabaseChannel(tableName);
    if (channel?.socket.state !== 'joined') {
      channel.on(
        'postgres_changes',
        {event: '*', schema: 'public', table: tableName},
        async (change) => {
          console.log(tableName, ' changed');
          if (change.new.state === 'selected') {
            const data = await requests.current['getTableFromSupabase'](tableName);
            setters['set' + tableName.charAt(0).toUpperCase() + tableName.slice(1)](data.data);
            if (tableName === 'hdmiSala') {
              const newView = structuredClone(viewRef.current);
              newView.selected = data.data.find(el => el.state === 'selected').id;
              if (newView.selected === 'roku') {
                newView.cable.channels.category = [];
              }
              if (newView.selected === 'cable') {
                newView.roku.apps.selected = '';
                newView.roku.apps.youtube.mode = '';
                newView.roku.apps.youtube.channel = '';
              }
              changeView(newView);
            }
          }
        }
      ).subscribe(status => {
        console.log(tableName, ' status is: ', status);
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to ', tableName);
        }
      });
    }
  },[setters]);

  const subscribeToSupabaseChannelDevices = useCallback(async (tableName) => {
    const channel = getSupabaseChannel(tableName);
    if (channel?.socket.state !== 'joined') {
      channel.on(
        'postgres_changes',
        {event: '*', schema: 'public', table: tableName},
        async (change) => {
          console.log(tableName, ' changed');
          const data = await requests.current['getTableFromSupabase'](tableName);
          setters['set' + tableName.charAt(0).toUpperCase() + tableName.slice(1)](data.data);
        }
      ).subscribe(status => {
        console.log(tableName, ' status is: ', status);
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to ', tableName);
        }
      });
    }
  },[setters]);

  const changeView = useCallback(async (params) => {
    // triggerVibrate();
    const newView = structuredClone(params);

    if (newView.selected === 'cable') {
      // cable selected
      if (viewRef.current.selected === 'cable') {
        // was in cable
        if (newView.cable.channels.category.length) {
          // category selected
          // const channels = await requests.current.getTableFromSupabase('cableChannels');
          // setCableChannels(channels.data);       
        } else {
          
        }

      }
      if (viewRef.current.selected === 'roku') {
        // was in roku
        const channels = await requests.current.getTableFromSupabase('cableChannels');
        setCableChannels(channels.data);
        subscribeToSupabaseChannel('cableChannels');
        if (viewRef.current.roku.apps.selected) {
          // was in an app 
         if (viewRef.current.roku.apps.selected === 'youtube') {
           // app was Youtube
           if (viewRef.current.roku.apps.youtube.channel) {
             if (supabaseChannelsRef.current['youtubeVideosLiz']) {
               unsubscribeFromSupabaseChannel('youtubeVideosLiz');
             }      
           }
         } 
        } else {
          // was in home
          if (supabaseChannelsRef.current['rokuApps']) {
            unsubscribeFromSupabaseChannel('rokuApps');
          }               
        }
        
      }
    }

    if (newView.selected === 'roku') {
      // roku selected
      if (viewRef.current.selected === 'roku') {
        // was in roku
        if (newView.roku.apps.selected) {
          // app is selected
          if (viewRef.current.roku.apps.selected) {
            // was in an app
            if (newView.roku.apps.selected === 'youtube') {
              // app is Youtube
              if (newView.roku.apps.youtube.channel) {
                // youtube channel selected
                const videos = await requests.current.getTableFromSupabase('youtubeVideosLiz');
                setYoutubeVideosLiz(videos.data);
                subscribeToSupabaseChannel('youtubeVideosLiz');
              } else {
                // youtube channel is not selected
                if (supabaseChannelsRef.current['youtubeVideosLiz']) {
                  unsubscribeFromSupabaseChannel('youtubeVideosLiz');
                }
              }
            }
          } else {
            // was in home
            if (supabaseChannelsRef.current['rokuApps']) {
              unsubscribeFromSupabaseChannel('rokuApps');
            }
            if (newView.roku.apps.selected === 'youtube') {
              // app is Youtube
              if (!youtubeChannelsLiz.length) {
                const channels = await requests.current.getTableFromSupabase('youtubeChannelsLiz');
                setYoutubeChannelsLiz(channels.data);
              }
            }
          }
        } else {
          // no app selected
          if (viewRef.current.roku.apps.selected) {
            // was in an app
            const apps = await requests.current.getTableFromSupabase('rokuApps');
            setRokuApps(apps.data);
            subscribeToSupabaseChannel('rokuApps');
          }
        }
      }
      if (viewRef.current.selected === 'cable') {
        //was in cable
        if (supabaseChannelsRef.current['cableChannels']) {
          unsubscribeFromSupabaseChannel('cableChannels');
        }      
        const apps = await requests.current.getTableFromSupabase('rokuApps');
        setRokuApps(apps.data);
        subscribeToSupabaseChannel('rokuApps');
      }
    }
    setView(newView);
  }, [youtubeChannelsLiz.length, viewRef, subscribeToSupabaseChannel]);

  const changeControl = (params) => {
    requests.current.sendControl(sendDisabled, params);
    const media = params.massMedia || params.ifttt || [];
    if (media.length > 0) {
      media.forEach(async el => {
        if (Array.isArray(el.key)) {
          //devices[el.device][el.key[0]] = {...devices[el.device][el.key[0]], [el.key[1]]: el.value};
        } else {
          //devices[el.device] = {...devices[el.device], [el.key]: el.value};
          if (el.device === 'rokuSala') {
            if (el.key === 'video') {
              const video = youtubeVideosLiz.find(video => video.id === el.value);
              const currentVideo = youtubeVideosLiz.find(vid => vid.state === 'selected');
              if (video && currentVideo) {
                requests.current.updateTableInSupabase({id: video.id, table: 'youtubeVideosLiz', date: new Date().toISOString()}, currentVideo.id);
              }
            }
            if (el.key === 'app') {
              const app = rokuApps.find(app => app.id === el.value);
              const currentApp = rokuApps.find(ap => ap.state === 'selected');
              if (app && currentApp) {
                requests.current.updateTableInSupabase({id: app.id, table: 'rokuApps', date: new Date().toISOString()}, currentApp.id);
              }
            }
          }
          if (el.device === 'channelsSala') {
            const channel = cableChannels.find(ch => ch.id === el.value);
            const currentChannel = cableChannels.find(ch => ch.state === 'selected');
            if (channel && currentChannel) {
              requests.current.updateTableInSupabase({id: channel.id, table: 'cableChannels', date: new Date().toISOString()}, currentChannel.id);
            }
          }
          if (el.device === 'hdmiSala') {
            const hdmi = hdmiSala.find(hd => hd.id === el.value);
            const currentHdmi = hdmiSala.find(hd => hd.state === 'selected');
            if (hdmi && currentHdmi) {
              requests.current.updateTableInSupabase({id: hdmi.id, table: 'hdmiSala', date: new Date().toISOString()}, currentHdmi.id);
            }
            const newView = structuredClone(viewRef.current);
            if (el.value === 'roku') {
              if (newView.selected === 'cable') {
                newView.cable.channels.category = [];
              }
            }
            if (el.value === 'cable') {
              if (newView.selected === 'roku') {
                  newView.roku.apps.selected = '';
                  newView.roku.apps.youtube.mode = '';
                  newView.roku.apps.youtube.channel = '';
              }
            }
            newView.selected = el.value;
            changeView(newView);
          }
          if (el.device === 'lamparaComedor') {
            const device = devices.find(device => device.id === el.device);
            requests.current.updateTableInSupabaseDevices({id: device.id, table: 'devices', state: el.value, date: new Date().toISOString()});
          }
          if (el.device === 'teleSala' || el.device === 'teleCuarto' || el.device === 'proyectorSala') {
            const screen = screens.find(screen => screen.id === el.device);
            requests.current.updateTableInSupabaseDevices({id: screen.id, table: 'screens', [el.key]: el.value, date: new Date().toISOString()});
          }
        }
      });
    }
  };

  const triggerControl = (params) => {
    if (validateRangeAndCredential) {
      if (!loadingDevices.current) {
        changeControl(params);
      } else {
        setTimeout(() => {
          triggerControl(params);
        }, 1000);
      }
    }
    if (!params.ignoreVibration) {
      triggerVibrate();
    }
  };

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
  };

  const validateRangeAndCredential = () => {
    return inRange || (credential === ownerCredential.current || credential === devCredential.current);
  };

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
  };

  const getRokuData = useCallback(async (apps, firstTime) => {
    let updatesEnabled = !updatesDisabledRef.current;
    if (firstTime) {
      updatesEnabled = true;
    }
    if (userActive.current && updatesEnabled) {
      const devices = {...devicesStateUpdated.current};
      let response = await requests.current.getRokuData('active-app');
      if (response && response.status === 200) {
        let newId = response.data['active-app'].app.id;
        const currentId = apps.find(app => app.state === 'selected').rokuId;
        if (currentId !== newId) {
          requests.current.updateTableInSupabase({id: newId, table: 'rokuApps', date: new Date().toISOString()}, currentId);
        }
      }
      response = await requests.current.getRokuData('media-player');
      if (response && response.status === 200) {
        if (devicesState.rokuSala.state !== response.data.player.state) {
          devices.rokuSala.state = response.data.player.state;
        }
      }
    }
  }, [devicesState.rokuSala.state]);

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

  const getSupabaseChannel = (name) => {
    if (!supabaseChannelsRef.current[name]) {
      console.log(`Creating channel: ${name}`);
      supabaseChannelsRef.current[name] = supabase.channel(name);
    }
    return supabaseChannelsRef.current[name];
  };

  function unsubscribeFromSupabaseChannel(tableName) {
    if (supabaseChannelsRef.current[tableName]) {
      console.log(`Removing channel: ${tableName}`);
      supabaseChannelsRef.current[tableName].unsubscribe();
      delete supabaseChannelsRef.current[tableName];
    }
  }

  const getVisibility = useCallback(() => {
    const handleVisibilityChange = async () => {
      let message = '';
      const currentView = viewRef.current;
      if (document.visibilityState === 'visible') {
        userActive.current = true;
        setUserActive2(true);

        subscribeToSupabaseChannel('hdmiSala');
        const newView = structuredClone(viewRef.current);
        const hdmiTable = await requests.current.getTableFromSupabase('hdmiSala');
        const hdmiId = hdmiTable.data.find(el => el.state === 'selected').id;
        if (hdmiId !== viewRef.current.selected) {
          setHdmiSala(hdmiTable.data);
          newView.selected = hdmiId;
          changeView(newView);
        }

        if (currentView.roku.apps.youtube.channel) {
          const videos = await requests.current.getTableFromSupabase('youtubeVideosLiz');
          setYoutubeVideosLiz(videos.data);
          subscribeToSupabaseChannel('youtubeVideosLiz');
        }
        if (currentView.selected === 'roku' & !currentView.roku.apps.selected) {
          const apps = await requests.current.getTableFromSupabase('rokuApps');
          setRokuApps(apps.data);
          subscribeToSupabaseChannel('rokuApps');
        }
        if (currentView.selected === 'cable') {
          const channels = await requests.current.getTableFromSupabase('cableChannels');
          setCableChannels(channels.data);
          subscribeToSupabaseChannel('cableChannels');
        }
        const devices = await requests.current.getTableFromSupabase('devices');
        setDevices(devices.data);
        subscribeToSupabaseChannelDevices('devices');

        const screens = await requests.current.getTableFromSupabase('screens');
        setScreens(screens.data);
        subscribeToSupabaseChannelDevices('screens');

        message = user.current + ' regreso';
      } else {
        userActive.current = false;
        setUserActive2(false);
        if (supabaseChannelsRef.current['hdmiSala']) {
          unsubscribeFromSupabaseChannel('hdmiSala');
        }
        if (currentView.roku.apps.youtube.channel) {
          if (supabaseChannelsRef.current['youtubeVideosLiz']) {
            unsubscribeFromSupabaseChannel('youtubeVideosLiz');
          }
        }
        if (currentView.selected === 'roku' & !currentView.roku.apps.selected) {
          if (supabaseChannelsRef.current['rokuApps']) {
            unsubscribeFromSupabaseChannel('rokuApps');
          }
        }
        if (currentView.selected === 'cable') {
          if (supabaseChannelsRef.current['cableChannels']) {
            unsubscribeFromSupabaseChannel('cableChannels');
          }
        }
        if (supabaseChannelsRef.current['devices']) {
          unsubscribeFromSupabaseChannel('devices');
        }
        if (supabaseChannelsRef.current['screens']) {
          unsubscribeFromSupabaseChannel('screens');
        }
        message = user.current + ' salio';
      }
      requests.current.sendLogs(message);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, changeView, subscribeToSupabaseChannel]);

  const init = useCallback(async () => {
    let apps = {};
    const localStorageScreen = localStorage.getItem('screen');
    if (localStorageScreen) {
      setScreenSelected(localStorageScreen);
    }
    setCredential(localStorage.getItem('user'));
    const inRange = await utils.current.getInRange();
    setInRange(inRange);

    const newView = structuredClone(viewRef.current);
    const hdmi = await requests.current.getTableFromSupabase('hdmiSala');
    setHdmiSala(hdmi.data);
    subscribeToSupabaseChannel('hdmiSala');
    newView.selected = hdmi.data.find(el => el.state === 'selected').id;
    changeView(newView);

    if (newView.selected === 'cable') {
      const channels = await requests.current.getTableFromSupabase('cableChannels');
      setCableChannels(channels.data);
      subscribeToSupabaseChannel('cableChannels');
    }
    if (newView.selected === 'roku') {
      apps = await requests.current.getTableFromSupabase('rokuApps');
      setRokuApps(apps.data);
      subscribeToSupabaseChannel('rokuApps');
      if (localStorage.getItem('user')) {
        getRokuData(apps.data, true);
      }
    }

    const devices = await requests.current.getTableFromSupabase('devices');
    setDevices(devices.data);
    subscribeToSupabaseChannelDevices('devices');

    const screens = await requests.current.getTableFromSupabase('screens');
    setScreens(screens.data);
    subscribeToSupabaseChannelDevices('screens');

    if (localStorage.getItem('user')) {
      // getMassMediaData(true);
    }
    // setInterval(() => {
    //   if (localStorage.getItem('user')) {
    //     getMassMediaData();
    //     getRokuData(apps.data, false);
    //   }
    // }, 10000);
    setInterval(() => {getPosition();}, 300000);

    requests.current.sendLogs(user.current + ' entro');
    getVisibility();
    if (document.readyState === "complete") {
      document.body.classList.add("loaded");
    } else {
      window.addEventListener("load", document.body.classList.add("loaded"));
    }
    console.log('version 27');
  }, [getMassMediaData, getRokuData, getPosition, getVisibility, changeView, subscribeToSupabaseChannel, user]);

  useEffect(() => {
    if (!initialized.current) {
      init();
    }
    initialized.current = true;
  }, [init]);

  useEffect(() => {
    updatesDisabledRef.current = updatesDisabled;
  }, [updatesDisabled]);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    if (credential === 'dev') {
      setSendDisabled(true);
      setUpdatesDisabled(true);
    }
    if (credential === devCredential.current) {
        eruda.init();
    }
  }, [credential]);

  const resetDevices = async () => {
    await requests.current.setDevices(devicesOriginal);
  };

  const disableIfttt = () => {
    if (sendDisabled === true) {
      setSendDisabled(false);
    } else {
      setSendDisabled(true);
    }
  };

  const disableUpdates = () => {
    if (updatesDisabled === true) {
      setUpdatesDisabled(false);
    } else {
      setUpdatesDisabled(true);
    }
  };

  const removeStorage = () => {
    localStorage.setItem('user', '');
  };

  const changeDev = (name) => {
    const fn = devActions[name];
    if (typeof fn === 'function') {
      fn();
    }
  };

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
            view={view}
            rokuApps={rokuApps}
            youtubeSearchVideos={youtubeSearchVideos}
            youtubeChannelsLiz={youtubeChannelsLiz}
            youtubeVideosLiz={youtubeVideosLiz}
            cableChannels={cableChannels}
            screens={screens}
            cableChannelCategories={cableChannelCategories}
            changeViewParent={changeView}
            changeControlParent={triggerControl}
            triggerVibrateParent={triggerVibrate}
            searchYoutubeParent={searchYoutube}>
          </Controls>
          {devices.length && view.roku.apps.selected === '' &&
          <Devices
            credential={credential}
            ownerCredential={ownerCredential.current}
            devCredential={devCredential.current}
            view={view}
            devicesState={devicesState}
            devices={devices}
            changeViewParent={changeView}
            changeControlParent={triggerControl}>
          </Devices>
          }
          {credential === devCredential.current && !view.roku.apps.selected && !view.cable.channels.category.length && !view.devices.device &&
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
