import { useCallback, useMemo } from 'react';
import { store } from '../../../store/store';
import utils from '../../../utils/utils';
import requests from '../../global/requests';

export function useScreens() {
    // 1. Store / Global State
    const isInForegroundSt = store(v => v.isInForegroundSt);
    const isConnectedToNokySt = store(v => v.isConnectedToNokySt);
    const userTypeSt = store(v => v.userTypeSt);
    const screenSelectedSt = store(v => v.screenSelectedSt);
    const setScreenSelectedSt = store(v => v.setScreenSelectedSt);
    const screensSt = store(v => v.screensSt);
    const userDevicesSt = store(v => v.userDevicesSt);
    const userNameDevicesSt = store(v => v.userNameDevicesSt);

    // 2. Derived Values
    const teleSalaScreen = useMemo(() => screensSt.find(screen => screen.id === 'teleSala'), [screensSt]);
    const teleCuartoScreen = useMemo(() => screensSt.find(screen => screen.id === 'teleCuarto'), [screensSt]);
    const teleCocinaScreen = useMemo(() => screensSt.find(screen => screen.id === 'teleCocina'), [screensSt]);
    const proyectorSalaScreen = useMemo(() => screensSt.find(screen => screen.id === 'proyectorSala'), [screensSt]);

    // 3. Callbacks / Functions
    const onScreenChanged = useCallback((screen) => {
        if (screenSelectedSt !== screen.id) {
            utils.triggerVibrate();
            setScreenSelectedSt(screen.id);
            localStorage.setItem('screen-id', screen.id);
            requests.updateTable({
                id: userNameDevicesSt,
                table: 'userDevices',
                date: userDevicesSt.find(el => el.id === userNameDevicesSt).date,
                isInForeground: isInForegroundSt,
                isConnectedToNoky: isConnectedToNokySt,
                screenSelected: screen.id,
            });
        }
    }, [screenSelectedSt, setScreenSelectedSt, isInForegroundSt, isConnectedToNokySt, userDevicesSt, userNameDevicesSt]);

    // 4. Return
    return {
        isInForegroundSt,
        userTypeSt,
        screenSelectedSt,
        teleSalaScreen,
        teleCuartoScreen,
        teleCocinaScreen,
        proyectorSalaScreen,
        onScreenChanged
    };
}
