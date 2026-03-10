import { store } from '../../store/store';
import requests from '../requests';
import Roku from '../roku';

export const handleLeaderChange = async (oldItem, newItem, eventType, userNameDevice, leader) => {
    if (newItem.id !== oldItem.id) {
        if (newItem.id === userNameDevice) {
            if (!Roku.playStateInterval) {
                const youtubeVideosSelectedId = store.getState().selectionsSt.find(el => el.table === 'youtubeVideos')?.id;
                if (youtubeVideosSelectedId) {
                    const youtubeVideosSelected = store.getState().youtubeVideosSt.find(el => el.id === youtubeVideosSelectedId);
                    Roku.startPlayStateListener(youtubeVideosSelected);
                }
            }
            const playState = await Roku.getPlayState('state');
            if (playState && playState !== store.getState().selectionsSt.find(el => el.table === 'playState')?.id) {
                requests.updateSelections({ table: 'playState', id: playState });
            }
        } else {
            if (Roku.playStateInterval) {
                Roku.stopPlayStateListener();
            }
        }
    }
};
