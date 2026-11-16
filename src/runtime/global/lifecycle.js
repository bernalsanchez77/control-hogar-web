import { store } from '../../store/store';
import requests from '../../global/globalRequests';
import utils from '../../utils/utils';
import BackgroundService from '../global/backgroundService';

class Lifecycle {
    updateUserDevicesTable() {
        requests.updateTable({
            id: store.getState().userNameDevicesSt,
            table: 'userDevices',
            date: store.getState().userDevicesSt.find(el => el.id === store.getState().userNameDevicesSt).date,
            isInForeground: store.getState().isInForegroundSt,
            isConnectedToNoky: store.getState().isConnectedToNokySt,
            wifiName: store.getState().wifiNameSt,
            networkType: store.getState().networkTypeSt,
            isInPresence: store.getState().isInPresenceSt,
            screenSelected: store.getState().screenSelectedSt,
            isConnectedToInternet: true,
            initDate: store.getState().userDevicesSt.find(el => el.id === store.getState().userNameDevicesSt).date,
        });
    }

    async updateConnection() {
        const isAppSt = store.getState().isAppSt;
        const isPcSt = store.getState().isPcSt;
        const isConnectedToInternet = await utils.getIsConnectedToInternet();
        let wifiName = isAppSt ? await BackgroundService.getWifiName() : '';
        if (wifiName === 'unknown-wifi') {
            const rokuData = await requests.getRokuData('active-app');
            if (rokuData) {
                wifiName = 'Noky';
            }
        }
        const networkType = isAppSt ? await BackgroundService.getNetworkType() : '';
        store.getState().setWifiNameSt(isPcSt ? localStorage.getItem('wifi-name') : wifiName);
        store.getState().setNetworkTypeSt(isPcSt ? localStorage.getItem('network-type') : networkType);
        store.getState().setIsConnectedToNokySt(isPcSt ? localStorage.getItem('wifi-name') === 'Noky' && localStorage.getItem('network-type') === 'wifi' : wifiName === 'Noky' && networkType === 'wifi');
        store.getState().setIsConnectedToInternetSt(isConnectedToInternet);
    };

    onResume = async () => {
        console.log('To Foreground');
        store.getState().setIsInForegroundSt(true);


        await this.updateConnection();


        if (store.getState().networkTypeSt === 'wifi' && (store.getState().wifiNameSt === 'unknown-wifi' || store.getState().wifiNameSt === '')) {
            console.log('unknown-wifi, updating connection');
            await this.updateConnection();
        }
        if (store.getState().isConnectedToInternetSt) {
            if (store.getState().userNameDevicesSt) {
                if (store.getState().isLoadingSt) {
                    store.getState().setIsLoadingSt(false);
                }
                store.getState().setIsLoadingSt(true);
                await new Promise((resolve) => {
                    const unsubscribe = store.subscribe((currentState) => {
                        if (!currentState.isLoadingSt) {
                            if (unsubscribe) unsubscribe();
                            resolve();
                        }
                    });
                });
                this.updateUserDevicesTable();
            }
        }
    }

    onPause = async () => {
        console.log('To Background');
        store.getState().setIsInForegroundSt(false);
        store.getState().setIsLoadingMessageShowingSt(true);
        if (store.getState().isConnectedToInternetSt && store.getState().userNameDevicesSt) {
            this.updateUserDevicesTable();
        }
    }

    onVisibilityChange = async () => {
        if (document.visibilityState === 'visible') {
            this.onResume();
        } else {
            this.onPause();
        }
    }

    startEventListeners() {
        if (store.getState().isAppSt) {
            document.addEventListener("pause", this.onPause);
            document.addEventListener("resume", this.onResume);
        } else {
            document.addEventListener('visibilitychange', this.onVisibilityChange);
        }
    }
    async onNoInternet() {
        if (!store.getState().isConnectedToInternetIntervalSt) {
            console.log('internet interval started');
            let wifiName = '';
            let networkType = '';
            store.getState().setWifiNameSt(wifiName);
            store.getState().setNetworkTypeSt(networkType);
            store.getState().setIsConnectedToInternetSt(false);
            store.getState().setIsConnectedToNokySt(false);
            store.getState().setIsConnectedToInternetIntervalSt(setInterval(async () => {
                const isConnectedToInternet = await utils.getIsConnectedToInternet();
                if (isConnectedToInternet) {
                    store.getState().setIsConnectedToInternetSt(true);
                    requests.updateTable({
                        id: store.getState().userNameDevicesSt,
                        table: 'userDevices',
                        date: store.getState().userDevicesSt.find(el => el.id === store.getState().userNameDevicesSt).date,
                        isInForeground: store.getState().isInForegroundSt,
                        isConnectedToNoky: store.getState().isConnectedToNokySt,
                        wifiName: store.getState().wifiNameSt,
                        networkType: store.getState().networkTypeSt,
                        isInPresence: store.getState().isInPresenceSt,
                        screenSelected: store.getState().screenSelectedSt,
                        isConnectedToInternet: false,
                        initDate: store.getState().userDevicesSt.find(el => el.id === store.getState().userNameDevicesSt).date,
                    });
                } else {
                    console.log('No internet by interval');
                }
            }, 5000));
        }
    };
}

const lifecycle = new Lifecycle();
export default lifecycle;
