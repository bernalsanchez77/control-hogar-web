import { useMemo } from 'react';
import { store } from "../../../../../../../store/store";
import utils from '../../../../../../../global/utils';
import youtube from '../../../../../../../global/youtube';
import viewRouter from '../../../../../../../global/view-router';
import { useTouch } from '../../../../../../../hooks/useTouch';

export function useSearch(setVideoToSave) {
    // 1. Store / Global State
    const youtubeSearchVideosSt = store(v => v.youtubeSearchVideosSt);
    const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
    const viewSt = store(v => v.viewSt);
    const leaderSt = store(v => v.leaderSt);
    const selectionsSt = store(v => v.selectionsSt);
    const youtubeVideosLizSelectedId = selectionsSt.find(el => el.table === 'youtubeVideosLiz')?.id;

    // 2. Callbacks / Functions
    const handleShortPress = async (e, type, video) => {
        if (type === 'video') {
            if (leaderSt) {
                utils.triggerVibrate();
                await youtube.onVideoShortClick(video);
            }
        }
        if (type === 'edit') {
            utils.triggerVibrate();
            setVideoToSave(video);
            const newView = structuredClone(viewSt);
            newView.roku.apps.youtube.mode = 'edit';
            viewRouter.changeView(newView);
        }
    };

    const handleLongPress = (e, type, video) => {
        utils.triggerVibrate();
        youtube.handleQueue(video);
    };

    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(handleShortPress, handleLongPress);

    const getQueueConsecutiveNumber = (video) => {
        return youtube.getQueueConsecutiveNumber(video);
    };

    // 3. Memos
    const youtubeSortedVideos = useMemo(() => {
        return youtubeSearchVideosSt.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            img: item.snippet.thumbnails.medium.url,
            duration: utils.formatYoutubeDuration(item.contentDetails.duration),
        }));
    }, [youtubeSearchVideosSt]);

    return {
        youtubeSortedVideos,
        youtubeVideosLizSelectedId,
        youtubeVideosLizSt,
        getQueueConsecutiveNumber,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
