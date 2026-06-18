const LISTENER_DEBOUNCE_DELAY = 1000;
let firstWifiSsidChange = true;
let firstNetworkTypeChange = true;
let wifiNameDebounceTimer = null;
let networkTypeDebounceTimer = null;

class BackgroundService {
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
					clearTimeout(wifiNameDebounceTimer);
					wifiNameDebounceTimer = setTimeout(() => {
						onWifiNameChange(info.ssid.replace(/"/g, '').trim());
					}, LISTENER_DEBOUNCE_DELAY);
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
					clearTimeout(networkTypeDebounceTimer);
					networkTypeDebounceTimer = setTimeout(() => {
						onNetworkTypeChange(info.networkType.replace(/"/g, '').trim());
					}, LISTENER_DEBOUNCE_DELAY);
				}
				firstNetworkTypeChange = false;
			},
			(err) => console.error('SSID listener error:', err)
		);
	}

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
}
const backgroundService = new BackgroundService();
export default backgroundService;
