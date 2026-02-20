import { useMemo } from 'react';
import { store } from "../../../../../../../store/store";
import utils from '../../../../../../../global/utils';
import youtube from '../../../../../../../global/youtube';
import viewRouter from '../../../../../../../global/view-router';
import { useTouch } from '../../../../../../../hooks/useTouch';
import { useLeader, useYoutubeVideoSelectedId } from '../../../../../../../hooks/useSelectors';

export function useSearch(setVideoToSave) {
    // 1. Store / Global State
    const youtubeSearchVideosSt = store(v => v.youtubeSearchVideosSt);
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
        youtubeVideosSelectedId,
        youtubeVideosSt,
        getQueueConsecutiveNumber,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
