import React, { useState, useEffect, useCallback, useRef } from 'react';
import { store } from "../../store/store";
import Internet from './views/internet/internet.js';
import Restricted from './views/restricted/restricted.js';
import Credentials from './views/credentials/credentials.js';
import Load from './load';
import utils from '../../global/utils';
import requests from '../../global/requests';
import connection from '../../global/connection';
import CordovaPlugins from '../../global/cordova-plugins';
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
  const setUserDeviceSt = store(v => v.setUserDeviceSt);
  const setScreenSelectedSt = store(v => v.setScreenSelectedSt);
  const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const setIsPcSt = store(v => v.setIsPcSt);
  const setIsAppSt = store(v => v.setIsAppSt);
  const isAppSt = store(v => v.isAppSt);
  const setLizEnabledSt = store(v => v.setLizEnabledSt);
  const [isReadySt, setIsReadySt] = useState(false);

  //useRef Variables
  const initializedRef = useRef(false);

  // event functions

  const onResume = useCallback(async (e) => {
    connection.updateConnection();
    setIsInForegroundSt(true);
    console.log('resume');
    requests.updateTable({ id: userNameSt, table: 'users', state: 'foreground' });
    // supabasePeers.peersChannel.track({ name: userNameSt + '-' + userDeviceSt, status: 'foreground', date: new Date().toISOString(), wifiName: wifiNameSt });
  }, [setIsInForegroundSt, userNameSt]);


  const onPause = useCallback(async (e) => {
    setIsInForegroundSt(false);
    if (isConnectedToInternetSt) {
      requests.updateTable({ id: userNameSt, table: 'users', state: 'background' });
      // requests.sendLogs('salio', user);
    }

    // await supabaseChannels.usersChannel.track({ name: userNameSt, status: 'background', date: new Date().toISOString(), wifiName: wifiNameSt });
  }, [isConnectedToInternetSt, setIsInForegroundSt, userNameSt]);

  const onVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      onResume();
    } else {
      onPause();
    }
  }, [onPause, onResume]);

  // init

  const init = useCallback(async (isApp) => {
    const userName = localStorage.getItem('user-name');
    const userDevice = localStorage.getItem('user-device');
    if (isApp) {
      await CordovaPlugins.getPermissions();
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
    const screenId = localStorage.getItem('screen-id') || 'teleSala';

    setIsAppSt(isApp);
    setIsPcSt(window.location.hostname === 'localhost' && !isApp);
    await connection.updateConnection();
    setThemeSt(localStorage.getItem('theme'));
    setScreenSelectedSt(screenId);
    setUserTypeSt(localStorage.getItem('user-type'));
    setUserNameSt(userName);
    setUserDeviceSt(userDevice);
    setLizEnabledSt(localStorage.getItem('lizEnabled') === 'true' ? true : false);

    if (store.getState().isConnectedToInternetSt) {
      requests.sendLogs('entro', user);
      requests.updateTable({ id: userName, table: 'users', state: 'foreground' });
    } else {
      connection.onNoInternet();
    }
    setTimeout(() => {
      setIsReadySt(true);
    }, 0);
  }, [setLizEnabledSt, setUserNameSt, setUserDeviceSt, setIsAppSt, setThemeSt, setUserTypeSt, setScreenSelectedSt, setIsPcSt]);

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
