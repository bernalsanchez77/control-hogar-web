import Utils from './utils';
const utils = new Utils();
let wifiSsid = '';
let networkType = '';
let setWifiSsid = null;
let setNetworkType = null;
let setInternet = null;
class CordovaPlugins {
  async getPermissions(setWifiSsidParam, setNetworkTypeParam, setInternetParam) {
    setWifiSsid = setWifiSsidParam;
    setNetworkType = setNetworkTypeParam;
    setInternet = setInternetParam;
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
                // wifiSsid = await this.getWifiSSID();
                // setWifiSsid(wifiSsid);
                // console.log('ssid on deviceready:', wifiSsid);
                // networkType = await this.getNetworkType();
                // setNetworkType(networkType);
                // console.log('network type on deviceready:', networkType);
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

  async startSsidListener(ssidParam) {
    window.cordova.plugins.netinfo.startSSIDListener(
      async (info) => {
        info.ssid = info.ssid.replace(/"/g, '').trim();
        if (info.ssid && info.ssid !== ssidParam) {
          console.log('ssid changed:', info.ssid);
          wifiSsid = info.ssid;
          setTimeout(async() => {
            setWifiSsid(info.ssid);
            const internetConnection = await utils.checkInternet();
            if (internetConnection) {
              console.log('Internet connected by plugin ssid change');
              setInternet(true);
            } else {
              console.log('No internet by plugin ssid change');
              setInternet(false);
            }
          }, 5000);
        } else {
          // console.log('fallo de ssid changed', info);
        }
      },
      (err) => console.error('ssid listener error:', err)
    );
  }

  async startNetworkTypeListener(networkTypeParam) {
    window.cordova.plugins.networkinfo.startNetworkTypeListener(
      async (info) => {
        info.networkType = info.networkType.replace(/"/g, '').trim();
        if (info.networkType && info.networkType !== networkTypeParam) {
          console.log('network type changed:', info.networkType);
          networkType = info.networkType;
          setTimeout(async() => {
            setNetworkType(info.networkType);
            const internetConnection = await utils.checkInternet();
            if (internetConnection) {
              console.log('Internet connected by plugin network type change');
              setInternet(true);
            } else {
              console.log('No internet by plugin network type change');
              setInternet(false);
            }
          }, 5000);
        } else {
          // console.log('fallo de network type changed', info);
        }
      },
      (err) => console.error('SSID listener error:', err)
    );
  }

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
