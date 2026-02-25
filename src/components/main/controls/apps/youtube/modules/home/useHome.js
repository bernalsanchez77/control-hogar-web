import { useMemo } from 'react';
import { store } from "../../../../../../../store/store";
import viewRouter from '../../../../../../../global/view-router';
import utils from '../../../../../../../global/utils';
import { useTouch } from '../../../../../../../hooks/useTouch';

export function useHome() {
    // 1. Store / Global State
    const youtubeChannelsSt = store(v => v.youtubeChannelsSt);
    const userNameSt = store(v => v.userNameSt);
    const lizEnabledSt = store(v => v.lizEnabledSt);

    // 2. Callbacks / Functions
    const onChannelShortClick = (channelId) => {
        utils.triggerVibrate();
        localStorage.setItem('channelSelected', channelId);
        viewRouter.navigateToYoutubeChannel(channelId);
    };

    const handleShortPress = (e, type, video) => {
        if (type === 'channel') {
            onChannelShortClick(video.id);
        }
    };

    const handleLongPress = () => {
        utils.triggerVibrate();
    };

    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(handleShortPress, handleLongPress);

    // 3. Memos
    const youtubeSortedChannels = useMemo(() => {
        return Object.values(youtubeChannelsSt).sort((a, b) => a.order - b.order);
    }, [youtubeChannelsSt]);

    return {
        userNameSt,
        lizEnabledSt,
        youtubeSortedChannels,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
