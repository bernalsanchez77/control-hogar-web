
import viewRouter from './view-router';
import { store } from '../store/store';
import requests from './requests';

class Events {
    async onNavigationBack(e) {
        e.preventDefault();
        await viewRouter.onNavigationBack();
    }
    onVolumeUp(e) {
        const screen = store.getState().screensSt.find(screen => screen.id === store.getState().screenSelectedSt);
        if (screen.state === 'on') {
            let newVol = 0;
            newVol = screen.volume + 1;
            requests.sendIfttt({ device: screen.id, key: 'volume', value: 'up' + 1 });
            requests.updateTable({ id: screen.id, table: 'screens', volume: newVol });
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
                    requests.updateTable({ id: screen.id, table: 'screens', volume: newVol });
                } else {
                    requests.sendIfttt({ device: screen.id, key: 'volume', value: 'down' + 1 });
                    requests.updateTable({ id: screen.id, table: 'screens', volume: '0' });
                }
            } else {
                requests.sendIfttt({ device: screen.id, key: 'volume', value: 'down' + 1 });
            }
        }
    }
}
const events = new Events();
export default events;
