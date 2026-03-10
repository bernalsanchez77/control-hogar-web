import { store } from '../../store/store';
import requests from '../requests';
import youtube from '../youtube';
import CordovaPlugins from '../cordova-plugins';

export const handleRokuAppsChange = async (oldItem, newItem, eventType, userNameDevice, leader) => {
    store.getState().setRokuSearchModeSt('roku');
    if (userNameDevice === leader) {
        if (store.getState().wifiNameSt === 'Noky') {
            requests.fetchRoku({ key: 'launch', value: newItem.id });
        } else {
            requests.sendIfttt({ device: 'rokuSala', key: 'app', value: newItem.id });
        }
        const app = store.getState().rokuAppsSt.find(app => app.rokuId === newItem.id);
        if (app.id !== 'youtube') {
            const videoId = store.getState().selectionsSt.find(el => el.table === 'youtubeVideos')?.id;
            if (videoId) {
                requests.updateSelections({ table: 'youtubeVideos', id: '' });
            }
            youtube.clearQueue();
        }
    }
    if (store.getState().isAppSt) {
        const app = store.getState().rokuAppsSt.find(app => app.rokuId === newItem.id);
        if (app) {
            CordovaPlugins.updateAppSelected(app.label);
        }
    }
};
