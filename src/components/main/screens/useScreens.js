import { useCallback, useMemo } from 'react';
import { store } from '../../../store/store';
import utils from '../../../global/utils';
import CordovaPlugins from '../../../global/cordova-plugins';

export function useScreens() {
    // 1. Store / Global State
    const isInForegroundSt = store(v => v.isInForegroundSt);
    const userTypeSt = store(v => v.userTypeSt);
    const screenSelectedSt = store(v => v.screenSelectedSt);
    const setScreenSelectedSt = store(v => v.setScreenSelectedSt);
    const screensSt = store(v => v.screensSt);
    const isAppSt = store(v => v.isAppSt);

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
            if (isAppSt) {
                CordovaPlugins.updateScreenSelected(screen.label + ' ' + screen.state.toUpperCase());
                CordovaPlugins.updateScreenState(screen.state);
                CordovaPlugins.updateMuteState(screen.mute);
            }
        }
    }, [screenSelectedSt, setScreenSelectedSt, isAppSt]);

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
