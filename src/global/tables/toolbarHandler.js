import { store } from '../../store/store';
import requests from '../requests';
import roku from '../roku';
import CordovaPlugins from '../cordova-plugins';

export const handleToolbarChange = async (oldItem, newItem, eventType, userNameDevice, leader) => {
    if (store.getState().isAppSt) {
        CordovaPlugins.updatePlayState(newItem.id === 'play');
    }
    if (userNameDevice === leader) {
        if (newItem.table === 'playState') {
            const rokuPlayState = await roku.getPlayState('state');
            if (rokuPlayState !== newItem.id) {
                if (store.getState().wifiNameSt === 'Noky') {
                    const rokuValue = newItem.id.charAt(0).toUpperCase() + newItem.id.slice(1);
                    requests.fetchRoku({ key: 'keypress', value: rokuValue });
                } else {
                    requests.sendIfttt({ device: 'rokuSala', key: 'command', value: newItem.id });
                }
            }
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
