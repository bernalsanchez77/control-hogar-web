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
        const newState = screen.state === 'on' ? 'off' : 'on';
        if (screenSelectedSt === 'proyectorSala') {
            const devices = ['parlantesSala', 'lamparaSala', 'lamparaComedor'];
            devices.forEach(d => {
                requests.updateTable({ id: d, table: 'devices', state: newState });
            });
            if (screen.state === 'on') {
                requests.updateTable({ id: screenSelectedSt, table: 'screens', state: newState });
                setTimeout(() => {
                    requests.updateTable({ id: 'proyectorSwitchSala', table: 'devices', state: newState });
                }, 30000);
            } else {
                requests.updateTable({ id: 'proyectorSwitchSala', table: 'devices', state: newState });
                setTimeout(() => {
                    requests.updateTable({ id: screenSelectedSt, table: 'screens', state: newState });
                }, 5000);
            }
        } else {
            requests.updateTable({ id: screenSelectedSt, table: 'screens', state: newState });
        }
    }, [screen, screenSelectedSt]);

    const changeHdmi = useCallback(() => {
        utils.triggerVibrate();
        if (viewSt.selected === 'roku') {
            const newId = 'cable';
            requests.updateSelections({ table: 'hdmiSala', id: newId });
        }
        if (viewSt.selected === 'cable') {
            const newId = 'roku';
            requests.updateSelections({ table: 'hdmiSala', id: newId });
        }
    }, [viewSt.selected]);

    const changeInput = useCallback(() => {
        if (screen.state === 'on') {
            utils.triggerVibrate();
            if (screen.input === 'hdmi1') {
                requests.updateTable({ id: screenSelectedSt, table: 'screens', input: 'hdmi2' });
            } else {
                requests.updateTable({ id: screenSelectedSt, table: 'screens', input: 'hdmi1' });
            }
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
