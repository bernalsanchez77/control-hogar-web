import { useState, useEffect, useCallback, useRef } from 'react';
import { store } from '../../store/store';
import utils from '../../global/utils';
import requests from '../../global/requests';
import connection from '../../global/connection';
import CordovaPlugins from '../../global/cordova-plugins';

const user = utils.getUser(`${window.screen.width}x${window.screen.height}`);

export function useMain() {
    // 1. Store / Global State
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
    const leaderSt = store(v => v.selectionsSt.find(el => el.table === 'leader')?.id);

    // 2. Local State
    const [isReadySt, setIsReadySt] = useState(false);

    // 3. Refs
    const initializedRef = useRef(false);

    // 4. Callbacks / Functions
    const onResume = useCallback(async (e) => {
        console.log('To Foreground, the leader is:', leaderSt);
        connection.updateConnection();
        setIsInForegroundSt(true);
        if (isConnectedToInternetSt) {
            requests.updateTable({ id: userNameSt, table: 'users', state: 'foreground' });
        }
    }, [setIsInForegroundSt, userNameSt, leaderSt, isConnectedToInternetSt]);

    const onPause = useCallback(async (e) => {
        console.log('To Background, the leader is:', leaderSt);
        setIsInForegroundSt(false);
        if (isConnectedToInternetSt) {
            requests.updateTable({ id: userNameSt, table: 'users', state: 'background' });
        }
    }, [isConnectedToInternetSt, setIsInForegroundSt, userNameSt, leaderSt]);

    const onVisibilityChange = useCallback(() => {
        if (document.visibilityState === 'visible') {
            onResume();
        } else {
            onPause();
        }
    }, [onPause, onResume]);

    const init = useCallback(async (isApp) => {
        const userName = localStorage.getItem('user-name');
        const userDevice = localStorage.getItem('user-device');
        if (isApp) {
            await CordovaPlugins.getPermissions();
            await CordovaPlugins.startWifiNameListener(connection.onWifiNameChange);
            await CordovaPlugins.startNetworkTypeListener(connection.onNetworkTypeChange);
        }

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

    // 5. Initialisation logic (ran once during first render pass)
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

    // 6. Effects
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

    return {
        isReadySt,
        themeSt,
        isConnectedToInternetSt,
        userTypeSt,
        wifiNameSt
    };
}
