import { store } from '../../store/store';
import roku from '../roku';
import requests from '../requests';
import CordovaPlugins from '../cordova-plugins';

export const handlePlayStateChange = async (oldItem, newItem, eventType, userName, leader) => {
    if (store.getState().isAppSt) {
        CordovaPlugins.updatePlayState(newItem.id === 'play');
    }
    if (userName === leader) {
        if (newItem.id) {
            const rokuPlayState = await roku.getPlayState('state');
            if (rokuPlayState !== newItem.id) {
                const rokuValue = newItem.id.charAt(0).toUpperCase() + newItem.id.slice(1);
                requests.fetchRoku({ key: 'keypress', value: rokuValue });
            }
        }
    }
};
