import { useMemo } from 'react';
import { store } from "../../../../../../../store/store";
import utils from '../../../../../../../global/utils';
import youtube from '../../../../../../../global/youtube';
import viewRouter from '../../../../../../../global/view-router';
import { useTouch } from '../../../../../../../hooks/useTouch';
import { useLeader, useYoutubeVideoSelectedId } from '../../../../../../../hooks/useSelectors';

export function useQueue() {
    // 1. Store / Global State
    const youtubeVideosSt = store(v => v.youtubeVideosSt);
    const leaderSt = useLeader();
    const youtubeVideosSelectedId = useYoutubeVideoSelectedId();

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
        let queue = youtubeVideosSt.filter(video => video.queue > 0);
        return Object.values(queue).sort((a, b) => a.queue - b.queue);
    }, [youtubeVideosSt]);

    return {
        youtubeSortedQueue,
        youtubeVideosSelectedId,
        youtubeVideosSt,
        getQueueConsecutiveNumber,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
