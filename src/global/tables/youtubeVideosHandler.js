import { store } from '../../store/store';
import roku from '../roku';
import requests from '../requests';

export const handleYoutubeVideosChange = async (oldItem, newItem, eventType, userNameDevice, leader) => {
    if (newItem.id) {
        if (roku.playStateInterval) {
            roku.stopPlayStateListener();
        }
        if (userNameDevice === leader) {
            const rokuId = store.getState().rokuAppsSt.find(app => app.label === 'Youtube').rokuId;
            if (!store.getState().simulatePlayStateSt) {
                requests.fetchRoku({ key: 'launch', value: rokuId, params: { contentID: newItem.id } });
            }
            const currentVideo = store.getState().youtubeVideosSt.find(video => video.id === newItem.id) || store.getState().currentYoutubeVideoSt;
            roku.startPlayStateListener(currentVideo);
            setTimeout(() => {
                requests.updateSelections({ table: 'playState', id: 'play' });
                requests.updateTable({ id: newItem.id, table: 'youtubeVideos' });
            }, 1000);
        }
    } else {
        if (roku.playStateInterval) {
            roku.stopPlayStateListener();
        }
        if (userNameDevice === leader) {
            requests.fetchRoku({ key: 'keypress', value: 'Stop' });
            requests.updateSelections({ table: 'playState', id: 'stop' });
            requests.updateSelections({ table: 'playPosition', id: '0' });
        }
    }
};
