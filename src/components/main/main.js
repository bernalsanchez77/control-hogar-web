import React, { useState, useEffect, useCallback, useRef } from 'react';
import { store } from "../../store/store";
import eruda from 'eruda';
import Internet from './views/internet/internet.js';
import Restricted from './views/restricted/restricted.js';
import Credentials from './views/credentials/credentials.js';
import Load from './load';
import utils from '../../global/utils';
import requests from '../../global/requests';
import connection from '../../global/connection';
import CordovaPlugins from '../../global/cordova-plugins';
import supabaseChannels from '../../global/supabase/supabase-channels';
import './main.css';

const user = utils.getUser(`${window.screen.width}x${window.screen.height}`);

function Main() {

  //useState Variables
  const themeSt = store(v => v.themeSt);
  const setThemeSt = store(v => v.setThemeSt);
  const setIsInForegroundSt = store(v => v.setIsInForegroundSt);
  const userTypeSt = store(v => v.userTypeSt);
  const userNameSt = store(v => v.userNameSt);
  const setUserTypeSt = store(v => v.setUserTypeSt);
  const setUserNameSt = store(v => v.setUserNameSt);
  const setScreenSelectedSt = store(v => v.setScreenSelectedSt);
  const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
  const setIsConnectedToInternetSt = store(v => v.setIsConnectedToInternetSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const setWifiNameSt = store(v => v.setWifiNameSt);
  const setNetworkTypeSt = store(v => v.setNetworkTypeSt);
  const setIsPcSt = store(v => v.setIsPcSt);
  const setIsAppSt = store(v => v.setIsAppSt);
  const isAppSt = store(v => v.isAppSt);
  const [isReadySt, setIsReadySt] = useState(false);

  //useRef Variables
  const initializedRef = useRef(false);

  // event functions

  const onResume = useCallback(async (e) => {
    setIsInForegroundSt(true);
    requests.updateTable({
      new: { newId: 'bernal-cel', newTable: 'users', newState: 'foreground' }
    });
    await supabaseChannels.usersChannel.track({ name: userNameSt, status: 'foreground', date: new Date().toISOString(), wifiName: wifiNameSt });
  }, [setIsInForegroundSt, userNameSt, wifiNameSt]);

  const onPause = useCallback(async (e) => {
    setIsInForegroundSt(false);
    if (isConnectedToInternetSt) {
      requests.updateTable({
        new: { newId: 'bernal-cel', newTable: 'users', newState: 'background' }
      });
      // requests.sendLogs('salio', user);
    }

    await supabaseChannels.usersChannel.track({ name: userNameSt, status: 'background', date: new Date().toISOString(), wifiName: wifiNameSt });
  }, [isConnectedToInternetSt, setIsInForegroundSt, userNameSt, wifiNameSt]);

  const onVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      onResume();
    } else {
      onPause();
    }
  }, [onPause, onResume]);

  // init

  const init = useCallback(async (isApp) => {

    // set initial variables
    const isConnectedToInternet = await utils.getIsConnectedToInternet();
    const userType = localStorage.getItem('user-type');
    const userName = localStorage.getItem('user-name');
    let wifiName = '';
    let networkType = '';

    // if isApp, get variables and start listeners
    if (isApp) {
      await CordovaPlugins.getPermissions();
      wifiName = await CordovaPlugins.getWifiName();
      networkType = await CordovaPlugins.getNetworkType();
      await CordovaPlugins.startWifiNameListener(connection.onWifiNameChange);
      await CordovaPlugins.startNetworkTypeListener(connection.onNetworkTypeChange);
    }

    // set url path to home
    if (document.readyState === 'complete') {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      window.addEventListener('load', async () => {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      });
    }

    // set state variables
    setIsAppSt(isApp);
    setIsPcSt(window.location.hostname === 'localhost' && !isApp);
    setThemeSt(localStorage.getItem('theme'));
    setScreenSelectedSt(localStorage.getItem('screen') || 'teleSala');
    setWifiNameSt(wifiName);
    setNetworkTypeSt(networkType);
    setUserTypeSt(userType);
    setUserNameSt(userName);
    setIsConnectedToInternetSt(isConnectedToInternet);

    if (!isConnectedToInternet) {
      connection.onNoInternet();
    } else {
      requests.sendLogs('entro', user);
      requests.updateTable({
        new: { newId: 'bernal-cel', newTable: 'users', newState: 'foreground' }
      });
    }
    setTimeout(() => {
      setIsReadySt(true);
    }, 0);
  }, [setUserNameSt, setIsAppSt, setThemeSt, setUserTypeSt, setScreenSelectedSt, setIsConnectedToInternetSt, setWifiNameSt, setNetworkTypeSt, setIsPcSt]);

  // useEffects

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
    if (isAppSt) {
      document.addEventListener("pause", onPause);
      document.addEventListener("resume", onResume);
    } else {
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
      if (isAppSt) {
        document.removeEventListener("pause", onPause);
        document.removeEventListener("resume", onResume);
      } else {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
    };
  }, [isAppSt, onPause, onResume, onVisibilityChange]);

  if (!initializedRef.current) {
    const isApp = window.cordova ? true : false;
    eruda.init();
    if (isApp) {
      document.addEventListener('deviceready', async () => {
        init(isApp);
      });
    } else {
      init(isApp);
    }
    initializedRef.current = true;
  }

  return (
    <div>
      {isReadySt &&
        <div className={`main fade-in main-${themeSt}`}>
          {isConnectedToInternetSt && userTypeSt && (userTypeSt !== 'guest' || (userTypeSt === 'guest' && wifiNameSt === 'Noky')) ?
            <div className='main-components'><Load></Load></div> :
            <div>
              {!isConnectedToInternetSt && <div><Internet></Internet></div>}
              {isConnectedToInternetSt && (wifiNameSt !== 'Noky' && userTypeSt === 'guest') && <div><Restricted></Restricted></div>}
              {isConnectedToInternetSt && !(wifiNameSt !== 'Noky' && userTypeSt === 'guest') && !userTypeSt && <div><Credentials></Credentials></div>}
            </div>
          }
        </div>
      }
    </div>
  );
}

export default Main;
