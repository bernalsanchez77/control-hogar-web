import { useCallback, useMemo } from 'react';
import { store } from '../../../../../store/store';
import requests from '../../../../../global/requests';
import utils from '../../../../../global/utils';
import { useTouch } from '../../../../../hooks/useTouch';

export function useCategory() {
    // 1. Store / Global State
    const category = store(v => v.viewSt.cable.channels.category);
    const cableChannelsSt = store(v => v.cableChannelsSt);
    const selectionsSt = store(v => v.selectionsSt);

    // 2. Derived Values
    const cableChannelsSelectedId = useMemo(() => {
        return selectionsSt.find(el => el.table === 'cableChannels')?.id;
    }, [selectionsSt]);

    // 3. Callbacks / Functions
    const onShortClick = (e, value) => {
        utils.triggerVibrate();
        requests.updateSelections({ table: 'cableChannels', id: value });
    };

    const onLongClick = useCallback(() => { }, []);

    // 4. Hook Integrations
    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

    return {
        category,
        cableChannelsSt,
        cableChannelsSelectedId,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
