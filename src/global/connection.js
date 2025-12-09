
import { store } from '../store/store';
import utils from './utils';
import CordovaPlugins from './cordova-plugins';

class Connection {
  constructor() {
    this.isConnectedToInternetInterval = null;
    this.netChangeRunning = false;
  }
  async onNoInternet() {
    if (!this.isConnectedToInternetInterval) {
      console.log('internet interval started');
      let wifiName = '';
      let networkType = '';
      store.getState().setIsConnectedToInternetSt(false);
      this.isConnectedToInternetInterval = setInterval(async () => {
        const isConnectedToInternet = await utils.getIsConnectedToInternet();
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
        } else {
          console.log('No internet by interval');
        }
      }, 5000);
    }
  }
  async onNetworkTypeChange(netType) {
    console.log('changed in network type: ', netType);
    if (store.getState().userCredentialSt === 'guest') {
      if (netType === 'wifi' && store.getState().wifiNameSt === 'Noky') {
        if (!this.netChangeRunning) {
          this.netChangeRunning = true;
          setTimeout(async () => {
            const internetConnection = await utils.getIsConnectedToInternet();
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
    if (store.getState().userCredentialSt === 'guest') {
      if (wifiName === 'Noky' && store.getState().networkTypeSt === 'wifi') {
        if (!this.netChangeRunning) {
          this.netChangeRunning = true;
          setTimeout(async () => {
            const internetConnection = await utils.getIsConnectedToInternet();
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
}
const connection = new Connection();
export default connection;
