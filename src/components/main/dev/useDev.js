import { useCallback } from 'react';
import { store } from "../../../store/store";
import connection from '../../../global/connection';

export function useDev() {
    // 1. Store / Global State
    const sendEnabledSt = store(v => v.sendEnabledSt);
    const setSendEnabledSt = store(v => v.setSendEnabledSt);
    const wifiNameSt = store(v => v.wifiNameSt);

    // 2. Callbacks / Functions
    const onEnableSend = useCallback(() => {
        setSendEnabledSt(!sendEnabledSt);
    }, [sendEnabledSt, setSendEnabledSt]);

    const onWifiChange = useCallback(() => {
        if (wifiNameSt === 'Noky') {
            connection.onWifiNameChange('Cometa');
        } else {
            connection.onWifiNameChange('Noky');
        }
    }, [wifiNameSt]);

    return {
        sendEnabledSt,
        wifiNameSt,
        onEnableSend,
        onWifiChange
    };
}
