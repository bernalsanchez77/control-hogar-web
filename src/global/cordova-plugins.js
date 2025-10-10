class CordovaPlugins {
  async getPermissions(setWifiSsid, resume) {
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
                const wifiSsid = await this.getWifiSSID();
                setWifiSsid(wifiSsid);
                console.log('Current SSID on deviceready:', wifiSsid);
                window.cordova.plugins.netinfo.startSSIDListener(
                  (info) => {
                    info.ssid = info.ssid.replace(/"/g, '').trim();
                    if (info.ssid && info.ssid !== wifiSsid) {
                      console.log('SSID changed:', info.ssid);
                      setWifiSsid(info.ssid);
                      setTimeout(() => {
                        resume(info.ssid);
                      }, 5000);
                    }
                  },
                  (err) => console.error('SSID listener error:', err)
                );
                return wifiSsid;
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
    // await permissions.requestPermission(
    //   permissions.POST_NOTIFICATIONS,
    //   async (status) => {
    //     if (status.hasPermission) {
    //       setPostNotificationsPermision(true);

    //       if (window.cordova.plugins.backgroundMode) {
    //         window.cordova.plugins.backgroundMode.setDefaults({
    //           silent: true
    //         });

    //         // window.cordova.plugins.backgroundMode.setDefaults({
    //         //   title: 'My App',
    //         //   text: 'Running in background',
    //         //   icon: 'ic_notification', // from res/drawable
    //         //   color: 'F14F4D',
    //         //   hidden: true,
    //         //   bigText: false,
    //         // });

    //         window.cordova.plugins.backgroundMode.enable();
    //         let backgroundInterval = null;
    //         window.cordova.plugins.backgroundMode.on('activate', function () {
    //           window.cordova.plugins.backgroundMode.disableWebViewOptimizations();
    //           if (!backgroundInterval) {
    //             backgroundInterval = setInterval(function () {
    //               console.log('Still running in background...');
    //             }, 5000);
    //           }
    //         });
    //         window.cordova.plugins.backgroundMode.on('deactivate', function () {
    //           if (backgroundInterval) {
    //             clearInterval(backgroundInterval);
    //             backgroundInterval = null;
    //           }
    //         });
    //       }



    //       if (window.cordova.plugins.foregroundFunctionality) {
    //         await window.cordova.plugins.foregroundFunctionality.startService(
    //           function(msg) {},
    //           function(err) { console.error(err); }
    //         );
    //       }
    //       if (window.cordova.plugins.foregroundService) {
    //         // window.cordova.plugins.foregroundService.start(
    //         //   'Control Hogar 2',
    //         //   'La aplicación se está ejecutando en segundo plano'
    //         // );

    //         // window.cordova.plugins.foregroundService.start('Control Hogar final', 'Aplicacion en uso', 'ic_notification', 5, 1, true);

    //         // window.cordova.plugins.foregroundService.start(
    //         //   'My App',
    //         //   'Running in foreground',
    //         //   'icon',
    //         //   3,
    //         //   'my_foreground_service'
    //         // );

    //       }
    //     }
    //   },
    //   function () {console.error("Permission request failed");}
    // );
  }

  async getWifiSSID() {
    let wifiSsid = null;
    await window.cordova.plugins.netinfo.getSSID().then((ssid) => {
      wifiSsid = ssid;
    }).catch((err) => {
      console.error("Error getting SSID:", err);
    });
    await window.cordova.plugins.netinfo.getIp().then((ip) => {
      // console.log(ip);
    }).catch((err) => {
      console.error("Error getting Api:", err);
    });
    return wifiSsid.replace(/"/g, '').trim();
  }
}
const cordovaPlugins = new CordovaPlugins();
export default cordovaPlugins;
