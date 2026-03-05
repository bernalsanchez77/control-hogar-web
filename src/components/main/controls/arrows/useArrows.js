import { useCallback } from 'react';
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';
import { store } from '../../../../store/store';
import { useTouch } from '../../../../hooks/useTouch';
import { useLeader } from '../../../../hooks/useSelectors';

export function useArrows() {
    const leaderSt = useLeader();
    const userNameDeviceSt = store(v => v.userNameDeviceSt);

    // 2. Callbacks / Functions
    const onShortClick = useCallback((e, value) => {
        utils.triggerVibrate();
        const enterNumber = parseInt(store.getState().selectionsSt.find(el => el.table === value)?.id);
        const newEnterNumber = enterNumber + 1;
        requests.updateSelections({ table: value, id: newEnterNumber });
    }, []);

    const onLongClick = useCallback(() => {
        // No long press action defined
    }, []);

    // 3. Hook Integrations
    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

    return {
        leaderSt,
        userNameDeviceSt,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
