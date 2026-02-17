import { useRef, useEffect, useCallback, useMemo } from 'react';
import { store } from '../../../../store/store';
import utils from '../../../../global/utils';
import requests from '../../../../global/requests';

export function useLevels() {
    // 1. Store / Global State
    const screenSelectedSt = store(v => v.screenSelectedSt);
    const screensSt = store(v => v.screensSt);
    const cableChannelsSt = store(v => v.cableChannelsSt);
    const viewSt = store(v => v.viewSt);
    const isAppSt = store(v => v.isAppSt);
    const wifiNameSt = store(v => v.wifiNameSt);
    const selectionsSt = store(v => v.selectionsSt);

    // 2. Derived Values
    const screen = useMemo(() => screensSt.find(s => s.id === screenSelectedSt), [screensSt, screenSelectedSt]);

    // 3. Refs
    const timeout3s = useRef(null);
    const timeout6s = useRef(null);
    const volumeChange = useRef(1);

    // 4. Callbacks / Functions
    const onMuteShortClick = useCallback(async (keyup, key) => {
        if (screen.state === 'on') {
            if (keyup) {
                utils.triggerVibrate();
                const device = screenSelectedSt;
                const value = screen.mute === 'on' ? 'off' : 'on';
                requests.sendIfttt({ device, key, value });
                requests.updateTable({ id: device, table: 'screens', mute: value });
            }
        }
    }, [screenSelectedSt, screen]);

    const onMuteLongClick = useCallback(() => {
        // No long press action defined
    }, []);

    const onOptionsShortClick = useCallback((value) => {
        utils.triggerVibrate();
        const device = viewSt.selected === 'roku' ? 'rokuSala' : 'cableSala';
        const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
        if (isAppSt && wifiNameSt === 'Noky') {
            requests.fetchRoku({ key: 'keypress', value: rokuValue });
        } else {
            requests.sendIfttt({ device, key: 'command', value });
        }
    }, [viewSt.selected, isAppSt, wifiNameSt]);

    const onChannelShortClick = useCallback((value) => {
        utils.triggerVibrate();
        let newChannel = {};
        const device = 'channelsSala';
        let newChannelOrder = 0;
        const cableChannelsSelectedId = selectionsSt.find(el => el.table === 'cableChannels').id;
        const channelSelected = cableChannelsSt.find(ch => ch.id === cableChannelsSelectedId);

        const channelOrderSelected = channelSelected.order;
        if (value === 'up') {
            newChannelOrder = channelOrderSelected + 1;
        }
        if (value === 'down') {
            newChannelOrder = channelOrderSelected - 1;
        }
        newChannel = cableChannelsSt.find(ch => ch.order === newChannelOrder);
        if (!newChannel) {
            if (value === 'up') {
                newChannel = cableChannelsSt.find(ch => ch.order === 1);
            } else {
                newChannel = cableChannelsSt[cableChannelsSt.length - 1];
            }
        }
        requests.sendIfttt({ device: device + newChannel.ifttt, key: 'selected', value: newChannel.id });
        requests.updateSelections({ table: 'cableChannels', id: newChannel.id });
    }, [cableChannelsSt, selectionsSt]);

    const onVolumeClick = useCallback((vol, button, vib = true) => {
        const device = screenSelectedSt;
        let newVol = 0;
        if (button === 'up') {
            newVol = screen.volume + vol;
            requests.sendIfttt({ device, key: 'volume', value: button + vol });
            requests.updateTable({ id: device, table: 'screens', volume: newVol });
        } else if (screen.volume !== 0) {
            if (screen.volume - vol >= 0) {
                newVol = screen.volume - vol;
                requests.sendIfttt({ device, key: 'volume', value: button + vol });
                requests.updateTable({ id: device, table: 'screens', volume: newVol });
            } else {
                requests.sendIfttt({ device, key: 'volume', value: button + vol });
                requests.updateTable({ id: device, table: 'screens', volume: '0' });
            }
        } else {
            requests.sendIfttt({ device, key: 'volume', value: button + vol });
        }
    }, [screenSelectedSt, screen]);

    const changeVolumeStart = useCallback((e, button) => {
        e.preventDefault();
        if (screen.state === 'on') {
            volumeChange.current = 1;
            timeout3s.current = setTimeout(() => {
                volumeChange.current = 5;
                utils.triggerVibrate(200);
            }, 1000);
            timeout6s.current = setTimeout(() => {
                volumeChange.current = 10;
                utils.triggerVibrate(400);
            }, 2000);
        }
    }, [screen]);

    const changeVolumeEnd = useCallback((e, button) => {
        e.preventDefault();
        if (screen.state === 'on') {
            clearTimeout(timeout3s.current);
            clearTimeout(timeout6s.current);
            if (volumeChange.current === 1) {
                utils.triggerVibrate(200);
                onVolumeClick(volumeChange.current, button);
            } else {
                utils.triggerVibrate(200);
                onVolumeClick(volumeChange.current, button, false);
            }
        }
    }, [screen, onVolumeClick]);

    // 5. Effects
    useEffect(() => {
        const performMute = () => {
            onMuteShortClick(true, 'mute');
        };
        window.addEventListener('mute-state-change', performMute);
        return () => window.removeEventListener('mute-state-change', performMute);
    }, [onMuteShortClick]);

    // 6. Return
    return {
        screen,
        viewSt,
        onMuteShortClick,
        onMuteLongClick,
        onOptionsShortClick,
        onChannelShortClick,
        changeVolumeStart,
        changeVolumeEnd
    };
}
