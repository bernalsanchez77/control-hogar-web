import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
import eruda from 'eruda';
import Screens from './screens/screens';
import Devices from './devices/devices';
import Views from './views/views';
import Options from './options/options';
import Notifications from './notifications/notifications';
import Controls from './controls/controls';
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
  const [networkType, setNetworkType] = useState('');
  const [supabaseTimeOut, setSupabaseTimeOut] = useState(false);
  const [internet, setInternet] = useState(true);
  const [loading, setLoading] = useState(true);
  const [restricted, setRestricted] = useState(false);
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
  const [rokuPlayStatePosition, setRokuPlayStatePosition] = useState(0);
  const [view, setView] = useState({selected: '', cable: {channels: {category: []}}, roku: {apps: {selected: '', youtube: {mode: '', channel: ''}}}, devices: {device: ''}});

  //normal variables
  const cableChannelCategories = new CableChannelCategories().getCableChannelCategories();

  //function variables
  let onNoInternet = null;

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
  const internetIntervalRef = useRef({});
  const applicationRunningRef = useRef(false);
  const wifiSsidRef = useRef('');
  const networkTypeRef = useRef('');
  const credentialRef = useRef('');
  const netChangeRunningRef = useRef(false);
  const rokuPLayStateListeningRef = useRef(false);

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
    }, onNoInternet, true).then((res) => {
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
  },[setters, onNoInternet]);

  const changeView = useCallback(async (newView) => {
    setView(await viewRouter.changeView(newView, viewRef.current, youtubeChannelsLizRef.current, setters, rokuAppsRef.current));
  }, [viewRef, setters, rokuAppsRef, youtubeChannelsLizRef]);

  const modifyTableInSupabase = (table, tableName, el) => {
    const currentId = table.find(v => v.state === 'selected').id;
    const newId = table.find(v => v.id === el.value).id;
    if (currentId && newId) {
      requests.updateTableInSupabase({
        current: {currentId, currentTable: tableName, currentState: ''},
        new: {newId, newTable: tableName, newState: 'selected', newDate: new Date().toISOString()}
      });
    }
  }

  const updateTableInSupabase = (newTable, tableName, el, id) => {
    const newId = id || newTable.find(v => v.id === el.device).id;
    requests.updateTableInSupabase({
      new: {newId, newTable: tableName, ['new' + el.key.charAt(0).toUpperCase() + el.key.slice(1)]: el.value, newDate: new Date().toISOString()}
    });
  }

  const addToYoutubeQueue = (newId, number) => {
    requests.updateTableInSupabase({
      new: {newId, newTable: 'youtubeVideosLiz', newQueue: number, newDate: new Date().toISOString()}
    });
  }

  const changeControl = useCallback(async (params, obj) => {
    if (!params.ignoreVibration) {
      utils.triggerVibrate();
    }
    requests.sendControl(sendEnabled, params);
    const media = params.massMedia || params.ifttt || [];
    if (media.length > 0) {
      media.forEach(async el => {
        if (Array.isArray(el.key)) {
        } else {
          if (el.device === 'rokuSala') {
            if (el.key === 'video' && viewRef.current.roku.apps.youtube.mode === 'channel') {
              // modifyTableInSupabase(youtubeVideosLiz, 'youtubeVideosLiz', el);
              // if (isApp && wifiSsidRef === 'Noky' && rokuPLayStateListeningRef.current) {
              if (!rokuPLayStateListeningRef.current) {
                rokuPLayStateListeningRef.current = true;
                Roku.startPlayStateListener(setRokuPlayState, setRokuPlayStatePosition);
              }
            }
            if (el.key === 'app') {
              modifyTableInSupabase(rokuApps, 'rokuApps', el);
            }
            if (el.key === 'playState') {
              updateTableInSupabase(hdmiSala, 'hdmiSala', el, 'roku');
            }
          }
          if (el.device === 'channelsSala') {
            modifyTableInSupabase(cableChannels, 'cableChannels', el);
          }
          if (el.device === 'hdmiSala') {
            modifyTableInSupabase(hdmiSala, 'hdmiSala', el);
          }
          if (el.device === 'luzEscalera' || el.device === 'luzCuarto' || el.device === 'lamparaComedor' || el.device === 'lamparaSala' || el.device === 'lamparaRotatoria' || el.device === 'chimeneaSala' || el.device === 'parlantesSala' || el.device === 'ventiladorSala' || el.device === 'calentadorNegro' || el.device === 'calentadorBlanco' || el.device === 'lamparaTurca'|| el.device === 'proyectorSalaSwitch') {
            updateTableInSupabase(devices, 'devices', el);
          }
          if (el.device === 'teleSala' || el.device === 'teleCuarto' || el.device === 'teleCocina' || el.device === 'proyectorSala') {
            updateTableInSupabase(screens, 'screens', el, screensRef.current.find(screen => screen.id === el.device).id);
          }
        }
      });
    }
  }, [sendEnabled, youtubeVideosLiz, cableChannels, devices, hdmiSala, rokuApps, screens]);

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
              await Roku.updatePlayState(setRokuPlayState, hdmiSalaTable.table.data.find(hdmi => hdmi.state === 'selected').playState);
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
  }, [hdmiChangeInSupabaseChannel, setData, setters]);

  const load = useCallback(async (ssid, netType) => {
    setLoading(true);
    ssid = ssid || wifiSsid;
    netType = netType || networkType;
    let rokuActiveApp = null;
    if (isApp) {
      if (ssid === 'Noky') {
        rokuActiveApp = await Roku.getActiveApp(setConnectedToRoku);
      }
    }
    const tableData = await getTableData(true, rokuActiveApp);
    if (tableData.newView) {
      if (tableData.rokuAppsTable.data) {
        await setView(await viewRouter.changeView(tableData.newView, viewRef.current, [], setters, tableData.rokuAppsTable.table.data));
      } else {
        await setView(await viewRouter.changeView(tableData.newView, viewRef.current, [], setters));
      }
    } else {
      if (tableData.hdmiSalaTable) {
        if (tableData.subscriptionResponse === 'TIMED_OUT') {
        }
      } else {
        console.warn('no hdmiSalaTable when loading');
      }
    }
    setLoading(false);
    applicationRunningRef.current = true;
  }, [getTableData, setters, wifiSsid, networkType]);

  // event functions

  onNoInternet = useCallback(() => {
    console.log('internet interval started');
    let ssid = '';
    let netType = '';
    let userRestricted = '';
    let userCredential = localStorage.getItem('user');
    setInternet(false);
    internetIntervalRef.current = setInterval(async () => {
      const internetConnection = await utils.checkInternet();
      if (internetConnection) {
        console.log('Internet connected by interval');
        clearInterval(internetIntervalRef.current);
        internetIntervalRef.current = null;

        if (isApp) {
          ssid = await CordovaPlugins.getWifiSSID();
          netType = await CordovaPlugins.getNetworkType();
          userRestricted = utils.getUserRestricted({ssid, userCredential});
        }

        if (userCredential && !userRestricted) {
          await load(ssid, netType);
        }
        setRestricted(userRestricted);
        setWifiSsid(ssid);
        setNetworkType(netType);
        setInternet(true);
      } else {
        console.log('No internet by interval');
      }
    }, 5000);
  }, [load]);

  const onSSidChange = useCallback((ssid) => {
    console.log('changed in ssid: ', ssid);
    if (credentialRef.current === 'guest') {
      if (ssid === 'Noky' && networkTypeRef.current === 'wifi') {
        setRestricted(false);
        if (!applicationRunningRef.current && !netChangeRunningRef.current) {
          netChangeRunningRef.current = true;
          setTimeout(async () => {
            const internetConnection = await utils.checkInternet();
            if (internetConnection) {
              await load();
            } else {
              console.log('no internet detected by ssid change, nointernet interval started');
              onNoInternet();
            }
            netChangeRunningRef.current = false;
          }, 5000);
        }
      } else {
        setRestricted(true);
      }
    }
    setWifiSsid(ssid);
  }, [credentialRef, networkTypeRef, load, onNoInternet]);

  const onNetworkTypeChange = useCallback((netType) => {
    console.log('changed in network type: ', netType);
    if (credentialRef.current === 'guest') {
      if (netType === 'wifi' && wifiSsidRef.current === 'Noky') {
        setRestricted(false);
        if (!applicationRunningRef.current && !netChangeRunningRef.current) {
          netChangeRunningRef.current = true;
          setTimeout(async () => {
            const internetConnection = await utils.checkInternet();
            if (internetConnection) {
              await load();
            } else {
              console.log('no internet detected by network type change, nointernet interval started');
              onNoInternet();
            }
            netChangeRunningRef.current = false;
          }, 5000);
        }
      } else {
        setRestricted(true);
      }
    }
    setNetworkType(netType);
  }, [credentialRef, wifiSsidRef, load, onNoInternet]);

  const onResume = useCallback(async (e) => {
    if (applicationRunningRef.current) {
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
            await load();
            break;
          default:
            console.warn('hdmiSalaChannel ' + state + ' on resume , subscribing again');
            await supabaseChannels.unsubscribeFromAllSupabaseChannels();
            await load();
        }
      } else {
        console.warn('REAL BAD, no hdmiSalaChannel.channel');
      }
    }
    setUserActive(true);
  }, [load]);

  const onPause = useCallback(async (e) => {
    document.body.classList.remove("transition");
    setUserActive(false);
    if (internet) {
      requests.sendLogs('salio', user);
    }
  }, [internet]);

  const onEnableSend = () => {
    if (sendEnabled === true) {
      setSendEnabled(false);
    } else {
      setSendEnabled(true);
    }
  };

  const onRemoveStorage = () => {
    localStorage.setItem('user', '');
  };

  const onScreenChanged = (screen) => {
    utils.triggerVibrate();
    setScreenSelected(screen);
    localStorage.setItem('screen', screen);
  };

  const onSupabaseTimeout = async () => {
    await onResume();
  };

  const onNavigationBack = useCallback((e) => {
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
  }, [changeControl, screensRef]);

  const onVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      onResume();
    } else {
      onPause();
    }
  }, [onPause, onResume]);

  const onSetCredentials = async (userCredential) => {
    const internetConnection = await utils.checkInternet();
    if (internetConnection) {
      let user = '';
      if (userCredential === 'guest') {
        localStorage.setItem('user', userCredential);
        if (utils.getUserRestricted({wifiSsid, userCredential})) {
          setRestricted(true);
        } else {
          await load();
        }
        user = userCredential;
      } else {
        const response = await requests.setCredentials(userCredential);
        if (response.status === 200 && response.data.validUser) {
          if (response.data.dev) {
            localStorage.setItem('user', response.data.dev);
            user = 'dev';
            setSendEnabled(false);
          } else {
            localStorage.setItem('user', 'owner');
            user = 'owner';
          }
          await load();
        }
      }
      setCredential(user);
    }
  };

  const viewsFunctionMap = {onSetCredentials, onSupabaseTimeout};

  const onViewsEvents = (fn, params) => {
    viewsFunctionMap[fn](params);
  };

  // init

  const init = useCallback(async () => {
    const internetConnection = await utils.checkInternet();
    const userCredential = localStorage.getItem('user');
    let ssid = '';
    let netType = '';
    let userRestricted = '';
    if (isApp) {
      await CordovaPlugins.getPermissions();
      ssid = await CordovaPlugins.getWifiSSID();
      netType = await CordovaPlugins.getNetworkType();
      await CordovaPlugins.startSsidListener(onSSidChange);
      await CordovaPlugins.startNetworkTypeListener(onNetworkTypeChange);
      userRestricted = utils.getUserRestricted({ssid, userCredential});
    } else {
    }
    if (internetConnection) {
      if (userCredential) {
        if (userRestricted) {
          setLoading(false);
        } else {
          await load(ssid, netType);
        }
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    if (document.readyState === 'complete') {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      window.addEventListener('load', async () => {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      });
    }

    setTheme(localStorage.getItem('theme'));
    setScreenSelected(localStorage.getItem('screen') || screenSelected);
    setRestricted(userRestricted);
    setWifiSsid(ssid);
    setNetworkType(netType);
    setCredential(userCredential);
    setInternet(internetConnection);
  }, [onNetworkTypeChange, onSSidChange, load, screenSelected]);

  // useEffects

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
    networkTypeRef.current = networkType;
  }, [networkType]);

  useEffect(() => {
    wifiSsidRef.current = wifiSsid;
  }, [wifiSsid]);

  useEffect(() => {
    credentialRef.current = credential;
  }, [credential]);

  useEffect(() => {
    // document.body.classList.add("transition");
    // if (loaded) {
    //   document.body.classList.remove("loaded");
    //   setTimeout(() => {
    //     document.body.classList.add("loaded");
    //   }, 2500);
    // } else {
    //   document.body.classList.remove("loaded");
    //   setTimeout(() => {
    //     document.body.classList.add("loaded");
    //   }, 2500);
    // }
  }, []);

  useEffect(() => {
    if (isApp) {
      document.addEventListener("backbutton", onNavigationBack);
      document.addEventListener("volumeupbutton", onVolumeUp);
      document.addEventListener("volumedownbutton", onVolumeDown);
      document.addEventListener("pause", onPause);
      document.addEventListener("resume", onResume);
    } else {
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener("popstate", onNavigationBack);
    }

    return () => {
      if (isApp) {
        document.removeEventListener("backbutton", onNavigationBack);
        document.removeEventListener("volumeupbutton", onVolumeUp);
        document.removeEventListener("volumedownbutton", onVolumeDown);
        document.removeEventListener("pause", onPause);
        document.removeEventListener("resume", onResume);
      } else {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener("popstate", onNavigationBack);
      }
    };
  }, [onNavigationBack, onVolumeUp, onVolumeDown, onPause, onResume, onVisibilityChange]);

  if (!initializedRef.current) {
    eruda.init();
    if (isApp) {
      document.addEventListener('deviceready', async () => {
        init();
      });
    } else {
      init();
    }
    initializedRef.current = true;
  }

  return (
    <div className={`main fade-in main-${theme}`}>
      {!loading && internet && !restricted && credential && !supabaseTimeOut ?
      <div className='main-components'>
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
              changeScreenParent={onScreenChanged}>
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
              rokuPlayStatePosition={rokuPlayStatePosition}
              changeViewParent={changeView}
              changeControlParent={changeControl}
              triggerVibrateParent={utils.triggerVibrate}
              searchYoutubeParent={searchYoutube}
              searchRokuModeParent={seachRokuMode}
              addToYoutubeQueueParent={addToYoutubeQueue}
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
              enableSendParent={onEnableSend}
              removeStorageParent={onRemoveStorage}>
            </Dev>
            }

      </div> :
      <Views
        loading={loading}
        internet={internet}
        restricted={restricted}
        credential={credential}
        supabaseTimeout={supabaseTimeOut}
        restartParent={onViewsEvents}>
      </Views>
      }
    </div>
  );
}

export default Main;
