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
import supabaseChannels from '../../global/supabase/supabase-channels';
import viewRouter from '../../global/view-router';
import requests from '../../global/requests';
import Roku from '../../global/roku';
import Tables from '../../global/tables';
import events from '../../global/events';
import './load.css';

function Load() {

  //useState Variables

  const isLoadingSt = store(v => v.isLoadingSt);
  const setIsLoadingSt = store(v => v.setIsLoadingSt);
  const isInForegroundSt = store(v => v.isInForegroundSt);
  const userCredentialSt = store(v => v.userCredentialSt);
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
  // const [inRange, setInRange] = useState(false);

  //useRef Variables
  const initializedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isReadyRef = useRef(false);

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

  const load = useCallback(async () => {
    setIsLoadingSt(true);
    isLoadingRef.current = true;
    // setInRange(await utils.getInRange());
    const newView = structuredClone(viewSt);

    const hdmiSalaTable = await setData('hdmiSala', false, async (change) => {
      Tables.onHdmiSalaTableChange(change);
    });

    if (hdmiSalaTable.table && hdmiSalaTable.subscriptionResponse === 'SUBSCRIBED') {
      await setData('screens');

      setIsLoadingSt(false);
      newView.selected = hdmiSalaTable.table.data.find(el => el.state === 'selected').id;
      await viewRouter.changeView(newView);
      await setData('rokuApps', true, (change) => {
        Tables.onRokuSalaTableChange(change);
      });
      await setData('devices');
      await setData('youtubeChannelsLiz');
      await setData('youtubeVideosLiz', true, (change) => {
        Tables.onYoutubeVideosLizTableChange(change);
      });
    }
    if (isPcSt || wifiNameSt === 'Noky') {
      Roku.setRoku();
    }
    setIsLoadingSt(false);
    isLoadingRef.current = false;
  }, [setData, setIsLoadingSt, viewSt, isPcSt, wifiNameSt]);

  // event functions

  const onSupabaseTimeout = async () => {
    await load();
  };

  // init

  const init = useCallback(async () => {
    await load();
    if (isPcSt || wifiNameSt === 'Noky') {
      Roku.setWifi(true);
      Roku.startPlayStateListener();
    }
    isReadyRef.current = true;
  }, [load, isPcSt, wifiNameSt]);

  // useEffects

  useEffect(() => {
    async function fetchData() {
      if (isReadyRef.current && !isLoadingRef.current && isConnectedToInternetSt && isInForegroundSt && initializedRef.current) {
        await load();
      }
    }
    fetchData();
  }, [isInForegroundSt, load, isConnectedToInternetSt, isLoadingRef]);

  useEffect(() => {
    if (isReadyRef.current) {
      if (isPcSt || (wifiNameSt === 'Noky' && networkTypeSt === 'wifi')) {
        Roku.setWifi(true);
        setTimeout(async () => {
          Roku.startPlayStateListener();
        }, 2000);
      } else {
        Roku.setWifi(false);
      }
    }
  }, [wifiNameSt, networkTypeSt, isPcSt]);

  useEffect(() => {
    return () => {
      if (isReadyRef.current) {
        Roku.setWifi(false);
      }
    }
  }, [isConnectedToInternetSt]);

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

  if (!initializedRef.current) {
    initializedRef.current = true;
    init();
  }

  return (
    <div className='load'>
      {viewSt && !isLoadingSt && (userCredentialSt !== 'guest' || (userCredentialSt === 'guest' && wifiNameSt === 'Noky')) && !supabaseTimeoutSt ?
        <div className='load-components'>
          <Notifications></Notifications>
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
          {userCredentialSt === 'dev' &&
            <Dev></Dev>
          }
        </div> :
        <div>
          {isLoadingSt &&
            <div><Loading></Loading></div>
          }
          {!isLoadingSt && isConnectedToInternetSt && !(wifiNameSt !== 'Noky' && userCredentialSt === 'guest') && userCredentialSt && supabaseTimeoutSt &&
            <div><SupabaseTimeout onSupabaseTimeoutParent={onSupabaseTimeout}></SupabaseTimeout></div>
          }
        </div>
      }
    </div>
  );
}

export default Load;
