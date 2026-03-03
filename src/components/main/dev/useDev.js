import { useCallback } from 'react';
import { store } from "../../../store/store";
import connection from '../../../global/connection';
import { useLeader } from '../../../hooks/useSelectors';
import supabasePeers from '../../../global/supabase/supabase-peers';

export function useDev() {
    // 1. Store / Global State
    const sendEnabledSt = store(v => v.sendEnabledSt);
    const setSendEnabledSt = store(v => v.setSendEnabledSt);
    const wifiNameSt = store(v => v.wifiNameSt);
    const networkTypeSt = store(v => v.networkTypeSt);
    const userNameSt = store(v => v.userNameSt);
    const userDeviceSt = store(v => v.userDeviceSt);
    const isPcSt = store(v => v.isPcSt);
    const leaderSt = useLeader();

    // 2. Callbacks / Functions
    const onEnableSend = useCallback(() => {
        if (sendEnabledSt) {
            window.localStorage.setItem('send-enabled', 'false');
            setSendEnabledSt(false);
        } else {
            window.localStorage.setItem('send-enabled', 'true');
            setSendEnabledSt(true);
        }
    }, [sendEnabledSt, setSendEnabledSt]);

    const onWifiChange = useCallback(() => {
        if (wifiNameSt === 'Noky') {
            connection.onWifiNameChange('Cometa');
            connection.onNetworkTypeChange('wifi');
            if (isPcSt) {
                window.localStorage.setItem('wifi-name', 'Cometa');
                window.localStorage.setItem('network-type', 'wifi');
            }
        } else {
            connection.onWifiNameChange('Noky');
            connection.onNetworkTypeChange('wifi');
            if (isPcSt) {
                window.localStorage.setItem('wifi-name', 'Noky');
                window.localStorage.setItem('network-type', 'wifi');
            }
        }
    }, [wifiNameSt, isPcSt]);

    const onNetworkChange = useCallback(() => {
        if (networkTypeSt === 'wifi') {
            connection.onWifiNameChange('');
            connection.onNetworkTypeChange('cellular');
            if (isPcSt) {
                window.localStorage.setItem('wifi-name', '');
                window.localStorage.setItem('network-type', 'cellular');
            }
        } else {
            connection.onWifiNameChange('Noky');
            connection.onNetworkTypeChange('wifi');
            if (isPcSt) {
                window.localStorage.setItem('wifi-name', 'Noky');
                window.localStorage.setItem('network-type', 'wifi');
            }
        }
    }, [networkTypeSt, isPcSt]);

    const onLeaderChange = useCallback(async () => {
        if (wifiNameSt === 'Noky' && leaderSt !== userNameSt + '-' + userDeviceSt) {
            await supabasePeers.trackPeers(new Date().toISOString(), store.getState().isConnectedToNokySt, store.getState().isInForegroundSt);
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
