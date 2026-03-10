import { useRef, useMemo, useState, useEffect } from 'react';
import { store } from "../../../../../../../store/store";
import utils from '../../../../../../../global/utils';
import youtube from '../../../../../../../global/youtube';
import viewRouter from '../../../../../../../global/view-router';
import { useTouch } from '../../../../../../../hooks/useTouch';
import { useLeader, useYoutubeVideoSelectedId } from '../../../../../../../hooks/useSelectors';

export function useChannel(setVideoToSave) {
    // 1. Store / Global State
    const youtubeVideosSt = store(v => v.youtubeVideosSt);
    const leader = useLeader();
    const youtubeVideosSelectedId = useYoutubeVideoSelectedId();

    // 2. States
    const [animatingVideoId, setAnimatingVideoId] = useState(null);

    // 3. Refs
    const channelSelected = useRef(localStorage.getItem('channelSelected') || '');

    // 4. Callbacks / Functions
    const handleShortPress = async (e, type, video) => {
        if (type === 'video') {
            if (leader) {
                utils.triggerVibrate();
                setAnimatingVideoId(video.id);
                await youtube.onVideoShortClick(video);
            }
        }
        if (type === 'edit') {
            utils.triggerVibrate();
            setVideoToSave(video);
            viewRouter.navigateToYoutubeEdit(channelSelected.current);
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

    // 5. Memos
    // 5. Memos
    const youtubeSortedVideos = useMemo(() => {
        let videos = youtubeVideosSt.filter(video => video && video.channelId === channelSelected.current);
        const decodedVideos = videos.map(video => ({
            ...video,
            title: utils.decodeYoutubeTitle(video.title)
        }));
        return Object.values(decodedVideos).sort((a, b) => new Date(a?.date || 0) - new Date(b?.date || 0));
    }, [youtubeVideosSt]);

    // 2. Effects
    useEffect(() => {
        if (youtubeVideosSelectedId === animatingVideoId) {
            setAnimatingVideoId(null);
        }
    }, [youtubeVideosSelectedId, animatingVideoId]);

    return {
        youtubeSortedVideos,
        youtubeVideosSelectedId,
        animatingVideoId,
        getQueueConsecutiveNumber,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
