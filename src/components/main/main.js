import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
import eruda from 'eruda';
import Screens from './screens/screens';
import Devices from './devices/devices';
import Controls from './controls/controls';
import Credentials from './credentials/credentials';
import Dev from './dev/dev';
import Utils from '../../global/utils';
import SupabaseChannels from '../../global/supabase-channels';
import ViewRouter from '../../global/view-router';
import Requests from '../../global/requests';
import YoutubeDummyData from '../../global/youtube-dummy-data';
import CableChannelCategories from '../../global/cable-channel-categories';
import './main.css';

const requests = new Requests();
const utils = new Utils();
const supabaseChannels = new SupabaseChannels();
const viewRouter = new ViewRouter();
const user = utils.getUser(`${window.screen.width}x${window.screen.height}`);

function Main() {

  //useState Variables

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
  const setters = useMemo(() => {return {setYoutubeVideosLiz, setRokuApps, setCableChannels, setHdmiSala, setDevices, setScreens}}, []);

  //useRef Variables
  const initializedRef = useRef(false);
  const viewRef = useRef(view);
  const rokuAppsRef = useRef(rokuApps);
  const hdmiSalaRef = useRef(hdmiSala);
  const getRokuDataIntervalRef = useRef(null);

  // useMemo variables (computed)


  const searchYoutube = async (text) => {
    const videos = await requests.searchYoutube(text);
    setYoutubeSearchVideos(videos);
    // setYoutubeSearchVideos(youtubeDummyData);
  };

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

  const changeView = useCallback(async (params) => {
    const newView = structuredClone(params);

    if (newView.selected === 'cable') {
      // cable selected
      if (viewRef.current.selected === 'cable') {
        // was in cable
        if (newView.cable.channels.category.length) {
          // category selected   
        } else {
        }
      }
      if (viewRef.current.selected === 'roku') {
        // was in roku
        const channels = await requests.getTableFromSupabase('cableChannels');
        setCableChannels(channels.data);
        subscribeToSupabaseChannel('cableChannels');
        if (viewRef.current.roku.apps.selected) {
          // was in an app 
          if (viewRef.current.roku.apps.selected === 'youtube') {
            // app was Youtube
            if (viewRef.current.roku.apps.youtube.channel) {
             unsubscribeFromSupabaseChannel('youtubeVideosLiz');     
            }
          } 
        } else {
          // was in home
          unsubscribeFromSupabaseChannel('rokuApps');             
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
                const videos = await requests.getTableFromSupabase('youtubeVideosLiz');
                setYoutubeVideosLiz(videos.data);
                subscribeToSupabaseChannel('youtubeVideosLiz');
              } else {
                // youtube channel is not selected
                unsubscribeFromSupabaseChannel('youtubeVideosLiz');
              }
            }
          } else {
            // was in home
            unsubscribeFromSupabaseChannel('rokuApps');
            if (newView.roku.apps.selected === 'youtube') {
              // app is Youtube
              if (!youtubeChannelsLiz.length) {
                const channels = await requests.getTableFromSupabase('youtubeChannelsLiz');
                setYoutubeChannelsLiz(channels.data);
              }
            }
          }
        } else {
          // no app selected
          if (viewRef.current.roku.apps.selected) {
            // was in an app
            const apps = await requests.getTableFromSupabase('rokuApps');
            setRokuApps(apps.data);
            subscribeToSupabaseChannel('rokuApps');
          }
        }
      }
      if (viewRef.current.selected === 'cable') {
        //was in cable
        unsubscribeFromSupabaseChannel('cableChannels');
        const apps = await requests.getTableFromSupabase('rokuApps');
        setRokuApps(apps.data);
        subscribeToSupabaseChannel('rokuApps');
      }
    }
    setView(newView);
  }, [youtubeChannelsLiz.length, viewRef, subscribeToSupabaseChannel, unsubscribeFromSupabaseChannel]);

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
            if (el.key === 'video') {
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
          if (el.device === 'luzEscalera' || el.device === 'luzCuarto' || el.device === 'lamparaComedor' || el.device === 'lamparaSala' || el.device === 'lamparaRotatoria' || el.device === 'chimeneaSala' || el.device === 'parlantesSala' || el.device === 'ventiladorSala' || el.device === 'calentadorNegro' || el.device === 'calentadorBlanco' || el.device === 'lamparaTurca') {
            const newId = devices.find(device => device.id === el.device).id;
            requests.updateTableInSupabase({
              new: {newId, newTable: 'devices', ['new' + el.key.charAt(0).toUpperCase() + el.key.slice(1)]: el.value, newDate: new Date().toISOString()}
            });
          }
          if (el.device === 'teleSala' || el.device === 'teleCuarto' || el.device === 'teleCocina' || el.device === 'proyectorSala') {
            const newId = screens.find(screen => screen.id === el.device).id;
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

  const hdmiChangeInSupabseChannel = useCallback(async (id) => {
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
    viewRouter.changeView(newView);
  }, [changeView]);     

  const getVisibility = useCallback(() => {
    const handleVisibilityChange = async () => {
      let message = '';
      const currentView = viewRef.current;
      if (document.visibilityState === 'visible') {
        setUserActive(true);
        subscribeToSupabaseChannel('hdmiSala', (change) => {
          hdmiChangeInSupabseChannel(change.id);
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
          const youtubeVideosLizTable = await requests.getTableFromSupabase('youtubeVideosLiz');
          setYoutubeVideosLiz(youtubeVideosLizTable.data);
          subscribeToSupabaseChannel('youtubeVideosLiz');
        }
        if (currentView.selected === 'roku' & !currentView.roku.apps.selected) {
          const rokuAppsTable = await requests.getTableFromSupabase('rokuApps');
          setRokuApps(rokuAppsTable.data);
          subscribeToSupabaseChannel('rokuApps');
          getRokuData(rokuAppsTable.data, hdmiSalaTable.data);
        }
        getRokuDataIntervalRef.current = setInterval(() => {
          if (localStorage.getItem('user') && viewRef.current.selected === 'roku') {
            getRokuData();
          }
        }, 10000);
        if (currentView.selected === 'cable') {
          const cableChannelsTable = await requests.getTableFromSupabase('cableChannels');
          setCableChannels(cableChannelsTable.data);
          subscribeToSupabaseChannel('cableChannels');
        }
        const devicesTable = await requests.getTableFromSupabase('devices');
        setDevices(devicesTable.data);
        subscribeToSupabaseChannel('devices');

        const screensTable = await requests.getTableFromSupabase('screens');
        setScreens(screensTable.data);
        subscribeToSupabaseChannel('screens');

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
  }, [changeView, subscribeToSupabaseChannel, getRokuData, hdmiChangeInSupabseChannel, unsubscribeFromSupabaseChannel]);  

  const init = useCallback(async () => {
    const localStorageScreen = localStorage.getItem('screen');
    if (localStorageScreen) {
      setScreenSelected(localStorageScreen);
    }
    setCredential(localStorage.getItem('user'));
    setInRange(await utils.getInRange());

    const newView = structuredClone(viewRef.current);
    const hdmiSalaTable = await requests.getTableFromSupabase('hdmiSala');
    setHdmiSala(hdmiSalaTable.data);
    subscribeToSupabaseChannel('hdmiSala', (change) => {
      hdmiChangeInSupabseChannel(change.id);
    });
    newView.selected = hdmiSalaTable.data.find(el => el.state === 'selected').id;
    changeView(newView);

    if (newView.selected === 'cable') {
      const cableChannelsTable = await requests.getTableFromSupabase('cableChannels');
      setCableChannels(cableChannelsTable.data);
      subscribeToSupabaseChannel('cableChannels');
    }
    if (newView.selected === 'roku') {
      const rokuAppsTable = await requests.getTableFromSupabase('rokuApps');
      setRokuApps(rokuAppsTable.data);
      subscribeToSupabaseChannel('rokuApps');
      if (localStorage.getItem('user') && newView.selected === 'roku') {
        getRokuData(rokuAppsTable.data, hdmiSalaTable.data);
      }
    }
    getRokuDataIntervalRef.current = setInterval(() => {
      if (localStorage.getItem('user') && viewRef.current.selected === 'roku') {
        getRokuData();
      }
    }, 10000);

    const devicesTable = await requests.getTableFromSupabase('devices');
    setDevices(devicesTable.data);
    subscribeToSupabaseChannel('devices');

    const screensTable = await requests.getTableFromSupabase('screens');
    setScreens(screensTable.data);
    subscribeToSupabaseChannel('screens');

    requests.sendLogs(user + ' entro');
    getVisibility();
    if (document.readyState === "complete") {
      document.body.classList.add("loaded");
    } else {
      window.addEventListener("load", document.body.classList.add("loaded"));
    }
    console.log('version 27');
  }, [getRokuData, getVisibility, changeView, subscribeToSupabaseChannel, hdmiChangeInSupabseChannel]);

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
    hdmiSalaRef.current = hdmiSala;
  }, [hdmiSala]);

  useEffect(() => {
    if (credential === 'dev') {
      setSendEnabled(false);
      eruda.init();
    }
  }, [credential]);

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
            searchYoutubeParent={searchYoutube}>
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
          {credential === 'dev' && !view.roku.apps.selected && !view.cable.channels.category.length && !view.devices.device &&
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
