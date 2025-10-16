import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
import eruda from 'eruda';
import Screens from './screens/screens';
import Devices from './devices/devices';
import Views from './views/views';
import Options from './options/options';
import Notifications from './notifications/notifications';
import Controls from './controls/controls';
import Credentials from './credentials/credentials';
import Dev from './dev/dev';
import Utils from '../../global/utils';
import supabaseChannels from '../../global/supabase/supabase-channels';
import ViewRouter from '../../global/view-router';
import Requests from '../../global/requests';
import Roku from '../../global/roku';
import CordovaPlugins from '../../global/cordova-plugins';
import YoutubeDummyData from '../../global/youtube-dummy-data';
import CableChannelCategories from '../../global/cable-channel-categories';
import './main.css';

const requests = new Requests();
const utils = new Utils();
const viewRouter = new ViewRouter();
const user = utils.getUser(`${window.screen.width}x${window.screen.height}`);
const isApp = window.cordova;

function Main() {

  //useState Variables

  const [rokuPlayState, setRokuPlayState] = useState({});
  const [wifiSsid, setWifiSsid] = useState('');
  const [supabaseTimeOut, setSupabaseTimeOut] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(true);
  const [theme, setTheme] = useState("black");
  const [rokuSearchMode, setRokuSearchMode] = useState('default');
  // const [inRange, setInRange] = useState(false);
  const [userActive, setUserActive] = useState(true);
  const [credential, setCredential] = useState('');
  const [connectedToRoku, setConnectedToRoku] = useState(false);
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
  const testRokuPlayStateIntervalRef = useRef({});

  // useMemo variables (computed)

  const changeTheme = (theme) => {
    setTheme(theme);
    localStorage.setItem('theme', theme);
  };

  const searchYoutube = async (text) => {
    utils.triggerVibrate();
    const videos = await requests.searchYoutube(text);
    if (videos) {
      setYoutubeSearchVideos(videos);
    }
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
    let response = '';
    await supabaseChannels.subscribeToSupabaseChannel(tableName, async (itemName, newItem) => {
      setters[itemName](items => items.map(item => item.id === newItem.id ? newItem : item));
      if (callback) {
        await callback(newItem);
      }
    }).then((res) => {
      if (res.success) {
        response = 'SUBSCRIBED';
        setSupabaseTimeOut(false);
      } else {
        switch (res.msg) {
          case 'TIMED_OUT':
            response = res.msg;
            console.log('not subscribed, subscription status:', res.msg);
            setSupabaseTimeOut(true);
            break;
          case 'CHANNEL_ERROR':
            response = res.msg;
            setSupabaseTimeOut(false);
            break;
          case 'CLOSED':
            response = res.msg;
            setSupabaseTimeOut(false);
            break;
          default:
            setSupabaseTimeOut(false);
        }
      }
    }).catch((res) => {
      response = res.msg;
    });
    return response;
  },[setters]);

  // const unsubscribeFromSupabaseChannel = useCallback(async (tableName) => {
  //   await supabaseChannels.unsubscribeFromSupabaseChannel(tableName);
  // }, []);

  const changeView = useCallback(async (newView) => {
    setView(await viewRouter.changeView(newView, viewRef.current, youtubeChannelsLizRef.current, setters, rokuAppsRef.current));
  }, [viewRef, setters, rokuAppsRef, youtubeChannelsLizRef]);

  const changeControl = useCallback(async (params) => {
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
  }, [cableChannels, devices, hdmiSala, rokuApps, sendEnabled, youtubeVideosLiz]);

  const setCredentials = async (userCredential) => {
    if (userCredential === 'guest') {
      localStorage.setItem('user', userCredential);
      setCredential(userCredential);
      if (isApp) {
        onLoad(userCredential, true);
      } else {
        onLoad(userCredential);
      }
    } else {
      const response = await requests.setCredentials(userCredential);
      if (response.status === 200 && response.data.validUser) {
        if (response.data.dev) {
          localStorage.setItem('user', response.data.dev);
          setCredential('dev');
          setSendEnabled(false);
        } else {
          localStorage.setItem('user', 'owner');
          setCredential('owner');
        }
        if (isApp) {
          onLoad(userCredential, true);
        } else {
          onLoad(userCredential);
        }
      }
    }
  };

  const setData = useCallback(async (tableName, isInit, callback) => {
    let subscriptionResponse = '';
    const table = await requests.getTableFromSupabase(tableName);
    if (table && table.status === 200 && table.data) {
      setters['set' + tableName.charAt(0).toUpperCase() + tableName.slice(1)](table.data);
      if (isInit) {
        subscriptionResponse = await subscribeToSupabaseChannel(tableName, callback);
      }
      return {table, subscriptionResponse};
    } else {
      return {table: null};
    }
  }, [subscribeToSupabaseChannel, setters]);

  const getRokuPlayState = useCallback(async (hdmiSalaParam = hdmiSalaRef.current) => {
    let playState = await Roku.getRokuPlayState(setRokuPlayState);
    if (playState) {
      const currentPlayState = hdmiSalaParam.find(hdmi => hdmi.state === 'selected').playState;
      const newPlayState = playState.state;
      if (currentPlayState !== newPlayState) {
        requests.updateTableInSupabase({
          new: {newId: 'roku', newTable: 'hdmiSala', newPlayState, newDate: new Date().toISOString()}
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

  const getRokuActiveApp = async (ssid) => {
    if (ssid === 'Noky') {
      const rokuActiveApp = await Roku.getRokuActiveApp(setConnectedToRoku);
      if (!testRokuPlayStateIntervalRef.current) {
        testRokuPlayStateIntervalRef.current = setInterval(async () => {
          const playState = await Roku.getRokuPlayState(setRokuPlayState);
          if (playState && playState.state === 'play') {
            console.log('position: ', parseInt(playState.position) / 1000);
          }
        }, 5000);
      }
      return rokuActiveApp;
    } else {
      if (testRokuPlayStateIntervalRef.current) {
        clearInterval(testRokuPlayStateIntervalRef.current);
        testRokuPlayStateIntervalRef.current = null;
      }
      return null;
    }
  };

  const getTableData = useCallback(async (isInit, rokuActiveApp) => {
    let rokuAppsTable = {};
    let cableChannelsTable = {};
    let devicesTable = {};
    let screensTable = {};
    // setInRange(await utils.getInRange());
    const newView = structuredClone(viewRef.current);

    const hdmiSalaTable = await setData('hdmiSala', isInit, async (change) => {
      await hdmiChangeInSupabaseChannel(change.id);
    });
    if (hdmiSalaTable.table) {
      if (hdmiSalaTable.subscriptionResponse === 'SUBSCRIBED') {
        newView.selected = hdmiSalaTable.table.data.find(el => el.state === 'selected').id;

        if (newView.selected === 'roku' && !viewRef.current.roku.apps.selected) {
          rokuAppsTable = await setData('rokuApps', isInit, (change) => {
            // if (change.id === 'home') {
              // setters.setRokuSearchMode('default');
            // } else {
              setters.setRokuSearchMode('roku');
            // }
          });
          if (rokuAppsTable.table) {
            const supabaseAppSelected = rokuAppsTable.table.data.find(row => row.state === 'selected');
            // if (supabaseAppSelected.id !== 'home') {
              setters.setRokuSearchMode('roku');
            // }
            if (rokuActiveApp) {
              if (supabaseAppSelected.rokuId !== rokuActiveApp) {
                const newId = rokuAppsTable.table.data.find(app => app.rokuId === rokuActiveApp).id;
                requests.updateTableInSupabase({
                  current: {currentId: supabaseAppSelected.id, currentTable: 'rokuApps', currentState: ''},
                  new: {newId, newTable: 'rokuApps', newState: 'selected', newDate: new Date().toISOString()}
                });
              }
              await getRokuPlayState(hdmiSalaTable.table.data);
            }
          } else {
            return {};
          }
        }
        if (newView.selected === 'cable') {
          cableChannelsTable = await setData('cableChannels', isInit);
          if (!cableChannelsTable.table) {
            return {};
          }
        }
        devicesTable = await setData('devices', isInit);
        if (!devicesTable.table) {
          return {};
        }
        screensTable = await setData('screens', isInit);
        if (!screensTable.table) {
          return {};
        }
        requests.sendLogs(isInit ? 'entro': 'regreso', user);
        return {hdmiSalaTable: hdmiSalaTable.table, subscriptionResponse: hdmiSalaTable.subscriptionResponse, newView, rokuAppsTable};
      } else {
        return {hdmiSalaTable: hdmiSalaTable.table, subscriptionResponse: hdmiSalaTable.subscriptionResponse};
      }
    } else {
      return {hdmiSalaTable: hdmiSalaTable.table};
    }
  }, [getRokuPlayState, hdmiChangeInSupabaseChannel, setData, setters]);

  const resume = useCallback(async (ssid) => {
    let isInit = false;
    const hdmiSalaChannel = await supabaseChannels.getSupabaseChannelState('hdmiSala');
    if (hdmiSalaChannel.channel) {
      const state = hdmiSalaChannel.channel.state;
      switch (state) {
        case 'joined':
          console.log('hdmiSalaChannel joined on resume');
          break;
        case undefined:
          console.warn('hdmiSalaChannel undefined on resume, subscribing again');
          await supabaseChannels.unsubscribeFromAllSupabaseChannels();
          isInit = true;
          break;
        default:
          console.warn('hdmiSalaChannel ' + state + ' on resume , subscribing again');
          isInit = true;
      }
    } else {
      console.warn('REAL BAD, no hdmiSalaChannel.channel');
    }
    const rokuActiveApp = await getRokuActiveApp(ssid);
    const tableData = await getTableData(isInit, rokuActiveApp);
    if (tableData.newView) {
      await changeView(tableData.newView);
    } else {
      if (tableData.hdmiSalaTable) {
        if (tableData.subscriptionResponse === 'TIMED_OUT') {
        }
      } else {
        console.log('no hdmiSalaTable when resume');
      }
    }
    // setInRange(await utils.getInRange());
  }, [getTableData, changeView]);

  const onPause = useCallback(async (e) => {
    if (credential) {
      document.body.classList.remove("transition");
      setUserActive(false);
      setLoaded(false);
      requests.sendLogs('salio', user);
    } else {
      console.log('no credential when pause');
    }
  }, [credential]);

  const onResume = useCallback(async (e) => {
    if (credential) {
      let ssid = '';
      if (isApp) {
        ssid = await CordovaPlugins.getWifiSSID();
        setWifiSsid(ssid);
        console.log('Current SSID on resume:', ssid);
      }
      await resume(ssid);
      setUserActive(true);
      setLoaded(true);
    } else {
      console.log('no credential when resume');
    }
  }, [resume, credential]);

  const onLoadComplete = useCallback(() => {
    if (document.readyState === 'complete') {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      setLoaded(true);
    } else {
      window.addEventListener('load', async () => {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        setLoaded(true);
      });
    }
  }, []);

  const onSupabaseTimeout = async () => {
    setLoaded(false);
    await resume(wifiSsid);
    setLoaded(true);
  };

  const getTablesAndSetView = useCallback(async (credential, app, rokuActiveApp) => {
    const tableData = await getTableData(true, rokuActiveApp);
    if (tableData.newView) {
      if (tableData.rokuAppsTable.data) {
        await setView(await viewRouter.changeView(tableData.newView, viewRef.current, [], setters, tableData.rokuAppsTable.table.data));
      } else {
        await setView(await viewRouter.changeView(tableData.newView, viewRef.current, [], setters));
      }
      onLoadComplete();
    } else {
      if (tableData.hdmiSalaTable) {
        if (tableData.subscriptionResponse === 'TIMED_OUT') {
          onLoadComplete();
        }
      } else {
        console.warn('no hdmiSalaTable when loading');
      }
    }
  }, [getTableData, onLoadComplete, setters]);

  const onLoad = useCallback(async (credential, app) => {
    let ssid = null;
    let rokuActiveApp = null;
    if (app) {
      ssid = await CordovaPlugins.getPermissions(setWifiSsid, resume);
      rokuActiveApp = await getRokuActiveApp(ssid);
    }
    setTheme(localStorage.getItem('theme'));
    setScreenSelected(localStorage.getItem('screen') || screenSelected);
    await getTablesAndSetView(credential, app, rokuActiveApp);
  }, [screenSelected, resume, getTablesAndSetView]);

  const init = useCallback(async () => {
    const userCredential = localStorage.getItem('user');
    setCredential(userCredential);
    if (userCredential) {
      if (userCredential === 'dev') {
        eruda.init();
      }
      if (isApp) {
        document.addEventListener('deviceready', async () => {
          await onLoad(userCredential, true);
        });
      } else {
        await onLoad(userCredential);
      }
    }
  }, [onLoad, setCredential]);

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
    document.body.classList.add("transition");
    if (loaded) {
      document.body.classList.remove("loaded");
      setTimeout(() => {
        setShow(true);
        document.body.classList.add("loaded");
      }, 250);
    } else {
      document.body.classList.remove("loaded");
      setTimeout(() => {
        setShow(false);
        document.body.classList.add("loaded");
      }, 250);
    }
  }, [loaded]);

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

  const onBack = useCallback((e) => {
    e.preventDefault();
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
          return;
        } else {
          newView.roku.apps.selected = '';
          e.preventDefault();
          changeView(newView);
          return;
        }
      }
    }
    if (viewRef.current.selected === 'cable') {
      if (viewRef.current.cable.channels.category.length) {
        newView.cable.channels.category = [];
        e.preventDefault();
        changeView(newView);
        return;
      }
    }
    if (viewRef.current.devices.device) {
      newView.devices.device = '';
      e.preventDefault();
      changeView(newView);
      return;
    }
    window.navigator.app.exitApp();
  }, [changeView]);

  const onVolumeUp = useCallback((e) => {
    const screen = screensRef.current.find(screen => screen.id === screenSelectedRef.current);
    let newVol = 0;
    newVol = screen.volume + 1;
    changeControl({
      ifttt: [{device: screen.id, key: 'volume', value: 'up' + 1}],
      massMedia: [{device: screen.id, key: 'volume', value: newVol}],
    });
  }, [changeControl, screenSelectedRef, screensRef]);

  const onVolumeDown = useCallback((e) => {
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
  }, [changeControl]);

  const onVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      onResume();
    } else {
      onPause();
    }
  }, [onPause, onResume]); 

  useEffect(() => {
    if (isApp) {
      document.addEventListener("backbutton", onBack);
      document.addEventListener("volumeupbutton", onVolumeUp);
      document.addEventListener("volumedownbutton", onVolumeDown);
      document.addEventListener("pause", onPause);
      document.addEventListener("resume", onResume);
    } else {
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener("popstate", onBack);
    }

    return () => {
      if (isApp) {
        document.removeEventListener("backbutton", onBack);
        document.removeEventListener("volumeupbutton", onVolumeUp);
        document.removeEventListener("volumedownbutton", onVolumeDown);
        document.removeEventListener("pause", onPause);
        document.removeEventListener("resume", onResume);
      } else {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener("popstate", onBack);
      }
    };
  }, [onBack, onVolumeUp, onVolumeDown, onPause, onResume, onVisibilityChange]);

  if (!initializedRef.current) {
    init();
    initializedRef.current = true;
  }

  return (
    <div className={`main fade-in main-${theme}`}>
      {!credential &&
      <Credentials
        setCredentialsParent={setCredentials}>
      </Credentials>
      }
      {credential &&
      <div className='main-components'>
        {(wifiSsid === 'Noky' || (credential === 'owner' || credential === 'dev')) ?
        <div>
          {show ?
            supabaseTimeOut ?
            <Views
              supabaseTimeout={supabaseTimeOut}
              restartParent={onSupabaseTimeout}>
            </Views> : 
            <div className='main-components--loaded'>
              <Notifications
                wifiSsid={wifiSsid}
                connectedToRoku={connectedToRoku}>
              </Notifications>
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
                rokuPlayState={rokuPlayState}
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
              {devices.length && !view.roku.apps.selected && !view.devices.device &&
              <Devices
                credential={credential}
                view={view}
                devices={devices}
                changeViewParent={changeView}
                changeControlParent={changeControl}>
              </Devices>
              }
              {!view.roku.apps.selected && !view.devices.device &&
              <Options
                theme={theme}
                changeThemeParent={changeTheme}>
              </Options>
              }
              {credential === 'dev' &&
              <Dev
                sendEnabled={sendEnabled}
                enableSendParent={enableSend}
                removeStorageParent={removeStorage}>
              </Dev>
              }
            </div>
          : 
          <div className='main-components--loading'>
            <div className="loading-container">
              <span className="loading-text">Cargando</span>
              <div className="loading-dots">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            </div>
          </div>
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
