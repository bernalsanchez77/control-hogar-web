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
  const [view, setView] = useState(
    {
      selected: '',
      cable: {channels: {category: []}},
      roku: {apps: {selected: '', youtube: {mode: '', channel: ''}}},
      devices: {device: ''},
    }
  );

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
  //const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const initialized = useRef(false);
  const youtubeVideosLizSupabaseChannel = useRef(null);

  const triggerVibrate = (length = 100) => {
    if (navigator.vibrate) {
      navigator.vibrate([length]);
    }
  }

  const searchYoutube = async (text) => {
    const videos = await requests.current.searchYoutube(text);
    setYoutubeSearchVideos(videos);
    // setYoutubeSearchVideos(youtubeDummyData.current.getYoutubeDummyData());
  }

  const changeView = useCallback(async (params, updateDb = true) => {
    triggerVibrate();
    const newView = structuredClone(params);

    if (newView.selected === 'cable') {
      // cable selected
      if (view.selected === 'cable') {
        // was in cable
        if (newView.cable.channels.category.length) {
          // category selected
          const channels = await requests.current.getCableChannels();
          setCableChannels(channels.data);       
        } else {
          
        }

      }
      if (view.selected === 'roku') {
        // was not in cable
        
      }
    }

    if (newView.selected === 'roku') {
      // roku selected
      if (view.selected === 'roku') {
        // was in roku
        if (newView.roku.apps.selected) {
          // app is selected
          if (view.roku.apps.selected) {
            // was in an app
            if (newView.roku.apps.selected === 'youtube') {
              // app is Youtube
              if (newView.roku.apps.youtube.channel) {
                // youtube channel selected
                const videos = await requests.current.getYoutubeVideosLiz();
                setYoutubeVideosLiz(videos.data);
                subscribeToYoutubeVideosLizSupabaseChannel();
              } else {
                // youtube channel is not selected
                if (youtubeVideosLizSupabaseChannel.current) {
                  unSubscribeFromYoutubeVideosLizSupabaseChannel();
                }
              }
            }
          } else {
            // was not in an app
            if (newView.roku.apps.selected === 'youtube') {
              // app is Youtube
              if (!youtubeChannelsLiz.length) {
                const channels = await requests.current.getYoutubeChannelsLiz();
                setYoutubeChannelsLiz(channels.data);
              }
            }
          }
        } else {
          // no app selected
          if (view.roku.apps.selected) {
            // was in an app
            const apps = await requests.current.getRokuApps(); // brings apps cause another user might have changed the app selected in Roku
            setRokuApps(apps.data);
          }
        }
      }
      // different hdmi
      if (view.selected === 'cable') {
        //was not in roku

      }
    }



    // if (newView.selected === 'cable' && view.selected === 'roku' && newView.roku.apps.youtube.channel) {
    //   if (youtubeVideosLizSupabaseChannel.current) {
    //     unSubscribeFromYoutubeVideosLizSupabaseChannel();
    //   }
    // }




    // if (view.selected === 'cable') {
    //   if (youtubeVideosLizSupabaseChannel.current) {
    //     unSubscribeFromYoutubeVideosLizSupabaseChannel();
    //   }
    //   if (updateDb) {
    //     const channels = await requests.current.getCableChannels();
    //     setCableChannels(channels.data);
    //   }
    // }
    // if (!newView.roku.apps.selected && view.selected === 'roku') {
    //   if (youtubeVideosLizSupabaseChannel.current) {
    //     unSubscribeFromYoutubeVideosLizSupabaseChannel();
    //   }
    //   if (updateDb) {
    //     const apps = await requests.current.getRokuApps();
    //     setRokuApps(apps.data);
    //   }
    // }
    setView(newView);
  }, [youtubeChannelsLiz.length, view]);


  const changeControl = (params) => {
    requests.current.sendControl(sendDisabled, params);
    const media = params.massMedia || params.ifttt || [];
    if (media.length > 0) {
      const devices = {...devicesStateUpdated.current};
      media.forEach(async el => {
        if (Array.isArray(el.key)) {
          devices[el.device][el.key[0]] = {...devices[el.device][el.key[0]], [el.key[1]]: el.value};
        } else {
          devices[el.device] = {...devices[el.device], [el.key]: el.value};
          if (el.key === 'video') {
            const video = youtubeVideosLiz.find(video => video.id === el.value);
            const currentVideo = youtubeVideosLiz.find(vid => vid.state === 'selected');
            if (video) {
              video.videoDate = new Date().toISOString();
              requests.current.updateYoutubeVideoLiz({id: video.id, date: new Date().toISOString()}, currentVideo.id);
            }
          }
          if (el.device === 'hdmiSala' && el.key === 'state') {
            const newView = structuredClone(view);
            if (el.value === 'roku') {
              if (view.selected === 'cable') {
                newView.cable.channels.category = [];
              }
            }
            if (el.value === 'cable') {
              if (view.selected === 'roku') {
                  newView.roku.apps.selected = '';
                  newView.roku.apps.youtube.mode = '';
                  newView.roku.apps.youtube.channel = '';
              }
            }
            newView.selected = el.value;
            changeView(newView, false);
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
      if (response && response.status === 200 && rokuApps.data) {
        const id = rokuApps.data.find(app => app.id === devicesState.rokuSala.app).id;
        if (id !== response.data['active-app'].app.id) {
          devices.rokuSala.app = rokuApps.data.find(app => app.id === response.data['active-app'].app.id).id;
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
  }, [devicesState.rokuSala.app, devicesState.rokuSala.state, rokuApps]);

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

  const subscribeToYoutubeVideosLizSupabaseChannel = () => {
    console.log('creating youtubeVideosLizSupabaseChannel');
    youtubeVideosLizSupabaseChannel.current = supabase.channel('youtube-videos-liz-changes');
    if (youtubeVideosLizSupabaseChannel.current?.socket.state !== 'joined') {
      youtubeVideosLizSupabaseChannel.current.on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'youtube-videos-liz'},
        async (change) => {
          console.log('youtube-videos-liz table changed');
          if (change.new.state === 'selected') {
            const videos = await requests.current.getYoutubeVideosLiz();
            setYoutubeVideosLiz(videos.data);
          }
        }
      ).subscribe(status => {
        console.log('youtubeVideosLizSupabaseChannel status is: ', status);
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to youtubeVideosLizSupabaseChannel');
        }
      });
    }
  };

  const unSubscribeFromYoutubeVideosLizSupabaseChannel = () => {
    supabase.removeChannel(youtubeVideosLizSupabaseChannel.current);
    console.log('Unsubscribed from youtubeVideosLizSupabaseChannel');
  }

  const getVisibility = useCallback(() => {
    const handleVisibilityChange = async () => {
      let message = '';
      if (document.visibilityState === 'visible') {
        userActive.current = true;
        setUserActive2(true);
        if (view.roku.apps.selected === 'youtube' && view.roku.apps.youtube.channel !== '') {
          const videos = await requests.current.getYoutubeVideosLiz();
          setYoutubeVideosLiz(videos.data);
          subscribeToYoutubeVideosLizSupabaseChannel();
        }
        message = user.current + ' regreso';
      } else {
        userActive.current = false;
        setUserActive2(false);
        if (view.roku.apps.selected === 'youtube' && view.roku.apps.youtube.channel !== '') {
          if (youtubeVideosLizSupabaseChannel.current) {
            unSubscribeFromYoutubeVideosLizSupabaseChannel();
          }
        }
        message = user.current + ' salio';
      }
      requests.current.sendLogs(message);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, view]);

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

    const newView = structuredClone(view);
    newView.selected = devicesStateUpdated.current.hdmiSala.state;
    changeView(newView);

    if (newView.selected === 'cable') {
      const channels = await requests.current.getCableChannels();
      setCableChannels(channels.data);
    }
    if (newView.selected === 'roku') {
      const apps = await requests.current.getRokuApps();
      setRokuApps(apps.data);
    }

    requests.current.sendLogs(user.current + ' entro');
    getVisibility();
    if (document.readyState === "complete") {
      document.body.classList.add("loaded");
    } else {
      window.addEventListener("load", document.body.classList.add("loaded"));
    }
    console.log('version 27');
  }, [getMassMediaData, getRokuData, getPosition, getVisibility, changeView, user, view]);

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
    if (credential === 'dev') {
      setSendDisabled(true);
    }
    if (credential === devCredential.current) {
        eruda.init();
    }
  }, [credential]);

  // useEffect(() => {
  //   async function getDbData() {
  //     if (devicesStateUpdated.current.hdmiSala.state === 'cable' && !cableChannels.length) {
  //       const channels = await requests.current.getCableChannels();
  //       setCableChannels(channels.data);
  //       // setCableChannels(cableChannelsDummyData.current.getCableChannelsDummyData());
  //     }
  //     if (devicesStateUpdated.current.hdmiSala.state === 'roku' && !rokuApps.length) {
  //       const apps = await requests.current.getRokuApps();
  //       setRokuApps(apps.data);
  //       // setRokuApps(rokuAppsDummyData.current.getRokuAppsDummyData());
  //     }
  //   }
  //   getDbData();
  // }, [devicesStateUpdated, cableChannels, rokuApps]);

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
            view={view}
            rokuApps={rokuApps}
            youtubeSearchVideos={youtubeSearchVideos}
            youtubeChannelsLiz={youtubeChannelsLiz}
            youtubeVideosLiz={youtubeVideosLiz}
            cableChannels={cableChannels}
            cableChannelCategories={cableChannelCategories}
            changeViewParent={changeView}
            changeControlParent={triggerControl}
            triggerVibrateParent={triggerVibrate}
            searchYoutubeParent={searchYoutube}>
          </Controls>
          {view.roku.apps.selected === '' &&
          <Devices
            credential={credential}
            ownerCredential={ownerCredential.current}
            devCredential={devCredential.current}
            view={view}
            devicesState={devicesState}
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
