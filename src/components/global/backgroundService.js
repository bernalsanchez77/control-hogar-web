class BackgroundService {
  async stopWifiNameListener() {
    return new Promise((resolve) => {
      if (window.cordova.plugins.netinfo.stopSSIDListener) {
        window.cordova.plugins.netinfo.stopSSIDListener(resolve, resolve);
      } else {
        resolve();
      }
    });
  }
  async stopNetworkTypeListener() {
    return new Promise((resolve) => {
      if (window.cordova.plugins.networkinfo.stopNetworkTypeListener) {
        window.cordova.plugins.networkinfo.stopNetworkTypeListener(resolve, resolve);
      } else {
        resolve();
      }
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
const backgroundService = new BackgroundService();
export default backgroundService;
