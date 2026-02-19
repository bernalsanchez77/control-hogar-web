import { useMemo } from 'react';
import { store } from "../../../../../../../store/store";
import utils from '../../../../../../../global/utils';
import youtube from '../../../../../../../global/youtube';
import viewRouter from '../../../../../../../global/view-router';
import { useTouch } from '../../../../../../../hooks/useTouch';

export function useQueue() {
    // 1. Store / Global State
    const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
    const selectionsSt = store(v => v.selectionsSt);
    const leaderSt = store(v => v.leaderSt);
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
            // In queue, edit logic might be missing or handled differently, 
            // but let's follow the standard pattern if needed.
            // Usually it navigates to edit view.
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

    // 3. Memos
    const youtubeSortedQueue = useMemo(() => {
        let queue = youtubeVideosLizSt.filter(video => video.queue > 0);
        return Object.values(queue).sort((a, b) => a.queue - b.queue);
    }, [youtubeVideosLizSt]);

    return {
        youtubeSortedQueue,
        youtubeVideosLizSelectedId,
        youtubeVideosLizSt,
        getQueueConsecutiveNumber,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
