
import { store } from '../store/store';
import CordovaPlugins from './cordova-plugins';
import requests from './requests';
import tables from './tables';
import PeersChannel from './supabase/supabase-peers';
import SupabaseChannels from './supabase/supabase-channels';
import supabase from './supabase/supabase-client';

class Connection {
  constructor() {
    this.isConnectedToInternetInterval = null;
    this.netChangeRunning = false;
    this.temporalNetworkType = '';
    this.temporalWifiName = '';
    this.wifiNameChangeRunning = false;
    this.restartRunning = false;
  }
  async stopListeners() {
    if (store.getState().isAppSt) {
      await CordovaPlugins.stopWifiNameListener();
      await CordovaPlugins.stopNetworkTypeListener();
    }
  }
  async handleRestart() {
    if (this.restartRunning) return;
    this.restartRunning = true;

    if (this.isConnectedToInternetInterval) {
      clearInterval(this.isConnectedToInternetInterval);
      this.isConnectedToInternetInterval = null;
    }

    await this.stopListeners();
    PeersChannel.killPeersChannel();
    await SupabaseChannels.unsubscribeFromAllSupabaseChannels();
    supabase.realtime.disconnect();
    const bgFlag = !store.getState().isInForegroundSt ? '?isInBackground=true' : '';
    window.location.href = window.location.pathname + bgFlag;
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
          await this.handleRestart();
        } else {
          console.log('No internet by interval');
        }
      }, 5000);
    }
  }
  async onNetworkTypeChange(netType) {
    console.log('changed in network type: ', netType);
    setTimeout(async () => {
      await this.handleRestart();
    }, 5000);
  }
  async onWifiNameChange(wifiName) {
    console.log('changed in ssid: ', wifiName);
    setTimeout(async () => {
      await this.handleRestart();
    }, 5000);
  }
  async updateConnection() {
    const isAppSt = store.getState().isAppSt;
    const isPcSt = store.getState().isPcSt;
    const isConnectedToInternet = await this.getIsConnectedToInternet();
    let wifiName = isAppSt ? await CordovaPlugins.getWifiName() : '';
    if (wifiName === 'unknown-wifi') {
      const rokuData = await requests.getRokuData('active-app');
      if (rokuData) {
        wifiName = 'Noky';
      }
    }
    const networkType = isAppSt ? await CordovaPlugins.getNetworkType() : '';
    store.getState().setWifiNameSt(isPcSt ? localStorage.getItem('wifi-name') : wifiName);
    store.getState().setNetworkTypeSt(isPcSt ? localStorage.getItem('network-type') : networkType);
    store.getState().setIsConnectedToNokySt(isPcSt ? localStorage.getItem('wifi-name') === 'Noky' && localStorage.getItem('network-type') === 'wifi' : wifiName === 'Noky' && networkType === 'wifi');
    store.getState().setIsConnectedToInternetSt(isConnectedToInternet);
  }
}
const connection = new Connection();
export default connection;
