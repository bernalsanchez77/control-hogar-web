import { useEffect } from 'react';
import Roku from '../../../global/roku';
import { store } from '../../../store/store';

export function useRokuSync(userNameSt, userDeviceSt, leaderSt, selectionsSt) {
    useEffect(() => {
        if (userNameSt + '-' + userDeviceSt === leaderSt && !Roku.playStateInterval) {
            const youtubeVideosSelectedId = selectionsSt.find(el => el.table === 'youtubeVideos')?.id;
            if (youtubeVideosSelectedId) {
                const youtubeVideosSelected = store.getState().youtubeVideosSt.find(el => el.id === youtubeVideosSelectedId);
                Roku.startPlayStateListener(youtubeVideosSelected);
            }
        }
        if (userNameSt + '-' + userDeviceSt !== leaderSt && Roku.playStateInterval) {
            Roku.stopPlayStateListener();
        }
    }, [leaderSt, userNameSt, userDeviceSt, selectionsSt]);
}
