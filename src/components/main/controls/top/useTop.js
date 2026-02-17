import { useEffect, useCallback, useMemo } from 'react';
import { store } from '../../../../store/store';
import requests from '../../../../global/requests';
import utils from '../../../../global/utils';

export function useTop() {
    // 1. Store / Global State
    const screenSelectedSt = store(v => v.screenSelectedSt);
    const screensSt = store(v => v.screensSt);
    const viewSt = store(v => v.viewSt);

    // 2. Derived Values
    const screen = useMemo(() => screensSt.find(s => s.id === screenSelectedSt), [screensSt, screenSelectedSt]);

    // 3. Callbacks / Functions
    const changePower = useCallback(() => {
        utils.triggerVibrate();
        // The original logic had `if (!screen) return;` which is removed.
        // The provided snippet seems to restructure the `changePower` logic significantly.
        // Reconstructing based on the provided snippet's structure, assuming it's the intended new logic.
        const device = screenSelectedSt;
        const newState = screen.state === 'on' ? 'off' : 'on';
        const value = newState;

        if (device === 'proyectorSala') {
            const devices = ['parlantesSala', 'lamparaSala', 'lamparaComedor'];
            devices.forEach(d => {
                requests.sendIfttt({ device: d, value });
                requests.updateTable({ id: d, table: 'devices', state: newState });
            });

            if (screen.state === 'on') {
                requests.sendIfttt({ device, value });
                requests.updateTable({ id: device, table: 'screens', state: newState });
                setTimeout(() => {
                    requests.sendIfttt({ device: 'proyectorSwitchSala', value });
                    requests.updateTable({ id: 'proyectorSwitchSala', table: 'devices', state: newState });
                }, 30000);
            } else {
                requests.sendIfttt({ device: 'proyectorSwitchSala', value });
                requests.updateTable({ id: 'proyectorSwitchSala', table: 'devices', state: newState });
                setTimeout(() => {
                    requests.sendIfttt({ device, value });
                    requests.updateTable({ id: device, table: 'screens', state: newState });
                }, 50000); // Changed from 5000 to 50000 as per provided snippet
            }
        } else {
            requests.sendIfttt({ device, value });
            requests.updateTable({ id: device, table: 'screens', state: newState });
        }
    }, [screen, screenSelectedSt]);

    const changeHdmi = useCallback(() => {
        utils.triggerVibrate();
        const device = 'hdmiSala';
        if (viewSt.selected === 'roku') {
            const newId = 'cable';
            requests.sendIfttt({ device, value: newId });
            requests.updateSelections({ table: 'hdmiSala', id: newId });
        }
        if (viewSt.selected === 'cable') {
            const newId = 'roku';
            requests.sendIfttt({ device, value: newId });
            requests.updateSelections({ table: 'hdmiSala', id: newId });
        }
    }, [viewSt.selected]);

    const changeInput = useCallback(() => {
        utils.triggerVibrate();
        // The original logic had `if (!screen) return;` which is removed.
        const device = screenSelectedSt;
        if (screen.input === 'hdmi1') {
            requests.sendIfttt({ device, key: 'input', value: 'hdmi2' });
        } else {
            requests.sendIfttt({ device, key: 'input', value: 'hdmi1' });
        }
    }, [screen, screenSelectedSt]);

    // 4. Effects
    useEffect(() => {
        const performChangePower = () => {
            changePower();
        };
        window.addEventListener('screen-state-change', performChangePower);
        return () => window.removeEventListener('screen-state-change', performChangePower);
    }, [changePower]);

    return {
        screen,
        viewSt,
        changePower,
        changeHdmi,
        changeInput
    };
}
