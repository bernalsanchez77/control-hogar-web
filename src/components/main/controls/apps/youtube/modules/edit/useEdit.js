import { useRef, useState, useMemo } from 'react';
import { store } from "../../../../../../../store/store";
import requests from '../../../../../../../global/requests';
import utils from '../../../../../../../global/utils';
import { useTouch } from '../../../../../../../hooks/useTouch';

export function useEdit(videoToSave) {
    // 1. Store / Global State
    const lizEnabledSt = store(v => v.lizEnabledSt);
    const userNameSt = store(v => v.userNameSt);
    const youtubeChannelsImagesSt = store(v => v.youtubeChannelsImagesSt);
    const youtubeChannelsLizSt = store(v => v.youtubeChannelsLizSt);
    const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);

    // 2. Prep data before State
    const savedVideo = youtubeVideosLizSt.find(v => v.id === videoToSave.id);
    const existingChannelId = savedVideo?.channelId || '';
    const existingChannelPath = youtubeChannelsLizSt.find(c => c.id === existingChannelId)?.img || '';
    const existingChannelImgId = youtubeChannelsImagesSt.find(img => img.path === existingChannelPath)?.id || '';

    // 3. Local State
    const [channel, setChannel] = useState(existingChannelId);
    const [channelImg, setChannelImg] = useState(existingChannelImgId);

    // 4. Refs
    const channelRef = useRef(existingChannelId);
    const channelImgPathRef = useRef(existingChannelPath);

    // 5. Callbacks / Functions
    const handleShortPress = (e, type, item) => {
        if (type === 'image') {
            setChannelImg(item.id);
            channelImgPathRef.current = item.path;
        }
    };

    const handleLongPress = () => {
        utils.triggerVibrate();
    };

    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(handleShortPress, handleLongPress);

    const addChannel = (newChannelId) => {
        setChannel(newChannelId);
        channelRef.current = newChannelId;
    };

    const saveChannel = () => {
        if (channelRef.current && channelRef.current.trim() !== '') {
            utils.triggerVibrate();
            requests.upsertTable({
                id: channelRef.current,
                table: 'youtubeChannelsLiz',
                title: channelRef.current,
                user: lizEnabledSt ? 'elizabeth' : userNameSt,
                img: channelImgPathRef.current
            });
            requests.upsertTable({
                id: videoToSave.id,
                table: 'youtubeVideosLiz',
                title: utils.decodeYoutubeTitle(videoToSave.title),
                duration: videoToSave.duration,
                channelId: channelRef.current
            });
            window.history.back();
        }
    };

    const cancelChannel = () => {
        utils.triggerVibrate();
        window.history.back();
    };

    // 6. Memos
    const youtubeSortedChannels = useMemo(() => {
        return Object.values(youtubeChannelsLizSt).sort((a, b) => a.order - b.order);
    }, [youtubeChannelsLizSt]);

    return {
        lizEnabledSt,
        userNameSt,
        youtubeChannelsImagesSt,
        youtubeSortedChannels,
        channel,
        channelImg,
        addChannel,
        saveChannel,
        cancelChannel,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
