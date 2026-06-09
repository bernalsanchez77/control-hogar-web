import { store } from '../../store/store';
import CordovaPlugins from '../cordova-plugins';
import requests from '../requests';

const external = async (oldItem, newItem, eventType) => {
    if (newItem.mute !== oldItem.mute) {
        requests.sendIfttt({ device: newItem.id, key: 'mute', value: newItem.mute });
    } else if (newItem.volume !== oldItem.volume) {
        if (newItem.volume > oldItem.volume) {
            requests.sendIfttt({ device: newItem.id, key: 'volume', value: 'up' + 1 });
        } else {
            requests.sendIfttt({ device: newItem.id, key: 'volume', value: 'down' + 1 });
        }
    } else if (newItem.state !== oldItem.state) {
        requests.sendIfttt({ device: newItem.id, key: 'state', value: newItem.state });
    } else if (newItem.input !== oldItem.input) {
        requests.sendIfttt({ device: newItem.id, key: 'input', value: newItem.input });
    } else {
        requests.sendIfttt({ device: newItem.id, key: 'volume', value: 'down' + 1 });
    }
};

const internal = (oldItem, newItem, eventType) => {
    if (store.getState().isAppSt) {
        CordovaPlugins.updateScreenState(newItem.state);
        CordovaPlugins.updateMuteState(newItem.mute);
    }
};

const handleScreens = {
    external,
    internal
};

export default handleScreens;
