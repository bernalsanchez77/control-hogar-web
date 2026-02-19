import { useEffect, useCallback, useState, useMemo } from 'react';
import { store } from '../../../../store/store';
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';
import youtube from '../../../../global/youtube';
import viewRouter from '../../../../global/view-router';
import { useTouch } from '../../../../hooks/useTouch';

export function useToolbar() {
  // 1. Store / Global State
  const youtubeVideosSt = store(v => v.youtubeVideosSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const leaderSt = store(v => v.selectionsSt.find(el => el.table === 'leader')?.id);
  const selectionsSt = store(v => v.selectionsSt);
  const viewSt = store(v => v.viewSt);
  const userNameSt = store(v => v.userNameSt);
  const userDeviceSt = store(v => v.userDeviceSt);
  const userTypeSt = store(v => v.userTypeSt);
  const lizEnabledSt = store(v => v.lizEnabledSt);
  const setLizEnabledSt = store(v => v.setLizEnabledSt);
  const device = 'rokuSala';

  // 2. Derived Values
  const youtubeVideosSelectedId = useMemo(() => {
    return selectionsSt.find(el => el.table === 'youtubeVideos')?.id;
  }, [selectionsSt]);

  const youtubeVideosSelected = useMemo(() => {
    return youtubeVideosSt.find(el => el.id === youtubeVideosSelectedId);
  }, [youtubeVideosSt, youtubeVideosSelectedId]);

  const selectionsPlayState = useMemo(() => {
    return selectionsSt.find(el => el.table === 'playState')?.id;
  }, [selectionsSt]);

  // 3. Local State
  const [normalizedPercentageSt, setNormalizedPercentageSt] = useState(0);

  // 4. Callbacks / Functions
  const onShortClick = useCallback((e, value) => {
    utils.triggerVibrate();

    if (value === 'play') {
      if (selectionsPlayState === 'play') {
        requests.updateSelections({ table: 'playState', id: 'pause' });
      }
      if (selectionsPlayState === 'pause') {
        requests.updateSelections({ table: 'playState', id: 'play' });
      }
    }

    const rokuValue = typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : '';

    if (wifiNameSt === 'Noky') {
      if (value === 'rev' || value === 'fwd') {
        requests.fetchRoku({ key: 'keydown', value: rokuValue });
      }
      if (value === 'queue') {
        viewRouter.navigateToYoutubeQueue();
      }
      if (value === 'liz') {
        const currentLiz = localStorage.getItem('lizEnabled') === 'true';
        localStorage.setItem('lizEnabled', !currentLiz);
        setLizEnabledSt(!currentLiz);
      }
    } else {
      if (value === 'queue') {
        viewRouter.navigateToYoutubeQueue();
      } else if (value === 'liz') {
        const currentLiz = localStorage.getItem('lizEnabled') === 'true';
        localStorage.setItem('lizEnabled', !currentLiz);
        setLizEnabledSt(!currentLiz);
      } else if (value !== 'play') {
        requests.sendIfttt({ device, key: 'command', value });
      }
    }
  }, [selectionsPlayState, wifiNameSt, setLizEnabledSt, device]);

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

        if (leaderSt === userNameSt + '-' + userDeviceSt && end) {
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
  }, [leaderSt, userNameSt, userDeviceSt, youtubeVideosSt, selectionsSt, youtubeVideosSelected]);

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
