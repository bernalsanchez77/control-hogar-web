
import { store } from '../store/store';
import CordovaPlugins from './cordova-plugins';
import requests from './requests';
import tables from './tables';

class Connection {
  constructor() {
    this.isConnectedToInternetInterval = null;
    this.netChangeRunning = false;
    this.temporalNetworkType = '';
    this.temporalWifiName = '';
    this.wifiNameChangeRunning = false;
    this.networkTypeChangeRunning = false;
  }
  async stopListeners() {
    if (store.getState().isAppSt) {
      await CordovaPlugins.stopWifiNameListener();
      await CordovaPlugins.stopNetworkTypeListener();
    }
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
          await this.stopListeners();
          window.location.reload();
          // console.log('Internet connected by interval');
          // clearInterval(this.isConnectedToInternetInterval);
          // this.isConnectedToInternetInterval = null;
          // const isAppSt = store.getState().isAppSt;
          // if (isAppSt) {
          //   wifiName = await CordovaPlugins.getWifiName();
          //   networkType = await CordovaPlugins.getNetworkType();
          // }
          // const isPcSt = store.getState().isPcSt;
          // store.getState().setWifiNameSt(isPcSt ? 'Noky' : wifiName);
          // store.getState().setNetworkTypeSt(isPcSt ? 'wifi' : networkType);
          // store.getState().setIsConnectedToInternetSt(true);
          // store.getState().setIsConnectedToNokySt(isPcSt ? true : wifiName === 'Noky' && networkType === 'wifi');
          // setTimeout(async () => {
          //   store.getState().setIsLoadingSt(true);
          //   await new Promise((resolve) => {
          //     const unsubscribe = store.subscribe((state) => {
          //       if (!state.isLoadingSt) {
          //         if (unsubscribe) unsubscribe();
          //         resolve();
          //       }
          //     });
          //   });
          //   tables.updateUserDevicesTable(true);
          // }, 1000);
        } else {
          console.log('No internet by interval');
        }
      }, 5000);
    }
  }
  async onNetworkTypeChange(netType) {
    this.networkTypeChangeRunning = true;
    console.log('changed in network type: ', netType);
    setTimeout(async () => {
      await this.stopListeners();
      window.location.reload();
    }, 5000);
    // this.temporalNetworkType = netType;
    // // temporal
    // await this.updateConnection();
    // tables.updateUserDevicesTable(true);
    // // end temporal
    // setTimeout(async () => {
    //   if (this.temporalNetworkType !== 'wifi') {
    //     store.getState().setWifiNameSt('');
    //   }
    //   store.getState().setNetworkTypeSt(this.temporalNetworkType);
    //   store.getState().setIsConnectedToNokySt(this.temporalWifiName === 'Noky' && this.temporalNetworkType === 'wifi');
    //   if (this.wifiNameChangeRunning !== this.networkTypeChangeRunning && store.getState().isConnectedToInternetSt) {
    //     store.getState().setIsLoadingSt(true);
    //     await new Promise((resolve) => {
    //       const unsubscribe = store.subscribe((state) => {
    //         if (!state.isLoadingSt) {
    //           if (unsubscribe) unsubscribe();
    //           resolve();
    //         }
    //       });
    //     });
    //     // tables.updateUserDevicesTable(true);
    //   }
    //   this.networkTypeChangeRunning = false;
    // }, 2000);

    // if (store.getState().userTypeSt === 'guest') {
    //   if (netType === 'wifi' && store.getState().wifiNameSt === 'Noky') {
    //     if (!this.netChangeRunning) {
    //       this.netChangeRunning = true;
    //       setTimeout(async () => {
    //         const internetConnection = await this.getIsConnectedToInternet();
    //         if (internetConnection) {
    //         } else {
    //           console.log('no internet detected by network type change, nointernet interval started');
    //           this.onNoInternet();
    //         }
    //         this.netChangeRunning = false;
    //       }, 5000);
    //     }
    //   }
    // }
  }
  async onWifiNameChange(wifiName) {
    this.wifiNameChangeRunning = true;
    console.log('changed in ssid: ', wifiName);
    setTimeout(async () => {
      await this.stopListeners();
      window.location.reload();
    }, 5000);
    // this.temporalWifiName = wifiName;
    // const isInForeground = store.getState().isInForegroundSt;
    // // temporal
    // await this.updateConnection();
    // tables.updateUserDevicesTable(true);
    // // end temporal
    // setTimeout(async () => {
    //   if (isInForeground) {
    //     store.getState().setWifiNameSt(this.temporalWifiName);
    //     store.getState().setNetworkTypeSt(this.temporalNetworkType);
    //     store.getState().setIsConnectedToNokySt(this.temporalWifiName === 'Noky' && this.temporalNetworkType === 'wifi');
    //     if (this.wifiNameChangeRunning !== this.networkTypeChangeRunning && store.getState().isConnectedToInternetSt) {
    //       store.getState().setIsLoadingSt(true);
    //       await new Promise((resolve) => {
    //         const unsubscribe = store.subscribe((state) => {
    //           if (!state.isLoadingSt) {
    //             if (unsubscribe) unsubscribe();
    //             resolve();
    //           }
    //         });
    //       });
    //       // tables.updateUserDevicesTable(true);
    //     }
    //   } else {
    //     const rokuData = await requests.getRokuData('active-app');
    //     if (rokuData) {
    //       console.log('There is Roku data 1');
    //       store.getState().setWifiNameSt('Noky');
    //       store.getState().setNetworkTypeSt(this.temporalNetworkType);
    //       store.getState().setIsConnectedToNokySt(true);
    //       if (this.wifiNameChangeRunning !== this.networkTypeChangeRunning && store.getState().isConnectedToInternetSt) {
    //         store.getState().setIsLoadingSt(true);
    //         await new Promise((resolve) => {
    //           const unsubscribe = store.subscribe((state) => {
    //             if (!state.isLoadingSt) {
    //               if (unsubscribe) unsubscribe();
    //               resolve();
    //             }
    //           });
    //         });
    //         // tables.updateUserDevicesTable(true);
    //       }
    //     } else {
    //       console.log('There is no Roku data 1');
    //       setTimeout(async () => {
    //         const rokuData = await requests.getRokuData('active-app');
    //         store.getState().setNetworkTypeSt(this.temporalNetworkType);
    //         if (rokuData) {
    //           console.log('There is Roku data 2');
    //           store.getState().setWifiNameSt('Noky');
    //           store.getState().setIsConnectedToNokySt(true);
    //         } else {
    //           console.log('There is no Roku data 2');
    //           store.getState().setWifiNameSt('unknown-wifi');
    //           store.getState().setIsConnectedToNokySt(false);
    //         }
    //         if (this.wifiNameChangeRunning !== this.networkTypeChangeRunning && store.getState().isConnectedToInternetSt) {
    //           store.getState().setIsLoadingSt(true);
    //           await new Promise((resolve) => {
    //             const unsubscribe = store.subscribe((state) => {
    //               if (!state.isLoadingSt) {
    //                 if (unsubscribe) unsubscribe();
    //                 resolve();
    //               }
    //             });
    //           });
    //           // tables.updateUserDevicesTable(true);
    //         }
    //       }, 2000);
    //     }
    //   }
    //   this.wifiNameChangeRunning = false;
    // }, 2000);

    // if (store.getState().userTypeSt === 'guest') {
    //   if (wifiName === 'Noky' && store.getState().networkTypeSt === 'wifi') {
    //     if (!this.netChangeRunning) {
    //       this.netChangeRunning = true;
    //       setTimeout(async () => {
    //         const internetConnection = await this.getIsConnectedToInternet();
    //         if (internetConnection) {
    //         } else {
    //           console.log('no internet detected by ssid change, nointernet interval started');
    //           this.onNoInternet();
    //         }
    //         this.netChangeRunning = false;
    //       }, 5000);
    //     }
    //   }
    // }
  }
  async updateConnection() {
    const isAppSt = store.getState().isAppSt;
    const isPcSt = store.getState().isPcSt;
    const isConnectedToInternet = await this.getIsConnectedToInternet();
    let wifiName = isAppSt ? await CordovaPlugins.getWifiName() : '';
    setTimeout(() => {
      console.log('visibilityState', document.visibilityState === 'visible');
    }, 8000);
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
