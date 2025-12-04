import React, { useState, useEffect, useCallback, useRef } from 'react';
import { store } from "../../store/store";
import eruda from 'eruda';
import Internet from './views/internet/internet.js';
import Restricted from './views/restricted/restricted.js';
import Credentials from './views/credentials/credentials.js';
import Load from './load';
import Utils from '../../global/utils';
import Requests from '../../global/requests';
import CordovaPlugins from '../../global/cordova-plugins';
import './main.css';

const isPc = window.location.hostname === 'localhost' && !window.cordova;
const requests = new Requests(isPc);
const utils = new Utils();
const user = utils.getUser(`${window.screen.width}x${window.screen.height}`);

function Main() {

  //useState Variables
  const setSendEnabledSt = store(v => v.setSendEnabledSt);
  const themeSt = store(v => v.themeSt);
  const setThemeSt = store(v => v.setThemeSt);
  const setIsInForegroundSt = store(v => v.setIsInForegroundSt);
  const userCredentialSt = store(v => v.userCredentialSt);
  const setUserCredentialSt = store(v => v.setUserCredentialSt);
  const setScreenSelectedSt = store(v => v.setScreenSelectedSt);
  const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
  const setIsConnectedToInternetSt = store(v => v.setIsConnectedToInternetSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const setWifiNameSt = store(v => v.setWifiNameSt);
  const networkTypeSt = store(v => v.networkTypeSt);
  const setNetworkTypeSt = store(v => v.setNetworkTypeSt);
  const setIsPcSt = store(v => v.setIsPcSt);
  const [isReadySt, setIsReadySt] = useState(false);

  //function variables
  let onNoInternet = null;

  //useRef Variables
  const initializedRef = useRef(false);
  const isConnectedToInternetIntervalRef = useRef({});
  const applicationRunningRef = useRef(false);
  const wifiNameRef = useRef('');
  const networkTypeRef = useRef('');
  const userCredentialRef = useRef('');
  const netChangeRunningRef = useRef(false);
  const isAppRef = useRef(window.cordova);

  // event functions

  const onResume = useCallback(async (e) => {
    setIsInForegroundSt(true);
  }, [setIsInForegroundSt]);

  const onPause = useCallback(async (e) => {
    setIsInForegroundSt(false);
    if (isConnectedToInternetSt) {
      // requests.sendLogs('salio', user);
    }
  }, [isConnectedToInternetSt, setIsInForegroundSt]);

  const onVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      onResume();
    } else {
      onPause();
    }
  }, [onPause, onResume]);

  const onNetworkTypeChange = useCallback((netType) => {
    console.log('changed in network type: ', netType);
    if (userCredentialRef.current === 'guest') {
      if (netType === 'wifi' && wifiNameRef === 'Noky') {
        if (!applicationRunningRef.current && !netChangeRunningRef.current) {
          netChangeRunningRef.current = true;
          setTimeout(async () => {
            const internetConnection = await utils.getIsConnectedToInternet();
            if (internetConnection) {
            } else {
              console.log('no internet detected by network type change, nointernet interval started');
              onNoInternet();
            }
            netChangeRunningRef.current = false;
          }, 5000);
        }
      }
    }
    setNetworkTypeSt(netType);
  }, [userCredentialRef, wifiNameRef, onNoInternet, setNetworkTypeSt]);

  const onWifiNameChange = useCallback((wifiName) => {
    console.log('changed in ssid: ', wifiName);
    if (userCredentialRef.current === 'guest') {
      if (wifiName === 'Noky' && networkTypeRef.current === 'wifi') {
        if (!applicationRunningRef.current && !netChangeRunningRef.current) {
          netChangeRunningRef.current = true;
          setTimeout(async () => {
            const internetConnection = await utils.getIsConnectedToInternet();
            if (internetConnection) {
            } else {
              console.log('no internet detected by ssid change, nointernet interval started');
              onNoInternet();
            }
            netChangeRunningRef.current = false;
          }, 5000);
        }
      }
    }
    setWifiNameSt(wifiName);
  }, [userCredentialRef, networkTypeRef, onNoInternet, setWifiNameSt]);

  const onSetUserCredential = async (userCredential) => {
    const isConnectedToInternet = await utils.getIsConnectedToInternet();
    if (isConnectedToInternet) {
      if (userCredential === 'guest') {
        localStorage.setItem('user', userCredential);
        setUserCredentialSt(userCredential);
      } else {
        const user = await requests.validateUserCredential(userCredential);
        if (user) {
          if (user === 'dev') {
            setSendEnabledSt(false);
          }
          // separate
          // await load();
          setUserCredentialSt(user);
        }
      }
    }
  };

  onNoInternet = useCallback(() => {
    console.log('internet interval started');
    let wifiName = '';
    let networkType = '';
    setIsConnectedToInternetSt(false);
    isConnectedToInternetIntervalRef.current = setInterval(async () => {
      const isConnectedToInternet = await utils.getIsConnectedToInternet();
      if (isConnectedToInternet) {
        console.log('Internet connected by interval');
        clearInterval(isConnectedToInternetIntervalRef.current);
        isConnectedToInternetIntervalRef.current = null;
        if (isAppRef.current) {
          wifiName = await CordovaPlugins.getWifiName();
          networkType = await CordovaPlugins.getNetworkType();
        }
        setWifiNameSt(wifiName);
        setNetworkTypeSt(networkType);
        setIsConnectedToInternetSt(true);
      } else {
        console.log('No internet by interval');
      }
    }, 5000);
  }, [setIsConnectedToInternetSt, setWifiNameSt, setNetworkTypeSt]);

  // init

  const init = useCallback(async () => {

    // set initial variables
    const isConnectedToInternet = await utils.getIsConnectedToInternet();
    const userCredential = localStorage.getItem('user');
    let wifiName = '';
    let networkType = '';

    // if isApp, get variables and start listeners
    if (isAppRef.current) {
      await CordovaPlugins.getPermissions();
      wifiName = await CordovaPlugins.getWifiName();
      networkType = await CordovaPlugins.getNetworkType();
      await CordovaPlugins.startWifiNameListener(onWifiNameChange);
      await CordovaPlugins.startNetworkTypeListener(onNetworkTypeChange);
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
    setIsPcSt(isPc);
    setThemeSt(localStorage.getItem('theme'));
    setScreenSelectedSt(localStorage.getItem('screen') || 'teleSala');
    setWifiNameSt(wifiName);
    setNetworkTypeSt(networkType);
    setUserCredentialSt(userCredential);
    setIsConnectedToInternetSt(isConnectedToInternet);

    if (!isConnectedToInternet) {
      onNoInternet();
    } else {
      requests.sendLogs('entro', user);
    }
    setTimeout(() => {
      setIsReadySt(true);
    }, 0);
  }, [onNetworkTypeChange, onWifiNameChange, onNoInternet, setThemeSt, setUserCredentialSt, setScreenSelectedSt, setIsConnectedToInternetSt, setWifiNameSt, setNetworkTypeSt, setIsPcSt]);

  // useEffects

  useEffect(() => {
    networkTypeRef.current = networkTypeSt;
  }, [networkTypeSt]);

  useEffect(() => {
    wifiNameRef.current = wifiNameSt;
  }, [wifiNameSt]);

  useEffect(() => {
    userCredentialRef.current = userCredentialSt;
  }, [userCredentialSt]);

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
    const isApp = isAppRef.current;
    if (isApp) {
      document.addEventListener("pause", onPause);
      document.addEventListener("resume", onResume);
    } else {
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
      if (isApp) {
        document.removeEventListener("pause", onPause);
        document.removeEventListener("resume", onResume);
      } else {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
    };
  }, [isAppRef, onPause, onResume, onVisibilityChange]);

  if (!initializedRef.current) {
    eruda.init();
    if (isAppRef.current) {
      document.addEventListener('deviceready', async () => {
        init();
      });
    } else {
      init();
    }
    initializedRef.current = true;
  }

  return (
    <div>
      {isReadySt &&
        <div className={`main fade-in main-${themeSt}`}>
          {isConnectedToInternetSt && userCredentialSt && (userCredentialSt !== 'guest' || (userCredentialSt === 'guest' && wifiNameSt === 'Noky')) ?
            <div className='main-components'>
              <Load
                isApp={isAppRef.current}
                onNoInternetParent={onNoInternet}>
              </Load>
            </div> :
            <div>
              {!isConnectedToInternetSt &&
                <div>
                  <Internet>
                  </Internet>
                </div>
              }
              {isConnectedToInternetSt && (wifiNameSt !== 'Noky' && userCredentialSt === 'guest') &&
                <div>
                  <Restricted>
                  </Restricted>
                </div>
              }
              {isConnectedToInternetSt && !(wifiNameSt !== 'Noky' && userCredentialSt === 'guest') && !userCredentialSt &&
                <div>
                  <Credentials
                    onSetUserCredentialParent={onSetUserCredential}>
                  </Credentials>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  );
}

export default Main;
