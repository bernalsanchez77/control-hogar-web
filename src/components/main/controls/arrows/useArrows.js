import { useCallback } from 'react';
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';
import { store } from '../../../../store/store';
import { useTouch } from '../../../../hooks/useTouch';

export function useArrows() {
    // 1. Store / Global State
    const wifiNameSt = store(v => v.wifiNameSt);
    const leaderSt = store(v => v.peersSt.findLast(p => p.wifiName === 'Noky')?.name || '');
    const userNameSt = store(v => v.userNameSt);
    const userDeviceSt = store(v => v.userDeviceSt);
    const device = 'rokuSala';

    // 2. Callbacks / Functions
    const onShortClick = useCallback((e, value) => {
        const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
        if (wifiNameSt === 'Noky') {
            utils.triggerVibrate();
            requests.fetchRoku({ key: 'keypress', value: rokuValue });
        } else {
            utils.triggerVibrate();
            requests.sendIfttt({ device, key: 'command', value });
        }
    }, [wifiNameSt, device]);

    const onLongClick = useCallback(() => {
        // No long press action defined
    }, []);

    // 3. Hook Integrations
    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

    return {
        leaderSt,
        userNameSt,
        userDeviceSt,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
