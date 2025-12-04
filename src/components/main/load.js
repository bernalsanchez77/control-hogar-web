import React, { useEffect, useCallback, useRef } from 'react';
import { store } from "../../store/store";
import Screens from './screens/screens';
import Devices from './devices/devices';
import Options from './options/options';
import Notifications from './notifications/notifications';
import Controls from './controls/controls';
import Loading from './views/loading/loading';
import SupabaseTimeout from './views/supabaseTimeout/supabaseTimeout';
import Dev from './dev/dev';
import Utils from '../../global/utils';
import supabaseChannels from '../../global/supabase/supabase-channels';
import supabaseModify from '../../global/supabase/supabase-modify';
import ViewRouter from '../../global/view-router';
import Requests from '../../global/requests';
import Roku from '../../global/roku';
import YoutubeDummyData from '../../global/youtube-dummy-data';
import CableChannelCategories from '../../global/cable-channel-categories';
import './load.css';

const isPc = window.location.hostname === 'localhost' && !window.cordova;
const requests = new Requests(isPc);
const utils = new Utils();
const viewRouter = new ViewRouter();

function Load({ isApp, onNoInternetParent }) {

  //useState Variables

  const sendEnabledSt = store(v => v.sendEnabledSt);
  const setSendEnabledSt = store(v => v.setSendEnabledSt);
  const isLoadingSt = store(v => v.isLoadingSt);
  const setIsLoadingSt = store(v => v.setIsLoadingSt);
  const isInForegroundSt = store(v => v.isInForegroundSt);
  const userCredentialSt = store(v => v.userCredentialSt);
  const screenSelectedSt = store(v => v.screenSelectedSt);
  const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const networkTypeSt = store(v => v.networkTypeSt);
  const supabaseTimeoutSt = store(v => v.supabaseTimeoutSt);
  const setSupabaseTimeoutSt = store(v => v.supabaseSetTimeoutSt);
  const setRokuSearchModeSt = store(v => v.setRokuSearchModeSt);
  const updateTablesSt = store((v) => v.updateTablesSt);
  const setTableSt = store((v) => v.setTableSt);
  const screensSt = store(v => v.screensSt);
  const cableChannelsSt = store(v => v.cableChannelsSt);
  const setYoutubeSearchVideosSt = store(v => v.setYoutubeSearchVideosSt);
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
  const rokuAppsSt = store(v => v.rokuAppsSt);
  const hdmiSalaSt = store(v => v.hdmiSalaSt);
  const devicesSt = store(v => v.devicesSt);
  const viewSt = store(v => v.viewSt);
  // const [inRange, setInRange] = useState(false);

  //normal variables
  const cableChannelCategories = new CableChannelCategories().getCableChannelCategories();

  // eslint-disable-next-line
  const youtubeDummyData = new YoutubeDummyData().getYoutubeDummyData();

  //useRef Variables
  const initializedRef = useRef(false);
  const viewRef = useRef(viewSt);
  const rokuAppsRef = useRef(rokuAppsSt);
  const hdmiSalaRef = useRef(hdmiSalaSt);
  const screensRef = useRef(screensSt);
  const youtubeVideosLizRef = useRef(youtubeVideosLizSt);
  const firstTimeLoadingRef = useRef(true);
  const isLoadRunning = useRef(false);

  // useMemo variables (computed)

  const onNoInternet = useCallback(async () => {
    onNoInternetParent();
  }, [onNoInternetParent]);

  const searchYoutube = async (text) => {
    utils.triggerVibrate();
    const videos = await requests.searchYoutube(text);
    if (videos) {
      setYoutubeSearchVideosSt(videos);
    }
    // setYoutubeSearchVideosSt(youtubeDummyData);
  };

  const seachRokuMode = (text) => {
    utils.triggerVibrate();
    requests.sendControl({ roku: [{ key: 'keypress', value: text, params: '' }] });
  };

  const subscribeToSupabaseChannel = useCallback(async (tableName, callback) => {
    let response = '';
    await supabaseChannels.subscribeToSupabaseChannel(tableName, async (itemName, newItem) => {
      updateTablesSt(tableName + 'St', newItem);
      if (callback) {
        await callback(newItem);
      }
    }, onNoInternet, true).then((res) => {
      if (res.success) {
        response = 'SUBSCRIBED';
        setSupabaseTimeoutSt(false);
      } else {
        switch (res.msg) {
          case 'TIMED_OUT':
            response = res.msg;
            console.log('not subscribed, subscription status:', res.msg);
            setSupabaseTimeoutSt(true);
            break;
          case 'CHANNEL_ERROR':
            response = res.msg;
            setSupabaseTimeoutSt(false);
            break;
          case 'CLOSED':
            response = res.msg;
            setSupabaseTimeoutSt(false);
            break;
          default:
            setSupabaseTimeoutSt(false);
        }
      }
    }).catch((res) => {
      response = res.msg;
    });
    return response;
  }, [onNoInternet, setSupabaseTimeoutSt, updateTablesSt]);

  // table change functions

  const onHdmiSalaTableChange = useCallback(async (change) => {
    if (viewRef.current.selected !== change.id) {
      await viewRouter.onHdmiSalaTableChange(viewRef.current, change.id);
    }
  }, []);

  const onYoutubeVideosLizTableChange = useCallback(async (change) => {
    console.log('change in youtube videos');
  }, []);

  const onRokuSalaTableChange = useCallback(async (change) => {
    setRokuSearchModeSt('roku');
    if (rokuAppsRef.current.find(app => app.state === 'selected')?.rokuId !== change.rokuId && change.state === 'selected') {
      console.log('selected app changed');
      removeSelectedVideo(youtubeVideosLizRef.current);
    }
  }, [setRokuSearchModeSt]);

  // end of table change functions


  const handlePlayStateFromRoku = useCallback((playState) => {
    if (hdmiSalaRef.current.find(hdmi => hdmi.id === 'roku').playState !== playState) {
      supabaseModify.updateTable('hdmiSala', { key: 'playState', value: playState }, 'roku');
    }
  }, []);

  const handleYoutubeQueue = (params) => {
    supabaseModify.updateTable('youtubeVideosLiz', { key: 'queue', value: params.queueNumber }, params.videoId, params.date);
  };

  const removeSelectedVideo = (videoTable) => {
    if (videoTable.find(video => video.state === 'selected')) {
      supabaseModify.modifyTable(videoTable, 'youtubeVideosLiz');
    }
  };

  const changeControl = useCallback(async (params, obj) => {
    if (!params.ignoreVibration) {
      utils.triggerVibrate();
    }
    requests.sendControl(params);
    const media = params.massMedia || params.ifttt || [];
    if (media.length > 0) {
      media.forEach(async el => {
        if (Array.isArray(el.key)) {
        } else {
          if (el.device === 'rokuSala') {
            if (el.key === 'video' && viewRef.current.roku.apps.youtube.mode === 'channel') {
              supabaseModify.modifyTable(youtubeVideosLizSt, 'youtubeVideosLiz', el);
            }
            if (el.key === 'app') {
              supabaseModify.modifyTable(rokuAppsSt, 'rokuApps', el);
            }
            if (el.key === 'playState') {
              supabaseModify.updateTable('hdmiSala', el, 'roku');
            }
          }
          if (el.device === 'channelsSala') {
            supabaseModify.modifyTable(cableChannelsSt, 'cableChannels', el);
          }
          if (el.device === 'hdmiSala') {
            supabaseModify.modifyTable(hdmiSalaSt, 'hdmiSala', el);
          }
          if (el.device === 'luzEscalera' || el.device === 'luzCuarto' || el.device === 'lamparaComedor' || el.device === 'lamparaSala' || el.device === 'lamparaRotatoria' || el.device === 'chimeneaSala' || el.device === 'parlantesSala' || el.device === 'ventiladorSala' || el.device === 'calentadorNegro' || el.device === 'calentadorBlanco' || el.device === 'lamparaTurca' || el.device === 'proyectorSalaSwitch') {
            supabaseModify.updateTable('devices', el, devicesSt.find(v => v.id === el.device).id);
          }
          if (el.device === 'teleSala' || el.device === 'teleCuarto' || el.device === 'teleCocina' || el.device === 'proyectorSala') {
            supabaseModify.updateTable('screens', el, screensSt.find(screen => screen.id === el.device).id);
          }
        }
      });
    }
  }, [youtubeVideosLizSt, cableChannelsSt, devicesSt, hdmiSalaSt, rokuAppsSt, screensSt]);

  const setRoku = useCallback(async () => {
    let rokuActiveApp = null;
    if (isPc || wifiNameSt === 'Noky') {
      Roku.setWifi(true);
      rokuActiveApp = await Roku.getActiveApp();
      if (rokuActiveApp) {
        if (rokuActiveApp !== rokuAppsRef.current.find(v => v.state === 'selected').rokuId) {
          supabaseModify.modifyTable(rokuAppsRef.current, 'rokuApps', { key: 'app', value: rokuAppsRef.current.find(v => v.rokuId === rokuActiveApp).id });
        }
        const playStateFromRoku = await Roku.getPlayState('state');
        if (playStateFromRoku) {
          Roku.startPlayStateListener(handlePlayStateFromRoku);
          if (playStateFromRoku !== 'play' && playStateFromRoku !== 'pause') {
            removeSelectedVideo(youtubeVideosLizRef.current);
          }
        }
      }
    }
  }, [handlePlayStateFromRoku, wifiNameSt]);

  const setData = useCallback(async (tableName, data, callback) => {
    let subscriptionResponse = '';
    let table = await requests.getTableFromSupabase(tableName);
    if (table && table.status === 200 && table.data) {
      setTableSt(tableName + 'St', table.data);
      const tableChannel = supabaseChannels.getSupabaseChannelState(tableName);
      if (tableChannel?.channel) {
        const state = tableChannel.channel.state;
        switch (state) {
          case 'joined':
            break;
          case undefined:
            if (tableChannel.subscribed) {
              await supabaseChannels.unsubscribeFromSupabaseChannel(tableName);
            }
            subscriptionResponse = await subscribeToSupabaseChannel(tableName, callback);
            break;
          default:
            if (tableChannel.subscribed) {
              await supabaseChannels.unsubscribeFromSupabaseChannel(tableName);
            }
            subscriptionResponse = await subscribeToSupabaseChannel(tableName, callback);
        }
      } else {
        subscriptionResponse = await subscribeToSupabaseChannel(tableName, callback);
      }
      if (data) {
        return table.data;
      } else {
        return { table, subscriptionResponse };
      }
    } else {
      return { table: null };
    }
  }, [subscribeToSupabaseChannel, setTableSt]);

  const load = useCallback(async () => {
    isLoadRunning.current = true;
    setIsLoadingSt(true);
    // setInRange(await utils.getInRange());
    const newView = structuredClone(viewRef.current);

    const hdmiSalaTable = await setData('hdmiSala', false, async (change) => {
      onHdmiSalaTableChange(change);
    });

    if (hdmiSalaTable.table && hdmiSalaTable.subscriptionResponse === 'SUBSCRIBED') {
      await setData('youtubeVideosLiz', true, (change) => {
        onYoutubeVideosLizTableChange(change);
      });
      await setData('rokuApps', true, (change) => {
        onRokuSalaTableChange(change);
      });
      await setData('youtubeChannelsLiz');
      await setData('cableChannels');
      await setData('devices');
      await setData('screens');

      newView.selected = hdmiSalaTable.table.data.find(el => el.state === 'selected').id;
      await viewRouter.changeView(newView, viewRef.current);
    }
    setIsLoadingSt(false);
    isLoadRunning.current = false;
  }, [setData, setIsLoadingSt, onHdmiSalaTableChange, onYoutubeVideosLizTableChange, onRokuSalaTableChange]);

  // event functions

  const onEnableSend = () => {
    if (sendEnabledSt === true) {
      setSendEnabledSt(false);
    } else {
      setSendEnabledSt(true);
    }
  };

  const onRemoveStorage = () => {
    localStorage.setItem('user', '');
  };

  const onSupabaseTimeout = async () => {
    await load();
  };

  const onNavigationBack = useCallback(async (e) => {
    e.preventDefault();
    await viewRouter.onNavigationBack(viewRef.current);
  }, []);

  const onVolumeUp = useCallback((e) => {
    const screen = screensRef.current.find(screen => screen.id === screenSelectedSt);
    if (screen.state === 'on') {
      let newVol = 0;
      newVol = screen.volume + 1;
      changeControl({
        ifttt: [{ device: screen.id, key: 'volume', value: 'up' + 1 }],
        massMedia: [{ device: screen.id, key: 'volume', value: newVol }],
      });
    }
  }, [changeControl, screenSelectedSt, screensRef]);

  const onVolumeDown = useCallback((e) => {
    const screen = screensRef.current.find(screen => screen.id === screenSelectedSt);
    if (screen.state === 'on') {
      let newVol = 0;
      if (screen.volume !== 0) {
        if (screen.volume - 1 >= 0) {
          newVol = screen.volume - 1;
          changeControl({
            ifttt: [{ device: screen.id, key: 'volume', value: 'down' + 1 }],
            massMedia: [{ device: screen.id, key: 'volume', value: newVol }],
          });
        } else {
          newVol = screen.volume - 1;
          changeControl({
            ifttt: [{ device: screen.id, key: 'volume', value: 'down' + 1 }],
            massMedia: [{ device: screen.id, key: 'volume', value: '0' }],
          });
        }
      } else {
        changeControl({ ifttt: [{ device: screen.id, key: 'volume', value: 'down' + 1 }], massMedia: [] });
      }
    }
  }, [changeControl, screensRef, screenSelectedSt]);

  // init

  const init = useCallback(async () => {
    await load();
    await setRoku();
    firstTimeLoadingRef.current = false;
  }, [load, setRoku]);

  // useEffects

  useEffect(() => {
    viewRef.current = viewSt;
  }, [viewSt]);

  useEffect(() => {
    rokuAppsRef.current = rokuAppsSt;
  }, [rokuAppsSt]);

  useEffect(() => {
    screensRef.current = screensSt;
  }, [screensSt]);

  useEffect(() => {
    hdmiSalaRef.current = hdmiSalaSt;
  }, [hdmiSalaSt]);

  useEffect(() => {
    youtubeVideosLizRef.current = youtubeVideosLizSt;
  }, [youtubeVideosLizSt]);

  useEffect(() => {
    async function fetchData() {
      if (isConnectedToInternetSt && !isLoadRunning.current && isInForegroundSt && !firstTimeLoadingRef.current) {
        await load();
      }
    }
    fetchData();
  }, [isInForegroundSt, load, isConnectedToInternetSt]);

  useEffect(() => {
    if (!firstTimeLoadingRef.current) {
      if (isPc || (wifiNameSt === 'Noky' && networkTypeSt === 'wifi')) {
        Roku.setWifi(true);
        setTimeout(async () => {
          Roku.startPlayStateListener(handlePlayStateFromRoku);
        }, 2000);
      } else {
        Roku.setWifi(false);
      }
    }
  }, [wifiNameSt, networkTypeSt, handlePlayStateFromRoku]);

  useEffect(() => {
    return () => {
      if (!firstTimeLoadingRef.current) {
        Roku.setWifi(false);
      }
    }
  }, [isConnectedToInternetSt]);

  useEffect(() => {
    if (isApp) {
      document.addEventListener("backbutton", onNavigationBack);
      document.addEventListener("volumeupbutton", onVolumeUp);
      document.addEventListener("volumedownbutton", onVolumeDown);
    } else {
      window.addEventListener("popstate", onNavigationBack);
    }

    return () => {
      if (isApp) {
        document.removeEventListener("backbutton", onNavigationBack);
        document.removeEventListener("volumeupbutton", onVolumeUp);
        document.removeEventListener("volumedownbutton", onVolumeDown);
      } else {
        window.removeEventListener("popstate", onNavigationBack);
      }
    };
  }, [onNavigationBack, onVolumeUp, onVolumeDown, isApp]);

  if (!initializedRef.current) {
    init();
    initializedRef.current = true;
  }

  return (
    <div className='load'>
      {viewSt && !isLoadingSt && (userCredentialSt !== 'guest' || (userCredentialSt === 'guest' && wifiNameSt === 'Noky')) && !supabaseTimeoutSt ?
        <div className='load-components'>
          <Notifications>
          </Notifications>
          {screensSt.length &&
            <Screens>
            </Screens>
          }
          <Controls
            cableChannelCategories={cableChannelCategories}
            changeControlParent={changeControl}
            searchYoutubeParent={searchYoutube}
            searchRokuModeParent={seachRokuMode}
            handleYoutubeQueueParent={handleYoutubeQueue}
            removeSelectedVideoParent={removeSelectedVideo}>
          </Controls>
          {devicesSt.length && !viewSt.roku.apps.selected && !viewSt.devices.device &&
            <Devices
              changeControlParent={changeControl}>
            </Devices>
          }
          {!viewSt.roku.apps.selected && !viewSt.devices.device &&
            <Options>
            </Options>
          }
          {userCredentialSt === 'dev' &&
            <Dev
              enableSendParent={onEnableSend}
              removeStorageParent={onRemoveStorage}>
            </Dev>
          }
        </div> :
        <div>
          {isLoadingSt &&
            <div>
              <Loading>
              </Loading>
            </div>
          }
          {!isLoadingSt && isConnectedToInternetSt && !(wifiNameSt !== 'Noky' && userCredentialSt === 'guest') && userCredentialSt && supabaseTimeoutSt &&
            <div>
              <SupabaseTimeout
                onSupabaseTimeoutParent={onSupabaseTimeout}>
              </SupabaseTimeout>
            </div>
          }
        </div>
      }
    </div>
  );
}

export default Load;
