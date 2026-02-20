
import { store } from '../store/store';
import CordovaPlugins from './cordova-plugins';
import supabasePeers from './supabase/supabase-peers';

class Connection {
  constructor() {
    this.isConnectedToInternetInterval = null;
    this.netChangeRunning = false;
  }
  async getIsConnectedToInternet() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      // Use a small, reliable file
      await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        cache: "no-cache",
        signal: controller.signal,
      });

      clearTimeout(timeout);
      return true;
    } catch (err) {
      return false;
    }
  }
  async onNoInternet() {
    if (!this.isConnectedToInternetInterval) {
      console.log('internet interval started');
      let wifiName = '';
      let networkType = '';
      store.getState().setWifiNameSt(wifiName);
      store.getState().setNetworkTypeSt(networkType);
      store.getState().setIsConnectedToInternetSt(false);
      store.getState().setIsConnectedToNokySt(false);
      this.isConnectedToInternetInterval = setInterval(async () => {
        const isConnectedToInternet = await this.getIsConnectedToInternet();
        if (isConnectedToInternet) {
          console.log('Internet connected by interval');
          clearInterval(this.isConnectedToInternetInterval);
          this.isConnectedToInternetInterval = null;
          const isAppSt = store.getState().isAppSt;
          if (isAppSt) {
            wifiName = await CordovaPlugins.getWifiName();
            networkType = await CordovaPlugins.getNetworkType();
          }
          store.getState().setWifiNameSt(wifiName);
          store.getState().setNetworkTypeSt(networkType);
          store.getState().setIsConnectedToInternetSt(true);
          const isConnectedToNokySt = wifiName === 'Noky' && networkType === 'wifi';
          store.getState().setIsConnectedToNokySt(isConnectedToNokySt);
          if (supabasePeers.peersChannel.status === 'unsubscribed') {
            supabasePeers.subscribeToPeersChannel();
          }
        } else {
          console.log('No internet by interval');
        }
      }, 5000);
    }
  }
  async onNetworkTypeChange(netType) {
    console.log('changed in network type: ', netType);
    setTimeout(() => {
      if (store.getState().wifiNameSt !== '' && store.getState().networkTypeSt !== 'wifi') {
        store.getState().setWifiNameSt('');
      }
      setTimeout(() => {
        const wifiName = store.getState().wifiNameSt;
        const networkType = store.getState().networkTypeSt;
        const isConnectedToNokySt = wifiName === 'Noky' && networkType === 'wifi';
        store.getState().setIsConnectedToNokySt(isConnectedToNokySt);
      }, 1000);
    }, 1000);
    if (store.getState().userTypeSt === 'guest') {
      if (netType === 'wifi' && store.getState().wifiNameSt === 'Noky') {
        if (!this.netChangeRunning) {
          this.netChangeRunning = true;
          setTimeout(async () => {
            const internetConnection = await this.getIsConnectedToInternet();
            if (internetConnection) {
            } else {
              console.log('no internet detected by network type change, nointernet interval started');
              this.onNoInternet();
            }
            this.netChangeRunning = false;
          }, 5000);
        }
      }
    }
    store.getState().setNetworkTypeSt(netType);
  }
  async onWifiNameChange(wifiName) {
    console.log('changed in ssid: ', wifiName);
    setTimeout(() => {
      const wifiName = store.getState().wifiNameSt;
      const networkType = store.getState().networkTypeSt;
      const isConnectedToNokySt = wifiName === 'Noky' && networkType === 'wifi';
      store.getState().setIsConnectedToNokySt(isConnectedToNokySt);
    }, 1000);
    if (store.getState().userTypeSt === 'guest') {
      if (wifiName === 'Noky' && store.getState().networkTypeSt === 'wifi') {
        if (!this.netChangeRunning) {
          this.netChangeRunning = true;
          setTimeout(async () => {
            const internetConnection = await this.getIsConnectedToInternet();
            if (internetConnection) {
            } else {
              console.log('no internet detected by ssid change, nointernet interval started');
              this.onNoInternet();
            }
            this.netChangeRunning = false;
          }, 5000);
        }
      }
    }
    store.getState().setWifiNameSt(wifiName);
  }
  async updateConnection() {
    const isAppSt = store.getState().isAppSt;
    const isPcSt = store.getState().isPcSt;
    const isConnectedToInternet = await this.getIsConnectedToInternet();
    const wifiName = isAppSt ? await CordovaPlugins.getWifiName() : '';
    const networkType = isAppSt ? await CordovaPlugins.getNetworkType() : '';
    store.getState().setWifiNameSt(isPcSt ? 'Noky' : wifiName);
    store.getState().setNetworkTypeSt(isPcSt ? 'wifi' : networkType);
    store.getState().setIsConnectedToNokySt(isPcSt ? true : wifiName === 'Noky' && networkType === 'wifi');
    store.getState().setIsConnectedToInternetSt(isConnectedToInternet);
  }
}
const connection = new Connection();
export default connection;
