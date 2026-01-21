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
                window.cordova.plugins.backgroundMode.setDefaults({ silent: true });
                window.cordova.plugins.backgroundMode.enable();
                window.cordova.plugins.backgroundMode.on('activate', function () {
                  window.cordova.plugins.backgroundMode.disableWebViewOptimizations();
                  if (!backgroundInterval) {
                    backgroundInterval = setInterval(function () {
                    }, 60000);
                  }
                });
                window.cordova.plugins.backgroundMode.on('deactivate', function () {
                  if (backgroundInterval) {
                    clearInterval(backgroundInterval);
                    backgroundInterval = null;
                  }
                });
                await window.cordova.plugins.foregroundFunctionality.startService(function (msg) { }, function (err) { });
              } else {
                return false;
              }
            }
          );
        } else {
          return false;
        }
      },
      async () => { console.error("Permission request failed"); }
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

  async updatePlayState(isPlaying) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.foregroundFunctionality.updatePlayState(
        isPlaying,
        resolve,
        reject
      );
    });
  }

  async updateScreenSelected(screenSelected) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.foregroundFunctionality.updateScreenSelected(
        screenSelected,
        resolve,
        reject
      );
    });
  }

  async updateAppSelected(appSelected) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.foregroundFunctionality.updateAppSelected(
        appSelected,
        resolve,
        reject
      );
    });
  }

  async updateScreenState(screenState) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.foregroundFunctionality.updateScreenState(
        screenState === 'on' ? true : false,
        resolve,
        reject
      );
    });
  }

  async updateMuteState(muteState) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.foregroundFunctionality.updateMuteState(
        muteState === 'on' ? true : false,
        resolve,
        reject
      );
    });
  }

  async getWifiName() {
    let wifiSsid = null;
    await window.cordova.plugins.netinfo.getSSID().then((ssid) => {
      wifiSsid = ssid;
    }).catch((err) => {
      console.error("Error getting SSID:", err);
    });
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
