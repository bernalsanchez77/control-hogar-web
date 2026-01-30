import React, { useEffect, useCallback, useRef } from 'react';
import Screens from './screens/screens';
import Devices from './devices/devices';
import Options from './options/options';
// import Notifications from './notifications/notifications';
import Controls from './controls/controls';
import Loading from './views/loading/loading';
import SupabaseTimeout from './views/supabaseTimeout/supabaseTimeout';
import Dev from './dev/dev';
import supabaseChannels from '../../global/supabase/supabase-channels';
import supabasePeers from '../../global/supabase/supabase-peers';
import viewRouter from '../../global/view-router';
import requests from '../../global/requests';
import Roku from '../../global/roku';
import CordovaPlugins from '../../global/cordova-plugins';
import Tables from '../../global/tables';
import events from '../../global/events';
import { store } from '../../store/store';
import './load.css';

function Load() {

  //useState Variables

  const isLoadingSt = store(v => v.isLoadingSt);
  const setIsLoadingSt = store(v => v.setIsLoadingSt);
  const isInForegroundSt = store(v => v.isInForegroundSt);
  const userTypeSt = store(v => v.userTypeSt);
  const userNameSt = store(v => v.userNameSt);
  const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const networkTypeSt = store(v => v.networkTypeSt);
  const supabaseTimeoutSt = store(v => v.supabaseTimeoutSt);
  const setSupabaseTimeoutSt = store(v => v.supabaseSetTimeoutSt);
  const updateTablesSt = store((v) => v.updateTablesSt);
  const setTableSt = store((v) => v.setTableSt);
  const screensSt = store(v => v.screensSt);
  const devicesSt = store(v => v.devicesSt);
  const viewSt = store(v => v.viewSt);
  const isPcSt = store(v => v.isPcSt);
  const isAppSt = store(v => v.isAppSt);
  const screenSelectedSt = store(v => v.screenSelectedSt);

  // const [inRange, setInRange] = useState(false);

  //useRef Variables
  const isLoadingRef = useRef(false);
  const isLoadInitializedRef = useRef(false);
  const isReadyRef = useRef(false);
  const loadFnRef = useRef(null);

  const subscribeToSupabaseChannel = useCallback(async (tableName, callback) => {
    let response = '';
    await supabaseChannels.subscribeToSupabaseChannel(tableName, async (itemName, newItem) => {
      updateTablesSt(tableName + 'St', newItem);
      if (callback) {
        await callback(newItem);
      }
    }, true).then((res) => {
      if (res.success) {
        response = 'SUBSCRIBED';
        setSupabaseTimeoutSt(false);
      } else {
        switch (res.msg) {
          case 'TIMED_OUT':
            response = res.msg;
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
  }, [setSupabaseTimeoutSt, updateTablesSt]);

  const setData = useCallback(async (tableName, data, callback) => {
    let subscriptionResponse = '';
    let table = await requests.getTable(tableName);
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

  const updateNotificationBar = useCallback(async () => {
    const isPlaying = store.getState().hdmiSalaSt.find(el => el.id === 'roku').playState === 'play';
    CordovaPlugins.updatePlayState(isPlaying);
    const screenSelected = store.getState().screensSt.find(el => el.id === screenSelectedSt);
    CordovaPlugins.updateScreenSelected(screenSelected.label + ' ' + screenSelected.state.toUpperCase());
    CordovaPlugins.updateScreenState(screenSelected.state);
    const rokuAppsSelectedRokuId = store.getState().selectionsSt.find(el => el.table === 'rokuApps').id;
    const appSelectedLabel = store.getState().rokuAppsSt.find(el => el.rokuId === rokuAppsSelectedRokuId).label;
    CordovaPlugins.updateAppSelected(appSelectedLabel);
    CordovaPlugins.updateMuteState(screenSelected.mute);
  }, [screenSelectedSt]);

  const load = useCallback(async (firstLoad = false) => {
    if (firstLoad) {
      setIsLoadingSt(true);
    }
    isLoadingRef.current = true;
    // setInRange(await utils.getInRange());
    const newView = structuredClone(viewSt);

    const hdmiSalaTable = await setData('hdmiSala', false, async (change) => {
      Tables.onHdmiSalaTableChange(change);
    });

    if (hdmiSalaTable.table && hdmiSalaTable.subscriptionResponse === 'SUBSCRIBED') {
      await setData('screens', false, async (change) => {
        Tables.onScreensTableChange(change);
      });

      setIsLoadingSt(false);
      await setData('selections', true, (change) => {
        Tables.onSelectionsTableChange(change);
      });
      newView.selected = store.getState().selectionsSt.find(el => el.table === 'hdmiSala').id;
      await viewRouter.changeView(newView);
      await setData('rokuApps');
      await setData('devices');
      await setData('youtubeChannelsLiz');
      await setData('cableChannels');
      await setData('youtubeVideosLiz', true, (change) => {
        Tables.onYoutubeVideosLizTableChange(change);
      });
    }
    if (isAppSt) {
      updateNotificationBar();
    }
    if (wifiNameSt === 'Noky') {
      Roku.setRoku();
    }
    setIsLoadingSt(false);
    isLoadingRef.current = false;
  }, [setData, setIsLoadingSt, viewSt, wifiNameSt, isAppSt, updateNotificationBar]);

  // event functions

  const onSupabaseTimeout = async () => {
    await load();
  };

  // init

  const init = useCallback(async () => {
    await supabasePeers.subscribeToPeersChannel();
    await load(true);
    if (wifiNameSt === 'Noky') {
      Roku.setIsConnectedToNokyWifi(true);
      // requests.updateSelections({ table: 'users', id: userNameSt });
    }
    const youtubeVideosLizSelectedId = store.getState().selectionsSt.find(el => el.table === 'youtubeVideosLiz')?.id;
    if (youtubeVideosLizSelectedId) {
      if (userNameSt === store.getState().leaderSt && !Roku.playStateInterval) {
        const youtubeVideosLizSelected = store.getState().youtubeVideosLizSt.find(el => el.id === youtubeVideosLizSelectedId);
        Roku.startPlayStateListener(youtubeVideosLizSelected);
      }
    }
    isReadyRef.current = true;
  }, [load, wifiNameSt, userNameSt]);

  // useEffects

  useEffect(() => {
    if (isReadyRef.current && isLoadInitializedRef.current && isInForegroundSt && isConnectedToInternetSt) {
      loadFnRef.current();
    }
  }, [isInForegroundSt, isConnectedToInternetSt]);

  useEffect(() => {
    if (isReadyRef.current) {
      if (isConnectedToInternetSt && ((isPcSt && wifiNameSt === 'Noky') || (wifiNameSt === 'Noky' && networkTypeSt === 'wifi'))) {
        Roku.setIsConnectedToNokyWifi(true);
      } else {
        Roku.setIsConnectedToNokyWifi(false);
      }
      const status = isInForegroundSt ? 'foreground' : 'background';
      supabasePeers.peersChannel.track({ name: userNameSt, status: status, date: new Date().toISOString(), wifiName: wifiNameSt });
    }
  }, [wifiNameSt, networkTypeSt, isPcSt, isInForegroundSt, userNameSt, isConnectedToInternetSt]);

  useEffect(() => {
    if (isAppSt) {
      document.addEventListener("backbutton", events.onNavigationBack);
      document.addEventListener("volumeupbutton", events.onVolumeUp);
      document.addEventListener("volumedownbutton", events.onVolumeDown);
    } else {
      window.addEventListener("popstate", events.onNavigationBack);
    }

    return () => {
      if (isAppSt) {
        document.removeEventListener("backbutton", events.onNavigationBack);
        document.removeEventListener("volumeupbutton", events.onVolumeUp);
        document.removeEventListener("volumedownbutton", events.onVolumeDown);
      } else {
        window.removeEventListener("popstate", events.onNavigationBack);
      }
    };
  }, [isAppSt]);

  loadFnRef.current = load;
  if (!isLoadInitializedRef.current) {
    isLoadInitializedRef.current = true;
    init();
  }

  return (
    <div className='load'>
      {viewSt && !isLoadingSt && (userTypeSt !== 'guest' || (userTypeSt === 'guest' && wifiNameSt === 'Noky')) && !supabaseTimeoutSt ?
        <div className='load-components'>
          {/* <Notifications></Notifications> */}
          {screensSt.length &&
            <Screens></Screens>
          }
          <Controls></Controls>
          {devicesSt.length && !viewSt.roku.apps.selected && !viewSt.devices.device &&
            <Devices></Devices>
          }
          {!viewSt.roku.apps.selected && !viewSt.devices.device &&
            <Options></Options>
          }
          {userTypeSt === 'dev' &&
            <Dev></Dev>
          }
        </div> :
        <div>
          {isLoadingSt &&
            <div><Loading></Loading></div>
          }
          {!isLoadingSt && isConnectedToInternetSt && !(wifiNameSt !== 'Noky' && userTypeSt === 'guest') && userTypeSt && supabaseTimeoutSt &&
            <div><SupabaseTimeout onSupabaseTimeoutParent={onSupabaseTimeout}></SupabaseTimeout></div>
          }
        </div>
      }
    </div>
  );
}

export default Load;
