import { store } from "../../store/store";
import utils from '../../utils/utils';
import PeersChannel from '../../global/supabase/supabase-peers';
import SupabaseChannels from '../../global/supabase/supabase-channels';
import supabase from '../../global/supabase/supabase-client';
import requests from './requests';
import BackgroundService from "../global/backgroundService";


class Lifecycle {
    async handleRestart() {
        if (store.getState().isRestartingSt) return;
        store.getState().setIsLoadingMessageShowingSt(false);
        if (store.getState().isConnectedToInternetIntervalSt) {
            clearInterval(store.getState().isConnectedToInternetIntervalSt);
            store.getState().setIsConnectedToInternetIntervalSt(null);
        }
        if (store.getState().isAppSt) {
            await BackgroundService.stopWifiNameListener();
            await BackgroundService.stopNetworkTypeListener();
        }
        PeersChannel.killPeersChannel();
        await SupabaseChannels.unsubscribeFromAllSupabaseChannels();
        supabase.realtime.disconnect();
        const bgFlag = !store.getState().isInForegroundSt ? '?isInBackground=true' : '';
        store.getState().setIsRestartingSt(true);
        await new Promise((resolve) => {
            setTimeout(() => {
                window.location.href = window.location.pathname + bgFlag;
                resolve();
            }, 3000);
        });
    };

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
                    await this.handleRestart();
                } else {
                    console.log('No internet by interval');
                }
            }, 5000));
        }
    };
}

const lifecycle = new Lifecycle();
export default lifecycle;
