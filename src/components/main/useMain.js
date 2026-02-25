import { useState, useCallback, useRef } from 'react';
import { store } from '../../store/store';
import utils from '../../global/utils';
import requests from '../../global/requests';
import connection from '../../global/connection';
import CordovaPlugins from '../../global/cordova-plugins';
import { useAppLifecycle } from '../../hooks/useAppLifecycle';

const user = utils.getUser(`${window.screen.width}x${window.screen.height}`);

export function useMain() {
    // 1. Store / Global State
    const themeSt = store(v => v.themeSt);
    const setThemeSt = store(v => v.setThemeSt);
    const userTypeSt = store(v => v.userTypeSt);
    const setUserTypeSt = store(v => v.setUserTypeSt);
    const setUserNameSt = store(v => v.setUserNameSt);
    const setUserDeviceSt = store(v => v.setUserDeviceSt);
    const setScreenSelectedSt = store(v => v.setScreenSelectedSt);
    const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
    const wifiNameSt = store(v => v.wifiNameSt);
    const setIsPcSt = store(v => v.setIsPcSt);
    const setIsAppSt = store(v => v.setIsAppSt);
    const setLizEnabledSt = store(v => v.setLizEnabledSt);

    // 2. Lifecycle management
    useAppLifecycle();

    // 3. Local State
    const [isReadySt, setIsReadySt] = useState(false);

    // 4. Refs
    const initializedRef = useRef(false);

    // 5. Callbacks / Functions
    const init = useCallback(async (isApp) => {
        console.log('init main');
        const userName = localStorage.getItem('user-name');
        const userDevice = localStorage.getItem('user-device');
        if (isApp) {
            await CordovaPlugins.getPermissions();
            await CordovaPlugins.startWifiNameListener((wifiName) => connection.onWifiNameChange(wifiName));
            await CordovaPlugins.startNetworkTypeListener((netType) => connection.onNetworkTypeChange(netType));
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

    // 6. Initialisation logic (ran once during first render pass)
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

    return {
        isReadySt,
        themeSt,
        isConnectedToInternetSt,
        userTypeSt,
        wifiNameSt
    };
}
