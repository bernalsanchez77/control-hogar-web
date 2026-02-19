import { store } from '../../store/store';
import roku from '../roku';
import requests from '../requests';
import CordovaPlugins from '../cordova-plugins';

export const handlePlayStateChange = async (change, userName, leader) => {
    if (store.getState().isAppSt) {
        CordovaPlugins.updatePlayState(change.id === 'play');
    }
    if (userName === leader) {
        if (change.id) {
            const rokuPlayState = await roku.getPlayState('state');
            if (rokuPlayState !== change.id) {
                const rokuValue = change.id.charAt(0).toUpperCase() + change.id.slice(1);
                requests.fetchRoku({ key: 'keypress', value: rokuValue });
            }
        }
    }
};
