import { useRef, useMemo } from 'react';
import { store } from "../../../../../../../store/store";
import utils from '../../../../../../../global/utils';
import youtube from '../../../../../../../global/youtube';
import viewRouter from '../../../../../../../global/view-router';
import { useTouch } from '../../../../../../../hooks/useTouch';
import { useLeader, useYoutubeVideoSelectedId } from '../../../../../../../hooks/useSelectors';

export function useChannel(setVideoToSave) {
    // 1. Store / Global State
    const youtubeVideosSt = store(v => v.youtubeVideosSt);
    const leaderSt = useLeader();
    const youtubeVideosSelectedId = useYoutubeVideoSelectedId();

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
        let videos = youtubeVideosSt.filter(video => video.channelId === channelSelected.current);
        return Object.values(videos).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [youtubeVideosSt]);

    return {
        youtubeSortedVideos,
        youtubeVideosSelectedId,
        getQueueConsecutiveNumber,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
