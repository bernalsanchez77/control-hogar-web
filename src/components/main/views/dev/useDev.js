import { useCallback } from 'react';
import { store } from "../../../../store/store";
import connection from '../../../../global/connection';
import tables from '../../../../global/tables/tables';
import { useLeader } from '../../../hooks/useSelectors';

export function useDev() {
    // 1. Store / Global State
    const sendEnabledSt = store(v => v.sendEnabledSt);
    const setSendEnabledSt = store(v => v.setSendEnabledSt);
    const wifiNameSt = store(v => v.wifiNameSt);
    const networkTypeSt = store(v => v.networkTypeSt);
    const isPcSt = store(v => v.isPcSt);
    const leader = useLeader();
    const userNameDevicesSt = store(v => v.userNameDevicesSt);
    const setShowDevViewSt = store(v => v.setShowDevViewSt);
    const simulatePlayStateSt = store(v => v.simulatePlayStateSt);
    const setSimulatePlayStateSt = store(v => v.setSimulatePlayStateSt);

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
        if (wifiNameSt === 'Noky' && leader !== userNameDevicesSt) {
            tables.updateUserDevicesTable(true);
        }
    }, [leader, userNameDevicesSt, wifiNameSt]);

    const onSimulatePlaystateChange = useCallback(() => {
        window.localStorage.setItem('simulate-playstate', !simulatePlayStateSt);
        setSimulatePlayStateSt(!simulatePlayStateSt);
    }, [simulatePlayStateSt, setSimulatePlayStateSt]);

    const onClose = useCallback(() => {
        setShowDevViewSt(false);
    }, [setShowDevViewSt]);

    return {
        sendEnabledSt,
        wifiNameSt,
        networkTypeSt,
        leader,
        simulatePlayStateSt,
        onEnableSend,
        onWifiChange,
        onNetworkChange,
        onLeaderChange,
        onClose,
        onSimulatePlaystateChange
    };
}
