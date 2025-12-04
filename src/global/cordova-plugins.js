let firstWifiSsidChange = true;
let firstNetworkTypeChange = true;
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

  async startWifiNameListener(onWifiNameChange) {
    window.cordova.plugins.netinfo.startSSIDListener(
      async (info) => {
        if (!firstWifiSsidChange) {
          onWifiNameChange(info.ssid.replace(/"/g, '').trim());
        }
        firstWifiSsidChange = false;
      },
      (err) => console.error('ssid listener error:', err)
    );
  }

  async startNetworkTypeListener(onNetworkTypeChange) {
    window.cordova.plugins.networkinfo.startNetworkTypeListener(
      async (info) => {
        if (!firstNetworkTypeChange) {
          onNetworkTypeChange(info.networkType.replace(/"/g, '').trim());
        }
        firstNetworkTypeChange = false;
      },
      (err) => console.error('SSID listener error:', err)
    );
  }

  async getWifiName() {
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
