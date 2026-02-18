import { useCallback } from 'react';
import requests from '../../../../../global/requests';
import utils from '../../../../../global/utils';
import { useTouch } from '../../../../../hooks/useTouch';

export function useLuzCuarto(element) {
    const onShortClick = useCallback((e, value) => {
        utils.triggerVibrate();
        const device = element.id;
        if (element.state === 'off') {
            requests.sendIfttt({ device, key: 'state', value: 'on' });
            requests.updateTable({ id: device, table: 'devices', state: 'on' });
        }
        setTimeout(() => {
            requests.sendIfttt({ device, key: 'color', value: value });
            requests.updateTable({ id: device, table: 'devices', color: value });
        }, 1000);
    }, [element]);

    const onLongClick = useCallback(() => { }, []);

    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
