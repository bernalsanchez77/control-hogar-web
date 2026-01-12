
import viewRouter from './view-router';
import { store } from '../store/store';
import requests from './requests';
import utils from './utils';
import roku from './roku';

class Events {
    async onNavigationBack(e) {
        e.preventDefault();
        await viewRouter.onNavigationBack(store.getState().viewSt);
    }
    onVolumeUp(e) {
        const screen = store.getState().screensSt.find(screen => screen.id === store.getState().screenSelectedSt);
        if (screen.state === 'on') {
            let newVol = 0;
            newVol = screen.volume + 1;
            requests.sendIfttt({ device: screen.id, key: 'volume', value: 'up' + 1 });
            requests.updateTable({
                new: { newId: screen.id, newTable: 'screens', newVolume: newVol }
            });
        }
    }
    onVolumeDown(e) {
        const screen = store.getState().screensSt.find(screen => screen.id === store.getState().screenSelectedSt);
        if (screen.state === 'on') {
            let newVol = 0;
            if (screen.volume !== 0) {
                if (screen.volume - 1 >= 0) {
                    newVol = screen.volume - 1;
                    requests.sendIfttt({ device: screen.id, key: 'volume', value: 'down' + 1 });
                    requests.updateTable({
                        new: { newId: screen.id, newTable: 'screens', newVolume: newVol }
                    });
                } else {
                    requests.sendIfttt({ device: screen.id, key: 'volume', value: 'down' + 1 });
                    requests.updateTable({
                        new: { newId: screen.id, newTable: 'screens', newVolume: '0' }
                    });
                }
            } else {
                requests.sendIfttt({ device: screen.id, key: 'volume', value: 'down' + 1 });
            }
        }
    }
    async onPlayStateChange() {
        utils.triggerVibrate();
        requests.fetchRoku({ key: 'keypress', value: 'Play' });
        if (store.getState().wifiNameSt === 'Noky') {
            roku.updatePlayState(1000);
        } else {
            const hdmiSalaSt = store.getState().hdmiSalaSt;
            const newPlayState = hdmiSalaSt.find(hdmi => hdmi.id === 'roku').playState === "play" ? "pause" : "play";
            requests.updateTable({
                new: { newId: hdmiSalaSt.find(hdmi => hdmi.id === 'roku').id, newTable: 'hdmiSala', newPlayState }
            });
        }
    }
}
const events = new Events();
export default events;
