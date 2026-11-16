import { store } from '../../../store/store';
import roku from '../../global/roku';
import requests from '../../global/runtimeRequests';

const external = async (oldItem, newItem, eventType) => {
    if (newItem.id) {
        const rokuId = store.getState().rokuAppsSt.find(app => app.label === 'Youtube').rokuId;
        if (!store.getState().simulatePlayStateSt) {
            requests.fetchRoku({ key: 'launch', value: rokuId, params: { contentID: newItem.id } });
        }
        roku.activatePlayStateListener();
        setTimeout(() => {
            requests.updateSelections({ table: 'playState', id: 'play' });
            requests.updateTable({ table: 'youtubeVideos', id: newItem.id });
        }, 1000);
    } else {
        requests.fetchRoku({ key: 'keypress', value: 'Stop' });
        requests.updateSelections({ table: 'playState', id: 'stop' });
        requests.updateSelections({ table: 'playPosition', id: '0' });
    }
};

const internal = (oldItem, newItem, eventType) => {
    if (roku.playStateInterval) {
        roku.stopPlayStateListener();
    }
}

const handleYoutubeVideos = {
    external,
    internal
}

export default handleYoutubeVideos