import { useCallback, useMemo } from 'react';
import { store } from '../../../../../store/store';
import CableChannelCategories from '../../../../../global/cable-channel-categories';
import utils from '../../../../../global/utils';
import viewRouter from '../../../../../global/view-router';
import { useTouch } from '../../../../../hooks/useTouch';

export function useCategories() {
  // 1. Logic
  const cableChannelCategories = useMemo(() => new CableChannelCategories().getCableChannelCategories(), []);
  
  const cableChannelsSelectedId = store(v => v.selectionsSt.find(el => el.table === 'cableChannels')?.id);
  const selectedImg = useMemo(() => '/imgs/channels/' + cableChannelsSelectedId + '.png', [cableChannelsSelectedId]);

  const onShortClick = useCallback(async (e, value) => {
    utils.triggerVibrate();
    await viewRouter.navigateToCableCategory(value);
  }, []);

  const onLongClick = useCallback(() => {}, []);

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

  return {
    cableChannelCategories,
    selectedImg,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}
