import { useEffect, useCallback, useState, useMemo } from 'react';
import { store } from '../../../../store/store';
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';
import youtube from '../../../../global/youtube';
import viewRouter from '../../../../global/view-router';
import { useTouch } from '../../../../hooks/useTouch';
import { useLeader, usePlayState, useYoutubeVideoSelectedId } from '../../../../hooks/useSelectors';

export function useToolbar() {
  // 1. Store / Global State
  const youtubeVideosSt = store(v => v.youtubeVideosSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const selectionsSt = store(v => v.selectionsSt);
  const viewSt = store(v => v.viewSt);
  const userTypeSt = store(v => v.userTypeSt);
  const userNameDeviceSt = store(v => v.userNameDeviceSt);
  const lizEnabledSt = store(v => v.lizEnabledSt);
  const setLizEnabledSt = store(v => v.setLizEnabledSt);

  // 2. Derived Values (Selectors)
  const leaderSt = useLeader();
  const selectionsPlayState = usePlayState();
  const youtubeVideosSelectedId = useYoutubeVideoSelectedId();

  const youtubeVideosSelected = useMemo(() => {
    return youtubeVideosSt.find(el => el.id === youtubeVideosSelectedId);
  }, [youtubeVideosSt, youtubeVideosSelectedId]);

  // 3. Local State
  const [normalizedPercentageSt, setNormalizedPercentageSt] = useState(0);

  // 4. Callbacks / Functions
  const onShortClick = useCallback((e, value) => {
    utils.triggerVibrate();

    // 1. Common Actions
    if (value === 'play') {
      const nextId = selectionsPlayState === 'play' ? 'pause' : 'play';
      requests.updateSelections({ table: 'playState', id: nextId });
    } else if (value === 'rev' || value === 'fwd') {
      const enterNumber = parseInt(store.getState().selectionsSt.find(el => el.table === value)?.id || 0);
      requests.updateSelections({ table: value, id: enterNumber + 1 });
    } else if (value === 'queue') {
      viewRouter.navigateToYoutubeQueue();
    } else if (value === 'liz') {
      const currentLiz = localStorage.getItem('lizEnabled') === 'true';
      const nextLiz = !currentLiz;
      localStorage.setItem('lizEnabled', nextLiz);
      setLizEnabledSt(nextLiz);
    }

    // 2. Network Fallback (IFTTT)
    if (wifiNameSt !== 'Noky' && !['play', 'queue', 'liz'].includes(value)) {
      // requests.sendIfttt({ device, key: 'command', value });
    }
  }, [selectionsPlayState, wifiNameSt, setLizEnabledSt]);

  const onLongClick = useCallback(() => {
    // Hidden logic for play/keyup omitted as per original file
  }, []);

  // 5. Hook Integrations
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

  // 6. Effects
  useEffect(() => {
    const handleVideoEnd = async () => {
      if (youtubeVideosSt.length && selectionsSt.length) {
        const video = youtubeVideosSelected;
        const position = selectionsSt.find(el => el.table === 'playPosition')?.id;
        const { normalizedPercentage, end } = utils.checkVideoEnd(video, position);
        setNormalizedPercentageSt(normalizedPercentage);

        if (leaderSt === userNameDeviceSt && end) {
          if (video) {
            requests.updateSelections({ table: 'youtubeVideos', id: '' });
            setTimeout(() => {
              const nextVideo = youtube.getNextQueue(video.queue);
              if (nextVideo) {
                requests.updateSelections({ table: 'youtubeVideos', id: nextVideo.id });
                youtube.handleQueue(nextVideo);
              }
            }, 1000);
          }
        }
      }
    };
    handleVideoEnd();
  }, [leaderSt, userNameDeviceSt, youtubeVideosSt, selectionsSt, youtubeVideosSelected]);

  useEffect(() => {
    const performChangePlay = () => {
      onShortClick(true, 'play');
    };
    window.addEventListener('play-state-change', performChangePlay);
    return () => window.removeEventListener('play-state-change', performChangePlay);
  }, [onShortClick]);

  return {
    wifiNameSt,
    viewSt,
    userTypeSt,
    lizEnabledSt,
    youtubeVideosSelected,
    selectionsPlayState,
    normalizedPercentageSt,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}
