class Statusbar {
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
}
const statusbar = new Statusbar();
export default statusbar;
