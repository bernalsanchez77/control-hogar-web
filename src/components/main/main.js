import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
import eruda from 'eruda';
import Screens from './screens/screens';
import Devices from './devices/devices';
import Controls from './controls/controls';
import Credentials from './credentials/credentials';
import Dev from './dev/dev';
import Utils from '../../global/utils';
import supabaseChannels from '../../global/supabase-channels';
import ViewRouter from '../../global/view-router';
import Requests from '../../global/requests';
import YoutubeDummyData from '../../global/youtube-dummy-data';
import CableChannelCategories from '../../global/cable-channel-categories';
import './main.css';

const requests = new Requests();
const utils = new Utils();
const viewRouter = new ViewRouter();
const user = utils.getUser(`${window.screen.width}x${window.screen.height}`);

function Main() {

  //useState Variables

  const [rokuSearchMode, setRokuSearchMode] = useState('default');
  const [inRange, setInRange] = useState(false);
  const [userActive, setUserActive] = useState(true);
  const [credential, setCredential] = useState('');
  const [sendEnabled, setSendEnabled] = useState(true);
  const [screenSelected, setScreenSelected] = useState('teleSala');
  const [youtubeSearchVideos, setYoutubeSearchVideos] = useState([]);
  const [youtubeVideosLiz, setYoutubeVideosLiz] = useState([]);
  const [youtubeChannelsLiz, setYoutubeChannelsLiz] = useState([]);
  const [cableChannels, setCableChannels] = useState([]);
  const [rokuApps, setRokuApps] = useState([]);
  const [hdmiSala, setHdmiSala] = useState([]);
  const [devices, setDevices] = useState([]);
  const [screens, setScreens] = useState([]);
  const [view, setView] = useState({selected: '', cable: {channels: {category: []}}, roku: {apps: {selected: '', youtube: {mode: '', channel: ''}}}, devices: {device: ''}});

  //normal variables
  const cableChannelCategories = new CableChannelCategories().getCableChannelCategories();
  // eslint-disable-next-line
  const youtubeDummyData = new YoutubeDummyData().getYoutubeDummyData();
  const setters = useMemo(() => {return {setRokuSearchMode, setYoutubeVideosLiz, setYoutubeChannelsLiz, setRokuApps, setCableChannels, setHdmiSala, setDevices, setScreens}}, []);

  //useRef Variables
  const initializedRef = useRef(false);
  const viewRef = useRef(view);
  const rokuAppsRef = useRef(rokuApps);
  const hdmiSalaRef = useRef(hdmiSala);
  const screensRef = useRef(screens);
  const screenSelectedRef = useRef(screenSelected);
  const youtubeChannelsLizRef = useRef(youtubeChannelsLiz);
  const getRokuDataIntervalRef = useRef(null);

  // useMemo variables (computed)


  const searchYoutube = async (text) => {
    utils.triggerVibrate();
    const videos = await requests.searchYoutube(text);
    setYoutubeSearchVideos(videos);
    // setYoutubeSearchVideos(youtubeDummyData);
  };

  const seachRokuMode = (text) => {
    utils.triggerVibrate();
    requests.sendControl(sendEnabled, {
      roku: [{key: 'keypress', value: text, params: ''}]
    });
  }

  const changeRokuSearchMode = (mode) => {
    utils.triggerVibrate();
    setRokuSearchMode(mode);
  }

  const subscribeToSupabaseChannel = useCallback(async (tableName, callback) => {
    supabaseChannels.subscribeToSupabaseChannel(tableName, (itemName, newItem) => {
      setters[itemName](items => items.map(item => item.id === newItem.id ? newItem : item));
      if (callback) {
        callback(newItem);
      }
    });
  },[setters]);

  const unsubscribeFromSupabaseChannel = useCallback((tableName) => {
    supabaseChannels.unsubscribeFromSupabaseChannel(tableName);
  }, []);

  const changeView = useCallback(async (newView) => {
    setView(await viewRouter.changeView(newView, viewRef.current, youtubeChannelsLizRef.current.data, setters, rokuAppsRef.current.data));
  }, [viewRef, setters, rokuAppsRef, youtubeChannelsLizRef]);

  const changeControl = (params) => {
    if (!params.ignoreVibration) {
      utils.triggerVibrate();
    }
    requests.sendControl(sendEnabled, params);
    const media = params.massMedia || params.ifttt || [];
    if (media.length > 0) {
      media.forEach(async el => {
        if (Array.isArray(el.key)) {
          //devices[el.device][el.key[0]] = {...devices[el.device][el.key[0]], [el.key[1]]: el.value};
        } else {
          //devices[el.device] = {...devices[el.device], [el.key]: el.value};
          if (el.device === 'rokuSala') {
            if (el.key === 'video' && viewRef.current.roku.apps.youtube.mode === 'channel') {
              const currentId = youtubeVideosLiz.find(vid => vid.state === 'selected').id;
              const newId = youtubeVideosLiz.find(video => video.id === el.value).id;
              if (currentId && newId) {
                requests.updateTableInSupabase({
                  current: {currentId, currentTable: 'youtubeVideosLiz', currentState: ''},
                  new: {newId, newTable: 'youtubeVideosLiz', newState: 'selected', newDate: new Date().toISOString()}
                });
              }
            }
            if (el.key === 'app') {
              const currentId = rokuApps.find(app => app.state === 'selected').id;
              const newId = rokuApps.find(app => app.id === el.value).id;
              if (currentId && newId) {
                requests.updateTableInSupabase({
                  current: {currentId, currentTable: 'rokuApps', currentState: ''},
                  new: {newId, newTable: 'rokuApps', newState: 'selected', newDate: new Date().toISOString()}
                });
              }
            }
            if (el.key === 'playState') {
              const newId = 'roku';
              requests.updateTableInSupabase({
                new: {newId, newTable: 'hdmiSala', ['new' + el.key.charAt(0).toUpperCase() + el.key.slice(1)]: el.value, newDate: new Date().toISOString()}
              });
            }
          }
          if (el.device === 'channelsSala') {
            const currentId = cableChannels.find(ch => ch.state === 'selected').id;
            const newId = cableChannels.find(ch => ch.id === el.value).id;
            if (currentId && newId) {
              requests.updateTableInSupabase({
                current: {currentId, currentTable: 'cableChannels', currentState: ''},
                new: {newId, newTable: 'cableChannels', newState: 'selected', newDate: new Date().toISOString()}
              });
            }
          }
          if (el.device === 'hdmiSala') {
            const currentId = hdmiSala.find(hdmi => hdmi.state === 'selected').id;
            const newId = hdmiSala.find(hdmi => hdmi.id === el.value).id;
            if (currentId && newId) {
              requests.updateTableInSupabase({
                current: {currentId, currentTable: 'hdmiSala', currentState: ''},
                new: {newId, newTable: 'hdmiSala', newState: 'selected', newDate: new Date().toISOString()}
              });
            }
          }
          if (el.device === 'luzEscalera' || el.device === 'luzCuarto' || el.device === 'lamparaComedor' || el.device === 'lamparaSala' || el.device === 'lamparaRotatoria' || el.device === 'chimeneaSala' || el.device === 'parlantesSala' || el.device === 'ventiladorSala' || el.device === 'calentadorNegro' || el.device === 'calentadorBlanco' || el.device === 'lamparaTurca'|| el.device === 'proyectorSalaSwitch') {
            const newId = devices.find(device => device.id === el.device).id;
            requests.updateTableInSupabase({
              new: {newId, newTable: 'devices', ['new' + el.key.charAt(0).toUpperCase() + el.key.slice(1)]: el.value, newDate: new Date().toISOString()}
            });
          }
          if (el.device === 'teleSala' || el.device === 'teleCuarto' || el.device === 'teleCocina' || el.device === 'proyectorSala') {
            const newId = screensRef.current.find(screen => screen.id === el.device).id;
            requests.updateTableInSupabase({
              new: {newId, newTable: 'screens', ['new' + el.key.charAt(0).toUpperCase() + el.key.slice(1)]: el.value, newDate: new Date().toISOString()}
            });
          }
        }
      });
    }
  };

  const setCredentials = async (userCredential) => {
    if (userCredential === 'guest') {
      localStorage.setItem('user', userCredential);
      setCredential(userCredential);
    } else {
      const response = await requests.setCredentials(userCredential);
      if (response.status === 200 && response.data.validUser) {
        if (response.data.dev) {
          localStorage.setItem('user', response.data.dev);
          setCredential('dev');
        } else {
          localStorage.setItem('user', 'owner');
          setCredential('owner');
        }
      }
    }
  };

  const setData = useCallback(async (tableName, callback) => {
    const table = await requests.getTableFromSupabase(tableName);
    setters['set' + tableName.charAt(0).toUpperCase() + tableName.slice(1)](table.data);
    subscribeToSupabaseChannel(tableName, callback);
    return table;
  }, [subscribeToSupabaseChannel, setters]);

  const getRokuData = useCallback(async (rokuAppsParam = rokuAppsRef.current, hdmiSalaParam = hdmiSalaRef.current) => {
    let activeApp = await requests.getRokuData('active-app');
    if (activeApp && activeApp.status === 200) {
      const currentApp = rokuAppsParam.find(app => app.state === 'selected');
      const currentId = currentApp.id;
      const currentRokuId = currentApp.rokuId;
      const newRokuId = activeApp.data['active-app'].app.id;
      if (currentRokuId !== newRokuId) {
        const newId = rokuAppsParam.find(app => app.rokuId === newRokuId).id;
        requests.updateTableInSupabase({
          current: {currentId, currentTable: 'rokuApps', currentState: ''},
          new: {newId, newTable: 'rokuApps', newState: 'selected', newDate: new Date().toISOString()}
        });
      }
    }
    let playState = await requests.getRokuData('media-player');
    if (playState && playState.status === 200) {
      const currentPlayState = hdmiSalaParam.find(hdmi => hdmi.state === 'selected').playState;
      const newPlayState = playState.data.player.state;
      if (currentPlayState !== newPlayState) {
        const newId = 'roku';
        requests.updateTableInSupabase({
          new: {newId, newTable: 'hdmiSala', newPlayState, newDate: new Date().toISOString()}
        });
      }
    }
  }, []);

  const hdmiChangeInSupabaseChannel = useCallback(async (id) => {
    if (viewRef.current.selected !== id) {
      const newView = structuredClone(viewRef.current);
      newView.selected = id;
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
  }, [changeView]);

  const getVisibility = useCallback(() => {
    const handleVisibilityChange = async () => {
      let message = '';
      const currentView = viewRef.current;
      if (document.visibilityState === 'visible') {
        setUserActive(true);
        subscribeToSupabaseChannel('hdmiSala', (change) => {
          hdmiChangeInSupabaseChannel(change.id);
        });
        const newView = structuredClone(viewRef.current);
        const hdmiSalaTable = await requests.getTableFromSupabase('hdmiSala');
        const hdmiId = hdmiSalaTable.data.find(el => el.state === 'selected').id;
        if (hdmiId !== viewRef.current.selected) {
          setHdmiSala(hdmiSalaTable.data);
          newView.selected = hdmiId;
          changeView(newView);
        }
        if (hdmiSalaTable.playState !== hdmiSalaRef.current.playState) {
          setHdmiSala(hdmiSalaTable.data);
        }
        if (currentView.roku.apps.youtube.channel) {
          await setData('youtubeVideosLiz');
        }
        if (currentView.selected === 'roku' & !currentView.roku.apps.selected) {
          const rokuAppsTable = await setData('rokuApps');
          getRokuData(rokuAppsTable.data, hdmiSalaTable.data);
        }
        getRokuDataIntervalRef.current = setInterval(() => {
          if (localStorage.getItem('user') && viewRef.current.selected === 'roku') {
            getRokuData();
          }
        }, 10000);
        if (currentView.selected === 'cable') {
          await setData('cableChannels');
        }
        await setData('devices');
        await setData('screens');

        setInRange(await utils.getInRange());
        message = user + ' regreso';
      } else {
        setUserActive(false);
        clearInterval(getRokuDataIntervalRef);
        unsubscribeFromSupabaseChannel('hdmiSala');
        if (currentView.roku.apps.youtube.channel) {
          unsubscribeFromSupabaseChannel('youtubeVideosLiz');
        }
        if (currentView.selected === 'roku' & !currentView.roku.apps.selected) {
          unsubscribeFromSupabaseChannel('rokuApps');
        }
        if (currentView.selected === 'cable') {
          unsubscribeFromSupabaseChannel('cableChannels');
        }
        unsubscribeFromSupabaseChannel('devices');
        unsubscribeFromSupabaseChannel('screens');
        message = user + ' salio';
      }
      requests.sendLogs(message);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setData, changeView, subscribeToSupabaseChannel, getRokuData, hdmiChangeInSupabaseChannel, unsubscribeFromSupabaseChannel]);  

  const handleBack = useCallback((e) => {
    console.log('back triggered');
    const newView = structuredClone(viewRef.current);
    if (viewRef.current.selected === 'roku') {
      if (viewRef.current.roku.apps.selected) {
        if (viewRef.current.roku.apps.youtube.mode === 'channel' || viewRef.current.roku.apps.youtube.mode === 'search') {
          newView.roku.apps.youtube.mode = '';
          if (viewRef.current.roku.apps.youtube.channel !== '') {
            newView.roku.apps.youtube.channel = '';
          }
          e.preventDefault();
          changeView(newView);
        } else {
          newView.roku.apps.selected = '';
          e.preventDefault();
          changeView(newView);
        }
      }
    }
    if (viewRef.current.selected === 'cable') {
      if (viewRef.current.cable.channels.category.length) {
        newView.cable.channels.category = [];
        e.preventDefault();
        changeView(newView);
      }
    }
    if (viewRef.current.devices.device) {
      newView.devices.device = '';
      e.preventDefault();
      changeView(newView);
    }
  }, [changeView]);

  const handleVolumeUpButton = useCallback((e) => {
    console.log('volume up triggered');
    const screen = screensRef.current.find(screen => screen.id === screenSelectedRef.current);
    let newVol = 0;
    newVol = screen.volume + 1;
    changeControl({
      ifttt: [{device: screen.id, key: 'volume', value: 'up' + 1}],
      massMedia: [{device: screen.id, key: 'volume', value: newVol}],
    });
  }, [changeControl, screenSelectedRef, screensRef]);

  const handleVolumeDownButton = useCallback((e) => {
    console.log('volume down triggered');
    const screen = screensRef.current.find(screen => screen.id === screenSelectedRef.current);
    let newVol = 0;
    if (screen.volume !== 0) {
      if (screen.volume - 1 >= 0) {
        newVol = screen.volume - 1;
        changeControl({
          ifttt: [{device: screen.id, key: 'volume', value: 'down' + 1}],
          massMedia: [{device: screen.id, key: 'volume', value: newVol}],
        });
      } else {
        newVol = screen.volume - 1;
        changeControl({
          ifttt: [{device: screen.id, key: 'volume', value: 'down' + 1}],
          massMedia: [{device: screen.id, key: 'volume', value: '0'}],
        });
      }
    } else {
      changeControl({ifttt: [{device: screen.id, key: 'volume', value: 'down' + 1}], massMedia: []}); 
    }
  }, []);

  const onLoad = () => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    document.body.classList.add("loaded");
  };

  const init = useCallback(async () => {
    let rokuAppsTable = {};
    let hdmiSalaTable = {};
    const localStorageScreen = localStorage.getItem('screen');
    if (localStorageScreen) {
      setScreenSelected(localStorageScreen);
    }
    setCredential(localStorage.getItem('user'));
    setInRange(await utils.getInRange());

    const newView = structuredClone(viewRef.current);
    hdmiSalaTable = await setData('hdmiSala', (change) => {
      hdmiChangeInSupabaseChannel(change.id);
    });
    newView.selected = hdmiSalaTable.data.find(el => el.state === 'selected').id;

    if (newView.selected === 'cable') {
      await setData('cableChannels');
    }

    if (newView.selected === 'roku') {
      rokuAppsTable = await setData('rokuApps');
      if (rokuAppsTable.data.find(row => row.state === 'selected').id !== 'home') {
        setters.setRokuSearchMode('roku');
      }
      if (localStorage.getItem('user') && newView.selected === 'roku') {
        getRokuData(rokuAppsTable.data, hdmiSalaTable.data);
      }
    }
    setView(await viewRouter.changeView(newView, viewRef.current, [], setters, rokuAppsTable.data));
    getRokuDataIntervalRef.current = setInterval(() => {
      if (localStorage.getItem('user') && viewRef.current.selected === 'roku') {
        getRokuData();
      }
    }, 10000);

    await setData('devices');
    await setData('screens');

    requests.sendLogs(user + ' entro');
    getVisibility();
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
    console.log('version 27');
  }, [setData, setters, getRokuData, getVisibility, hdmiChangeInSupabaseChannel]);

  useEffect(() => {
    if (!initializedRef.current) {
      init();
    }
    initializedRef.current = true;
  }, [init]);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    rokuAppsRef.current = rokuApps;
  }, [rokuApps]);

  useEffect(() => {
    screensRef.current = screens;
  }, [screens]);

  useEffect(() => {
    hdmiSalaRef.current = hdmiSala;
  }, [hdmiSala]);

  useEffect(() => {
    screenSelectedRef.current = screenSelected;
  }, [screenSelected]);

  useEffect(() => {
    youtubeChannelsLizRef.current = youtubeChannelsLiz;
  }, [youtubeChannelsLiz]);

  useEffect(() => {
    if (credential === 'dev') {
      setSendEnabled(false);
      eruda.init();
    }
  }, [credential]);

  useEffect(() => {
    document.addEventListener("backbutton", handleBack, false);
    return () => {
      // cleanup
      document.removeEventListener("backbutton", handleBack, false);
    };
  }, [handleBack]);

  useEffect(() => {
    document.addEventListener("volumeupbutton", handleVolumeUpButton, false);
    return () => {
      // cleanup
      document.removeEventListener("volumeupbutton", handleVolumeUpButton, false);
    };
  }, [handleVolumeUpButton]);

  useEffect(() => {
    document.addEventListener("volumedownbutton", handleVolumeDownButton, false);
    return () => {
      // cleanup
      document.removeEventListener("volumedownbutton", handleVolumeDownButton, false);
    };
  }, [handleVolumeDownButton]);

  useEffect(() => {
    window.addEventListener("popstate", handleBack, false);
    return () => {
      // cleanup
      window.removeEventListener("popstate", handleBack, false);
    };
  }, [handleBack, changeView, viewRef]);

  const enableSend = () => {
    if (sendEnabled === true) {
      setSendEnabled(false);
    } else {
      setSendEnabled(true);
    }
  };

  const removeStorage = () => {
    localStorage.setItem('user', '');
  };

  const changeScreen = (screen) => {
    utils.triggerVibrate();
    setScreenSelected(screen);
    localStorage.setItem('screen', screen);
  };

  return (
    <div className="main fade-in">
      {!credential &&
      <Credentials
        setCredentialsParent={setCredentials}>
      </Credentials>
      }
      {credential &&
      <div className='main-components'>
        {(inRange || (credential === 'owner' || credential === 'dev')) ?
        <div>
          {screens.length &&
          <Screens
            credential={credential}
            screenSelected={screenSelected}
            screens={screens}
            userActive={userActive}
            changeScreenParent={changeScreen}>
          </Screens>
          }
          <Controls
            screenSelected={screenSelected}
            view={view}
            rokuSearchMode={rokuSearchMode}
            rokuApps={rokuApps}
            hdmiSala={hdmiSala}
            devices={devices}
            youtubeSearchVideos={youtubeSearchVideos}
            youtubeChannelsLiz={youtubeChannelsLiz}
            youtubeVideosLiz={youtubeVideosLiz}
            cableChannels={cableChannels}
            screens={screens}
            cableChannelCategories={cableChannelCategories}
            changeViewParent={changeView}
            changeControlParent={changeControl}
            triggerVibrateParent={utils.triggerVibrate}
            searchYoutubeParent={searchYoutube}
            searchRokuModeParent={seachRokuMode}
            changeRokuSearchModeParent={changeRokuSearchMode}>
          </Controls>
          {devices.length && view.roku.apps.selected === '' &&
          <Devices
            credential={credential}
            view={view}
            devices={devices}
            changeViewParent={changeView}
            changeControlParent={changeControl}>
          </Devices>
          }
          {credential === 'dev' &&
          <Dev
            sendEnabled={sendEnabled}
            enableSendParent={enableSend}
            removeStorageParent={removeStorage}>
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
