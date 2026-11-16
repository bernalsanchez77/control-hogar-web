import { store } from '../../../store/store';
import requests from '../../global/runtimeRequests';
import roku from '../../global/roku';
import Statusbar from '../../global/statusbar';

const external = async (oldItem, newItem, eventType) => {
    if (newItem.table === 'playState') {
        if (store.getState().isConnectedToNokySt) {
            const rokuPlayState = await roku.getPlayState('state');
            if (rokuPlayState && rokuPlayState !== newItem.id) {
                const rokuValue = newItem.id.charAt(0).toUpperCase() + newItem.id.slice(1);
                requests.fetchRoku({ key: 'keypress', value: rokuValue });
            }
        } else {
            requests.sendIfttt({ device: 'rokuSala', key: 'command', value: newItem.id });
        }
        if (newItem.table === 'rev' || newItem.table === 'fwd') {
            const rokuValue = newItem.table.charAt(0).toUpperCase() + newItem.table.slice(1);
            if (store.getState().wifiNameSt === 'Noky') {
                requests.fetchRoku({ key: 'keydown', value: rokuValue });
            } else {
                requests.sendIfttt({ device: 'rokuSala', key: 'command', value: newItem.table });
            }
        }
    }
};

const internal = (oldItem, newItem, eventType) => {
    if (store.getState().isAppSt) {
        Statusbar.updatePlayState(newItem.id === 'play');
    }
};

const toolbarHandler = {
    external,
    internal
};

export default toolbarHandler;
