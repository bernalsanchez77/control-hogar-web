import { useRef, useMemo } from 'react';
import { store } from "../../../../../../../store/store";
import utils from '../../../../../../../global/utils';
import youtube from '../../../../../../../global/youtube';
import viewRouter from '../../../../../../../global/view-router';
import { useTouch } from '../../../../../../../hooks/useTouch';

export function useChannel(setVideoToSave) {
    // 1. Store / Global State
    const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
    const leaderSt = store(v => v.leaderSt);
    const selectionsSt = store(v => v.selectionsSt);
    const youtubeVideosLizSelectedId = selectionsSt.find(el => el.table === 'youtubeVideosLiz')?.id;

    // 2. Refs
    const channelSelected = useRef(localStorage.getItem('channelSelected') || '');

    // 3. Callbacks / Functions
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
            viewRouter.navigateToYoutubeEdit();
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

    // 4. Memos
    const youtubeSortedVideos = useMemo(() => {
        let videos = youtubeVideosLizSt.filter(video => video.channelId === channelSelected.current);
        return Object.values(videos).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [youtubeVideosLizSt]);

    return {
        youtubeSortedVideos,
        youtubeVideosLizSelectedId,
        getQueueConsecutiveNumber,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
