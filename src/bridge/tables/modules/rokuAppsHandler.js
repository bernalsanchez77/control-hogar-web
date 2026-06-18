import { store } from '../../../store/store';
import requests from '../../global/requests';
import Statusbar from '../../global/statusbar';

const external = async (oldItem, newItem, eventType) => {
    store.getState().setRokuSearchModeSt('roku');
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
        const queueElements = store.getState().youtubeVideosSt.filter(video => video.queue > 0);
        if (queueElements.length > 0) {
            queueElements.forEach(video => {
                requests.updateTable({ id: video.id, table: 'youtubeVideos', queue: 0 });
            });
        }
    }
};

const internal = (oldItem, newItem, eventType) => {
    if (store.getState().isAppSt) {
        const app = store.getState().rokuAppsSt.find(app => app.rokuId === newItem.id);
        if (app) {
            Statusbar.updateAppSelected(app.label);
        }
    }
}

const handleRokuApps = {
    external,
    internal
}

export default handleRokuApps


