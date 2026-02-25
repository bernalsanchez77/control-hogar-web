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
    const youtubeChannelsSt = store(v => v.youtubeChannelsSt);
    const youtubeVideosSt = store(v => v.youtubeVideosSt);

    // 2. Prep data before State
    const savedVideo = youtubeVideosSt.find(v => v.id === videoToSave.id);
    const existingChannelId = savedVideo?.channelId || '';
    const existingChannelPath = youtubeChannelsSt.find(c => c.id === existingChannelId)?.img || '';
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
            const channelId = channelRef.current.toLowerCase().trim().replace(/\s+/g, '-');

            const existingChannel = youtubeChannelsSt.find(c => c.id === channelId);
            let order = existingChannel?.order;

            if (order === undefined) {
                const maxOrder = youtubeChannelsSt.length > 0
                    ? Math.max(...youtubeChannelsSt.map(c => c.order || 0))
                    : 0;
                order = maxOrder + 1;
            }

            requests.upsertTable({
                id: channelId,
                table: 'youtubeChannels',
                title: channelRef.current.trim(),
                user: lizEnabledSt ? 'elizabeth' : userNameSt,
                img: channelImgPathRef.current,
                order: order,
                date: null
            });
            requests.upsertTable({
                id: videoToSave.id,
                table: 'youtubeVideos',
                title: utils.decodeYoutubeTitle(videoToSave.title),
                duration: videoToSave.duration,
                channelId: channelId,
                date: null
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
        return Object.values(youtubeChannelsSt).sort((a, b) => a.order - b.order);
    }, [youtubeChannelsSt]);

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
