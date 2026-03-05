import { store } from '../../store/store';
import CordovaPlugins from '../cordova-plugins';
import requests from '../requests';


export const handleScreensChange = async (oldItem, newItem, eventType) => {
    if (newItem.mute !== oldItem?.mute) {
        requests.sendIfttt({ device: newItem.id, key: 'mute', value: newItem.mute });
    }
    if (store.getState().isAppSt) {
        CordovaPlugins.updateScreenState(newItem.state);
        CordovaPlugins.updateMuteState(newItem.mute);
    }
};
