import { store } from '../../store/store';
import requests from '../requests';
import youtube from '../youtube';
import CordovaPlugins from '../cordova-plugins';

export const handleRokuAppsChange = async (change, userName, leader) => {
    store.getState().setRokuSearchModeSt('roku');
    if (userName === leader) {
        if (store.getState().wifiNameSt === 'Noky') {
            requests.fetchRoku({ key: 'launch', value: change.id });
        } else {
            requests.sendIfttt({ device: 'rokuSala', key: 'app', value: change.id });
        }
        const app = store.getState().rokuAppsSt.find(app => app.rokuId === change.id);
        if (app.id !== 'youtube') {
            const videoId = store.getState().selectionsSt.find(el => el.table === 'youtubeVideos')?.id;
            if (videoId) {
                requests.updateSelections({ table: 'youtubeVideos', id: '' });
            }
            youtube.clearQueue();
        }
    }
    store.getState().setRokuSearchModeSt('roku');
    if (store.getState().isAppSt) {
        const app = store.getState().rokuAppsSt.find(app => app.rokuId === change.id);
        if (app) {
            CordovaPlugins.updateAppSelected(app.label);
        }
    }
};
