import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
import eruda from 'eruda';
import supabase from '../../global/supabase-client';
import Screens from './screens/screens';
import Devices from './devices/devices';
import Controls from './controls/controls';
import Credentials from './credentials/credentials';
import Dev from './dev/dev';
import Utils from '../../global/utils';
import Requests from '../../global/requests';
import YoutubeDummyData from '../../global/youtube-dummy-data';
import CableChannelCategories from '../../global/cable-channel-categories';
import './main.css';
import { tab } from '@testing-library/user-event/dist/tab';

const requests = new Requests();
const utils = new Utils();
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
  const supabaseChannelsRef = useRef({});
  const viewRef = useRef(view);
  const rokuAppsRef = useRef(rokuApps);
  const getRokuDataIntervalRef = useRef(null);

  // useMemo variables (computed)


  const searchYoutube = async (text) => {
    const videos = await requests.searchYoutube(text);
    setYoutubeSearchVideos(videos);
    // setYoutubeSearchVideos(youtubeDummyData);
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
            const data = await requests['getTableFromSupabase'](tableName);
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
          const data = await requests['getTableFromSupabase'](tableName);
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
                const videos = await requests.getTableFromSupabase('youtubeVideosLiz');
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
        if (supabaseChannelsRef.current['cableChannels']) {
          unsubscribeFromSupabaseChannel('cableChannels');
        }      
        const apps = await requests.getTableFromSupabase('rokuApps');
        setRokuApps(apps.data);
        subscribeToSupabaseChannel('rokuApps');
      }
    }
    setView(newView);
  }, [youtubeChannelsLiz.length, viewRef, subscribeToSupabaseChannel]);

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
              const video = youtubeVideosLiz.find(video => video.id === el.value);
              const currentVideo = youtubeVideosLiz.find(vid => vid.state === 'selected');
              if (video && currentVideo) {
                requests.updateTableInSupabase({id: video.id, table: 'youtubeVideosLiz', date: new Date().toISOString()}, currentVideo.id);
              }
            }
            if (el.key === 'app') {
              const app = rokuApps.find(app => app.id === el.value);
              const currentApp = rokuApps.find(ap => ap.state === 'selected');
              if (app && currentApp) {
                requests.updateTableInSupabase({id: app.id, table: 'rokuApps', date: new Date().toISOString()}, currentApp.id);
              }
            }
          }
          if (el.device === 'channelsSala') {
            const channel = cableChannels.find(ch => ch.id === el.value);
            const currentChannel = cableChannels.find(ch => ch.state === 'selected');
            if (channel && currentChannel) {
              requests.updateTableInSupabase({id: channel.id, table: 'cableChannels', date: new Date().toISOString()}, currentChannel.id);
            }
          }
          if (el.device === 'hdmiSala') {
            const hdmi = hdmiSala.find(hd => hd.id === el.value);
            const currentHdmi = hdmiSala.find(hd => hd.state === 'selected');
            if (hdmi && currentHdmi) {
              requests.updateTableInSupabase({id: hdmi.id, table: 'hdmiSala', date: new Date().toISOString()}, currentHdmi.id);
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
            const device = devices.find(device => device.id === el.device);
            requests.updateTableInSupabaseDevices({id: device.id, table: 'devices', state: el.value, date: new Date().toISOString()});
          }
          if (el.device === 'teleSala' || el.device === 'teleCuarto' || el.device === 'teleCocina' || el.device === 'proyectorSala') {
            const screen = screens.find(screen => screen.id === el.device);
            requests.updateTableInSupabaseDevices({id: screen.id, table: 'screens', [el.key]: el.value, date: new Date().toISOString()});
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

  const getRokuData = useCallback(async (apps = rokuAppsRef.current) => {
    let update = false;
    let params = {table: 'rokuApps', date: new Date().toISOString()};
    const currentRokuId = apps.find(app => app.state === 'selected').rokuId;
    const currentPlayState = apps.find(app => app.state === 'selected').playState;
    let appId = apps.find(app => app.state === 'selected').id;
    let activeApp = await requests.getRokuData('active-app');
    if (activeApp && activeApp.status === 200) {
      let newRokuId = activeApp.data['active-app'].app.id;
      if (currentRokuId !== newRokuId) {
        appId = apps.find(app => app.rokuId === newRokuId).id;
        update = true;
      }
    }
    let playState = await requests.getRokuData('media-player');
    if (playState && playState.status === 200) {
      let newPlayState = playState.data.player.state;
      if (currentPlayState !== newPlayState) {
        update = true;
        params.playState = newPlayState;
      }
    }
    if (update) {
      requests.updateTableInSupabase(params, appId);
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
        setUserActive(true);

        subscribeToSupabaseChannel('hdmiSala');
        const newView = structuredClone(viewRef.current);
        const hdmiTable = await requests.getTableFromSupabase('hdmiSala');
        const hdmiId = hdmiTable.data.find(el => el.state === 'selected').id;
        if (hdmiId !== viewRef.current.selected) {
          setHdmiSala(hdmiTable.data);
          newView.selected = hdmiId;
          changeView(newView);
        }

        if (currentView.roku.apps.youtube.channel) {
          const videos = await requests.getTableFromSupabase('youtubeVideosLiz');
          setYoutubeVideosLiz(videos.data);
          subscribeToSupabaseChannel('youtubeVideosLiz');
        }
        if (currentView.selected === 'roku' & !currentView.roku.apps.selected) {
          const apps = await requests.getTableFromSupabase('rokuApps');
          setRokuApps(apps.data);
          subscribeToSupabaseChannel('rokuApps');
          getRokuData(apps.data);
        }
        getRokuDataIntervalRef.current = setInterval(() => {
          if (localStorage.getItem('user') && viewRef.current.selected === 'roku') {
            getRokuData();
          }
        }, 10000);
        if (currentView.selected === 'cable') {
          const channels = await requests.getTableFromSupabase('cableChannels');
          setCableChannels(channels.data);
          subscribeToSupabaseChannel('cableChannels');
        }
        const devices = await requests.getTableFromSupabase('devices');
        setDevices(devices.data);
        subscribeToSupabaseChannelDevices('devices');

        const screens = await requests.getTableFromSupabase('screens');
        setScreens(screens.data);
        subscribeToSupabaseChannelDevices('screens');

        setInRange(await utils.getInRange());
        message = user + ' regreso';
      } else {
        setUserActive(false);
        clearInterval(getRokuDataIntervalRef);
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
        message = user + ' salio';
      }
      requests.sendLogs(message);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [changeView, subscribeToSupabaseChannel, getRokuData, subscribeToSupabaseChannelDevices]);

  const init = useCallback(async () => {
    let apps = {};
    const localStorageScreen = localStorage.getItem('screen');
    if (localStorageScreen) {
      setScreenSelected(localStorageScreen);
    }
    setCredential(localStorage.getItem('user'));
    setInRange(await utils.getInRange());

    const newView = structuredClone(viewRef.current);
    const hdmi = await requests.getTableFromSupabase('hdmiSala');
    setHdmiSala(hdmi.data);
    subscribeToSupabaseChannel('hdmiSala');
    newView.selected = hdmi.data.find(el => el.state === 'selected').id;
    changeView(newView);

    if (newView.selected === 'cable') {
      const channels = await requests.getTableFromSupabase('cableChannels');
      setCableChannels(channels.data);
      subscribeToSupabaseChannel('cableChannels');
    }
    if (newView.selected === 'roku') {
      apps = await requests.getTableFromSupabase('rokuApps');
      setRokuApps(apps.data);
      subscribeToSupabaseChannel('rokuApps');
      if (localStorage.getItem('user') && newView.selected === 'roku') {
        getRokuData(apps.data, true);
      }
    }
    getRokuDataIntervalRef.current = setInterval(() => {
      if (localStorage.getItem('user') && viewRef.current.selected === 'roku') {
        getRokuData();
      }
    }, 10000);

    const devices = await requests.getTableFromSupabase('devices');
    setDevices(devices.data);
    subscribeToSupabaseChannelDevices('devices');

    const screens = await requests.getTableFromSupabase('screens');
    setScreens(screens.data);
    subscribeToSupabaseChannelDevices('screens');

    requests.sendLogs(user + ' entro');
    getVisibility();
    if (document.readyState === "complete") {
      document.body.classList.add("loaded");
    } else {
      window.addEventListener("load", document.body.classList.add("loaded"));
    }
    console.log('version 27');
  }, [getRokuData, getVisibility, changeView, subscribeToSupabaseChannel, subscribeToSupabaseChannelDevices]);

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
            devices={devices}
            youtubeSearchVideos={youtubeSearchVideos}
            youtubeChannelsLiz={youtubeChannelsLiz}
            youtubeVideosLiz={youtubeVideosLiz}
            cableChannels={cableChannels}
            screens={screens}
            hdmiSala={hdmiSala}
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
