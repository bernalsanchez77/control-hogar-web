// import Utils from './utils';
// const utils = new Utils();
// let ssid = '';
// let networkTypeDebounceTimer;
// let ssidDebounceTimer;
class CordovaPlugins {
  async getPermissions() {
    var permissions = window.cordova.plugins.permissions;
    await permissions.requestPermission(
      permissions.ACCESS_FINE_LOCATION,
      async (status) => {
        if (status.hasPermission) {
          await permissions.requestPermission(
            permissions.POST_NOTIFICATIONS,
            async (status) => {
              if (status.hasPermission) {
                let backgroundInterval = null;
                window.cordova.plugins.backgroundMode.setDefaults({silent: true});
                window.cordova.plugins.backgroundMode.enable();
                window.cordova.plugins.backgroundMode.on('activate', function () {
                  window.cordova.plugins.backgroundMode.disableWebViewOptimizations();
                  if (!backgroundInterval) {
                    backgroundInterval = setInterval(function () {
                      console.log('Running in background...');
                    }, 60000);
                  }
                });
                window.cordova.plugins.backgroundMode.on('deactivate', function () {
                  if (backgroundInterval) {
                    clearInterval(backgroundInterval);
                    backgroundInterval = null;
                  }
                });
                await window.cordova.plugins.foregroundFunctionality.startService(function(msg) {}, function(err) {});
              } else {
                console.log('no notification permission');
                return false;
              }
            }
          );
        } else {
          console.log('no location permission');
          return false;
        }
      },
      async () => {console.error("Permission request failed");}
    );
  }

  async startSsidListener(onSSidChange) {
    window.cordova.plugins.netinfo.startSSIDListener(
      async (info) => {
        onSSidChange(info.ssid.replace(/"/g, '').trim());
      },
      (err) => console.error('ssid listener error:', err)
    );
  }

  async startNetworkTypeListener(onNetworkTypeChange) {
    window.cordova.plugins.networkinfo.startNetworkTypeListener(
      async (info) => {
        onNetworkTypeChange(info.networkType.replace(/"/g, '').trim());
      },
      (err) => console.error('SSID listener error:', err)
    );
  }

  // async startSsidListener(setWifiSsid) {
  //   window.cordova.plugins.netinfo.startSSIDListener(
  //     async (info) => {
  //       clearTimeout(ssidDebounceTimer);
  //       ssidDebounceTimer = setTimeout(() => {
  //         const cleanedSsid = info.ssid.replace(/"/g, '').trim();
  //         console.log('ssid listener (debounced):', cleanedSsid);

  //         if (
  //           cleanedSsid &&
  //           cleanedSsid !== 'unknown-wifi' &&
  //           cleanedSsid !== ssid
  //         ) {
  //           ssid = cleanedSsid;
  //           setWifiSsid(cleanedSsid);
  //         }
  //       }, 1000);
  //     },
  //     (err) => console.error('ssid listener error:', err)
  //   );
  // }

  // async startNetworkTypeListener(setWifiSsid) {
  //   window.cordova.plugins.networkinfo.startNetworkTypeListener(
  //     async (info) => {
  //       clearTimeout(networkTypeDebounceTimer);
  //       networkTypeDebounceTimer = setTimeout(() => {
  //         const networkType = info.networkType.replace(/"/g, '').trim();
  //         console.log('network listener (debounced):', networkType);

  //         if (networkType === 'cellular') {
  //           ssid = networkType;
  //           setWifiSsid('cellular');
  //         } else if (networkType === 'none') {
  //           ssid = networkType;
  //           setWifiSsid('none');
  //         }
  //       }, 1000);
  //     },
  //     (err) => console.error('SSID listener error:', err)
  //   );
  // }

  async getWifiSSID() {
    let wifiSsid = null;
    await window.cordova.plugins.netinfo.getSSID().then((ssid) => {
      wifiSsid = ssid;
    }).catch((err) => {
      console.error("Error getting SSID:", err);
    });
    // await window.cordova.plugins.netinfo.getIp().then((ip) => {
    //   // console.log(ip);
    // }).catch((err) => {
    //   console.error("Error getting Api:", err);
    // });
    return wifiSsid.replace(/"/g, '').trim();
  }
  async getNetworkType() {
    let networkType = null;
    await window.cordova.plugins.networkinfo.getNetworkType().then((type) => {
      networkType = type;
    }).catch((err) => {
      console.error("Error getting network type:", err);
    });
    return networkType.replace(/"/g, '').trim();
  }
}
const cordovaPlugins = new CordovaPlugins();
export default cordovaPlugins;
