
import { store } from '../store/store';
import CordovaPlugins from './cordova-plugins';
import requests from './requests';

class Connection {
  constructor() {
    this.isConnectedToInternetInterval = null;
    this.netChangeRunning = false;
    this.temporalNetworkType = '';
    this.temporalWifiName = '';
    this.wifiNameChangeRunning = false;
    this.networkTypeChangeRunning = false;
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
          const isPcSt = store.getState().isPcSt;
          store.getState().setWifiNameSt(isPcSt ? 'Noky' : wifiName);
          store.getState().setNetworkTypeSt(isPcSt ? 'wifi' : networkType);
          store.getState().setIsConnectedToInternetSt(true);
          store.getState().setIsConnectedToNokySt(isPcSt ? true : wifiName === 'Noky' && networkType === 'wifi');
          setTimeout(async () => {
            store.getState().setIsLoadingSt(true);
            await new Promise((resolve) => {
              const unsubscribe = store.subscribe((state) => {
                if (!state.isLoadingSt) {
                  if (unsubscribe) unsubscribe();
                  resolve();
                }
              });
            });
            this.updateTable(true);
          }, 1000);
        } else {
          console.log('No internet by interval');
        }
      }, 5000);
    }
  }
  async onNetworkTypeChange(netType) {
    this.networkTypeChangeRunning = true;
    console.log('changed in network type: ', netType);
    this.temporalNetworkType = netType;
    setTimeout(async () => {
      if (this.temporalNetworkType !== 'wifi') {
        store.getState().setWifiNameSt('');
      }
      store.getState().setNetworkTypeSt(this.temporalNetworkType);
      store.getState().setIsConnectedToNokySt(this.temporalWifiName === 'Noky' && this.temporalNetworkType === 'wifi');
      if (this.wifiNameChangeRunning !== this.networkTypeChangeRunning && store.getState().isConnectedToInternetSt) {
        store.getState().setIsLoadingSt(true);
        await new Promise((resolve) => {
          const unsubscribe = store.subscribe((state) => {
            if (!state.isLoadingSt) {
              if (unsubscribe) unsubscribe();
              resolve();
            }
          });
        });
        this.updateTable();
      }
      this.networkTypeChangeRunning = false;
    }, 2000);

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
  }
  async onWifiNameChange(wifiName) {
    this.wifiNameChangeRunning = true;
    console.log('changed in ssid: ', wifiName);
    this.temporalWifiName = wifiName;
    const isInForeground = store.getState().isInForegroundSt;
    setTimeout(async () => {
      if (isInForeground) {
        store.getState().setWifiNameSt(this.temporalWifiName);
        store.getState().setNetworkTypeSt(this.temporalNetworkType);
        store.getState().setIsConnectedToNokySt(this.temporalWifiName === 'Noky' && this.temporalNetworkType === 'wifi');
        if (this.wifiNameChangeRunning !== this.networkTypeChangeRunning && store.getState().isConnectedToInternetSt) {
          store.getState().setIsLoadingSt(true);
          await new Promise((resolve) => {
            const unsubscribe = store.subscribe((state) => {
              if (!state.isLoadingSt) {
                if (unsubscribe) unsubscribe();
                resolve();
              }
            });
          });
          this.updateTable();
        }
      } else {
        const rokuData = await requests.getRokuData('active-app');
        if (rokuData) {
          store.getState().setWifiNameSt('Noky');
          store.getState().setNetworkTypeSt(this.temporalNetworkType);
          store.getState().setIsConnectedToNokySt(true);
          if (this.wifiNameChangeRunning !== this.networkTypeChangeRunning && store.getState().isConnectedToInternetSt) {
            store.getState().setIsLoadingSt(true);
            await new Promise((resolve) => {
              const unsubscribe = store.subscribe((state) => {
                if (!state.isLoadingSt) {
                  if (unsubscribe) unsubscribe();
                  resolve();
                }
              });
            });
            this.updateTable();
          }
        } else {
          store.getState().setWifiNameSt('');
          store.getState().setNetworkTypeSt(this.temporalNetworkType);
          store.getState().setIsConnectedToNokySt(false);
          if (this.wifiNameChangeRunning !== this.networkTypeChangeRunning && store.getState().isConnectedToInternetSt) {
            store.getState().setIsLoadingSt(true);
            await new Promise((resolve) => {
              const unsubscribe = store.subscribe((state) => {
                if (!state.isLoadingSt) {
                  if (unsubscribe) unsubscribe();
                  resolve();
                }
              });
            });
            this.updateTable();
          }
          setTimeout(async () => {
            const rokuData = await requests.getRokuData('active-app');
            if (rokuData) {
              store.getState().setWifiNameSt('Noky');
              store.getState().setNetworkTypeSt(this.temporalNetworkType);
              store.getState().setIsConnectedToNokySt(true);
              if (this.wifiNameChangeRunning !== this.networkTypeChangeRunning && store.getState().isConnectedToInternetSt) {
                store.getState().setIsLoadingSt(true);
                await new Promise((resolve) => {
                  const unsubscribe = store.subscribe((state) => {
                    if (!state.isLoadingSt) {
                      if (unsubscribe) unsubscribe();
                      resolve();
                    }
                  });
                });
                this.updateTable();
              }
            } else {
              store.getState().setWifiNameSt('');
              store.getState().setNetworkTypeSt(this.temporalNetworkType);
              store.getState().setIsConnectedToNokySt(false);
              if (this.wifiNameChangeRunning !== this.networkTypeChangeRunning && store.getState().isConnectedToInternetSt) {
                store.getState().setIsLoadingSt(true);
                await new Promise((resolve) => {
                  const unsubscribe = store.subscribe((state) => {
                    if (!state.isLoadingSt) {
                      if (unsubscribe) unsubscribe();
                      resolve();
                    }
                  });
                });
                this.updateTable();
              }
            }
          }, 2000);
        }
      }
      this.wifiNameChangeRunning = false;
    }, 2000);

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
  }
  async updateConnection() {
    const isAppSt = store.getState().isAppSt;
    const isPcSt = store.getState().isPcSt;
    const isConnectedToInternet = await this.getIsConnectedToInternet();
    const wifiName = isAppSt ? await CordovaPlugins.getWifiName() : '';
    const networkType = isAppSt ? await CordovaPlugins.getNetworkType() : '';
    store.getState().setWifiNameSt(isPcSt ? localStorage.getItem('wifi-name') : wifiName);
    store.getState().setNetworkTypeSt(isPcSt ? localStorage.getItem('network-type') : networkType);
    store.getState().setIsConnectedToNokySt(isPcSt ? localStorage.getItem('wifi-name') === 'Noky' && localStorage.getItem('network-type') === 'wifi' : wifiName === 'Noky' && networkType === 'wifi');
    store.getState().setIsConnectedToInternetSt(isConnectedToInternet);
  }

  updateTable(newDate) {
    requests.updateTable({
      id: store.getState().userNameDeviceSt,
      table: 'userDevices',
      date: newDate ? new Date().toISOString() : store.getState().userDevicesSt.find(el => el.id === store.getState().userNameDeviceSt)?.date,
      isInForeground: store.getState().isInForegroundSt,
      isConnectedToNoky: store.getState().isConnectedToNokySt,
      isConnectedToInternet: store.getState().isConnectedToInternetSt
    });
  }
}
const connection = new Connection();
export default connection;
