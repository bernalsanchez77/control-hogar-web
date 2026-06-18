import { useCallback } from 'react';
import { store } from "../../../../store/store";
import tables from '../../../../bridge/tables/tables';
import { useLeader } from '../../../hooks/useSelectors';
import requests from '../../../global/requests';

export function useDev() {
    // 1. Store / Global State
    const sendEnabledSt = store(v => v.sendEnabledSt);
    const setSendEnabledSt = store(v => v.setSendEnabledSt);
    const wifiNameSt = store(v => v.wifiNameSt);
    const userDevicesSt = store(v => v.userDevicesSt);
    const networkTypeSt = store(v => v.networkTypeSt);
    const isPcSt = store(v => v.isPcSt);
    const leader = useLeader();
    const userNameDevicesSt = store(v => v.userNameDevicesSt);
    const setShowDevViewSt = store(v => v.setShowDevViewSt);
    const simulatePlayStateSt = store(v => v.simulatePlayStateSt);
    const setSimulatePlayStateSt = store(v => v.setSimulatePlayStateSt);
    const skipLeaderSt = store(v => v.skipLeaderSt);
    const setSkipLeaderSt = store(v => v.setSkipLeaderSt);
    const setNetworkTypeSt = store(v => v.setNetworkTypeSt);
    const setWifiNameSt = store(v => v.setWifiNameSt);

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
            requests.updateTable({
                date: userDevicesSt.find(el => el.id === userNameDevicesSt).date,
                id: userNameDevicesSt,
                table: 'userDevices',
                wifiName: 'Cometa',
                networkType: 'wifi'
            });
            if (isPcSt) {
                window.localStorage.setItem('wifi-name', 'Cometa');
                window.localStorage.setItem('prev-wifi-name', 'Cometa');
                window.localStorage.setItem('network-type', 'wifi');
                setWifiNameSt('Cometa');
                setNetworkTypeSt('wifi');
            }
        } else {
            requests.updateTable({
                date: userDevicesSt.find(el => el.id === userNameDevicesSt).date,
                id: userNameDevicesSt,
                table: 'userDevices',
                wifiName: 'Noky',
                networkType: 'wifi'
            });
            if (isPcSt) {
                window.localStorage.setItem('wifi-name', 'Noky');
                window.localStorage.setItem('prev-wifi-name', 'Noky');
                window.localStorage.setItem('network-type', 'wifi');
                setWifiNameSt('Noky');
                setNetworkTypeSt('wifi');
            }
        }
    }, [wifiNameSt, isPcSt, userNameDevicesSt, userDevicesSt, setWifiNameSt, setNetworkTypeSt]);

    const onNetworkChange = useCallback(() => {
        if (networkTypeSt === 'wifi') {
            requests.updateTable({
                date: userDevicesSt.find(el => el.id === userNameDevicesSt).date,
                id: userNameDevicesSt,
                table: 'userDevices',
                wifiName: '',
                networkType: 'cellular'
            });
            if (isPcSt) {
                window.localStorage.setItem('wifi-name', '');
                window.localStorage.setItem('network-type', 'cellular');
                setNetworkTypeSt('cellular');
                setWifiNameSt('');
            }
        } else {
            const prevWifi = window.localStorage.getItem('prev-wifi-name') || 'Noky';
            requests.updateTable({
                date: userDevicesSt.find(el => el.id === userNameDevicesSt).date,
                id: userNameDevicesSt,
                table: 'userDevices',
                wifiName: prevWifi,
                networkType: 'wifi'
            });
            if (isPcSt) {
                window.localStorage.setItem('wifi-name', prevWifi);
                window.localStorage.setItem('network-type', 'wifi');
                setNetworkTypeSt('wifi');
                setWifiNameSt(prevWifi);
            }
        }
    }, [networkTypeSt, isPcSt, userNameDevicesSt, userDevicesSt, setNetworkTypeSt, setWifiNameSt]);

    const onLeaderChange = useCallback(async () => {
        if (wifiNameSt === 'Noky' && leader !== userNameDevicesSt) {
            tables.updateUserDevicesTable(true);
        }
    }, [leader, userNameDevicesSt, wifiNameSt]);

    const onSimulatePlaystateChange = useCallback(() => {
        window.localStorage.setItem('simulate-playstate', !simulatePlayStateSt);
        setSimulatePlayStateSt(!simulatePlayStateSt);
    }, [simulatePlayStateSt, setSimulatePlayStateSt]);

    const onSkipLeaderChange = useCallback(() => {
        window.localStorage.setItem('skip-leader', !skipLeaderSt);
        setSkipLeaderSt(!skipLeaderSt);
    }, [skipLeaderSt, setSkipLeaderSt]);

    const onClose = useCallback(() => {
        setShowDevViewSt(false);
    }, [setShowDevViewSt]);

    return {
        sendEnabledSt,
        wifiNameSt,
        networkTypeSt,
        leader,
        simulatePlayStateSt,
        skipLeaderSt,
        onEnableSend,
        onWifiChange,
        onNetworkChange,
        onLeaderChange,
        onClose,
        onSimulatePlaystateChange,
        onSkipLeaderChange
    };
}
