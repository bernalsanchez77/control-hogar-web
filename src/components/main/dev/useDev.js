import { useCallback } from 'react';
import { store } from "../../../store/store";
import connection from '../../../global/connection';
import requests from '../../../global/requests';
import { useLeader } from '../../../hooks/useSelectors';

export function useDev() {
    // 1. Store / Global State
    const sendEnabledSt = store(v => v.sendEnabledSt);
    const setSendEnabledSt = store(v => v.setSendEnabledSt);
    const wifiNameSt = store(v => v.wifiNameSt);
    const networkTypeSt = store(v => v.networkTypeSt);
    const userNameSt = store(v => v.userNameSt);
    const userDeviceSt = store(v => v.userDeviceSt);
    const leaderSt = useLeader();

    // 2. Callbacks / Functions
    const onEnableSend = useCallback(() => {
        setSendEnabledSt(!sendEnabledSt);
    }, [sendEnabledSt, setSendEnabledSt]);

    const onWifiChange = useCallback(() => {
        if (wifiNameSt === 'Noky') {
            connection.onWifiNameChange('Cometa');
            connection.onNetworkTypeChange('wifi');
        } else {
            connection.onWifiNameChange('Noky');
            connection.onNetworkTypeChange('wifi');
        }
    }, [wifiNameSt]);

    const onNetworkChange = useCallback(() => {
        if (networkTypeSt === 'wifi') {
            connection.onWifiNameChange('');
            connection.onNetworkTypeChange('cellular');
        } else {
            connection.onWifiNameChange('Noky');
            connection.onNetworkTypeChange('wifi');
        }
    }, [networkTypeSt]);

    const onLeaderChange = useCallback(() => {
        if (wifiNameSt === 'Noky' && leaderSt !== userNameSt + '-' + userDeviceSt) {
            requests.updateSelections({ table: 'leader', id: userNameSt + '-' + userDeviceSt });
        }
    }, [leaderSt, userNameSt, userDeviceSt, wifiNameSt]);

    return {
        sendEnabledSt,
        wifiNameSt,
        networkTypeSt,
        leaderSt,
        onEnableSend,
        onWifiChange,
        onNetworkChange,
        onLeaderChange
    };
}
