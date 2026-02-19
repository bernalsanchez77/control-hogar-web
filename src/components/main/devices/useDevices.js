import { useEffect, useCallback, useMemo } from 'react';
import { store } from '../../../store/store';
import viewRouter from '../../../global/view-router';
import requests from '../../../global/requests';
import { useTouch } from '../../../hooks/useTouch';

export function useDevices() {
    // 1. Store / Global State
    const userTypeSt = store(v => v.userTypeSt);
    const devicesSt = store(v => v.devicesSt);

    // 2. Derived Values
    const allDevices = useMemo(() => devicesSt.length ? [
        ...devicesSt,
        {
            id: 'lamparasAbajo',
            label: 'Lamparas Abajo',
            img: '/imgs/devices/lamparasabajo.png',
            state: 'off',
            order: 20,
            public: true,
        }
    ] : [], [devicesSt]);

    const lamparasOn = useMemo(() => [
        devicesSt.find(device => device.id === 'lamparaComedor'),
        devicesSt.find(device => device.id === 'lamparaSala'),
        devicesSt.find(device => device.id === 'chimeneaSala'),
        devicesSt.find(device => device.id === 'lamparaTurca'),
    ], [devicesSt]);

    const lamparasOff = useMemo(() => [
        devicesSt.find(device => device.id === 'lamparaComedor'),
        devicesSt.find(device => device.id === 'lamparaSala'),
        devicesSt.find(device => device.id === 'chimeneaSala'),
        devicesSt.find(device => device.id === 'lamparaTurca'),
    ], [devicesSt]);

    // 3. Callbacks / Functions
    const setLamparasState = useCallback(async () => {
        let lamps = 0;
        lamparasOff.forEach(lampara => {
            if (lampara.state === 'on') {
                lamps++;
            }
        });
        if (lamps > 1) {
            allDevices.find(device => device.id === 'lamparasAbajo').state = 'on';
        } else {
            allDevices.find(device => device.id === 'lamparasAbajo').state = 'off';
        }
    }, [lamparasOff, allDevices]);

    const changeView = useCallback(async (device) => {
        await viewRouter.navigateToDevice(device.id);
    }, []);

    const onDevicesShortClick = useCallback((e, device) => {
        if (device.state === 'on') {
            if (device.id === 'lamparasAbajo') {
                lamparasOff.forEach(lampara => {
                    if (lampara.state === 'on') {
                        requests.sendIfttt({ device: lampara.id, key: 'state', value: 'off' });
                        requests.updateTable({ id: lampara.id, table: 'devices', state: 'off' });
                    }
                });
            } else {
                requests.sendIfttt({ device: device.id, key: 'state', value: 'off' });
                requests.updateTable({ id: device.id, table: 'devices', state: 'off' });
            }
        }
        if (device.state === 'off') {
            if (device.id === 'lamparasAbajo') {
                lamparasOn.forEach(lampara => {
                    if (lampara.state === 'off') {
                        requests.sendIfttt({ device: lampara.id, key: 'state', value: 'on' });
                        requests.updateTable({ id: lampara.id, table: 'devices', state: 'on' });
                    }
                });
            } else {
                requests.sendIfttt({ device: device.id, key: 'state', value: 'on' });
                requests.updateTable({ id: device.id, table: 'devices', state: 'on' });
            }
        }
    }, [lamparasOff, lamparasOn]);

    const onDevicesLongClick = useCallback((e, device) => {
        changeView(device);
    }, [changeView]);

    // 4. Hook Integrations
    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onDevicesShortClick, onDevicesLongClick);

    // 5. Effects
    useEffect(() => {
        setLamparasState();
    }, [setLamparasState]);

    // 6. Return
    return {
        allDevices,
        userTypeSt,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
