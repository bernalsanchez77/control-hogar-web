import { useEffect, useCallback, useRef } from 'react';
import eruda from 'eruda';
import supabaseChannels from '../../global/supabaseChannels';
import viewRouter from '../../global/viewRouter';
import requests from '../../global/initRequests';
import Tables from '../../../runtime/tables/tables';
import events from './events/events';
import timeSync from '../../../utils/timeSync';
import { store } from '../../../store/store';

export function useLoad() {
    // 1. Store / Global State
    const isLoadingMessageShowingSt = store(v => v.isLoadingMessageShowingSt);
    const setIsLoadingMessageShowingSt = store(v => v.setIsLoadingMessageShowingSt);
    const userTypeSt = store(v => v.userTypeSt);
    const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
    const userNameDevicesSt = store(v => v.userNameDevicesSt);
    const wifiNameSt = store(v => v.wifiNameSt);
    const supabaseTimeoutSt = store(v => v.supabaseTimeoutSt);
    const setSupabaseTimeoutSt = store(v => v.supabaseSetTimeoutSt);
    const updateTablesSt = store((v) => v.updateTablesSt);
    const setTableSt = store((v) => v.setTableSt);
    const screensSt = store(v => v.screensSt);
    const devicesSt = store(v => v.devicesSt);
    const viewSt = store(v => v.viewSt);
    const isAppSt = store(v => v.isAppSt);
    const isLoadInitializedSt = store(v => v.isLoadInitializedSt);
    const setIsLoadInitializedSt = store(v => v.setIsLoadInitializedSt);
    const isRestartingSt = store(v => v.isRestartingSt);
    const showDevViewSt = store(v => v.showDevViewSt);

    // 2. Refs
    const isReadyRef = useRef(false);

    // 3. Callbacks / Functions
    const subscribeToSupabaseChannel = useCallback(async (tableName, callback) => {
        let response = '';
        await supabaseChannels.subscribeToSupabaseChannel(tableName, async (change) => {
            if (change.eventType === 'INSERT' || change.eventType === 'UPDATE') {
                updateTablesSt(tableName + 'St', change.new);
                if (callback) {
                    await callback(change.old, change.new, change.eventType);
                }
            }
        }, true).then((res) => {
            if (res.success) {
                response = 'SUBSCRIBED';
                setSupabaseTimeoutSt(false);
            } else {
                switch (res.msg) {
                    case 'TIMED_OUT':
                        response = res.msg;
                        setSupabaseTimeoutSt(true);
                        break;
                    case 'CHANNEL_ERROR':
                    case 'CLOSED':
                    default:
                        response = res.msg;
                        setSupabaseTimeoutSt(false);
                }
            }
        }).catch((res) => {
            response = res.msg;
        });
        return response;
    }, [setSupabaseTimeoutSt, updateTablesSt]);

    const setData = useCallback(async (tableName, data, returnTable, callback) => {
        let subscriptionResponse = '';
        let table = data || await requests.getTable(tableName);
        if (table && table.status === 200 && table.data) {
            setTableSt(tableName + 'St', table.data);
            const tableChannel = supabaseChannels.getSupabaseChannelState(tableName);
            if (tableChannel?.channel) {
                const state = tableChannel.channel.state;
                if (state === 'joined') {
                    subscriptionResponse = 'SUBSCRIBED';
                } else {
                    if (tableChannel.subscribed) {
                        await supabaseChannels.unsubscribeFromSupabaseChannel(tableName);
                    }
                    subscriptionResponse = await subscribeToSupabaseChannel(tableName, callback);
                }
            } else {
                subscriptionResponse = await subscribeToSupabaseChannel(tableName, callback);
            }
            if (returnTable) {
                return table.data;
            } else {
                return { table, subscriptionResponse };
            }
        } else {
            return { table: null };
        }
    }, [subscribeToSupabaseChannel, setTableSt]);

    const saveTableDataInLocalStorage = useCallback(async (tableName, callback) => {
        const tableData = await setData(tableName, null, true, callback);
        if (Array.isArray(tableData)) {
            localStorage.setItem(tableName, JSON.stringify(tableData));
        }
    }, [setData]);

    const handleData = useCallback(async (selectionsTable, tableName, callback) => {
        if (selectionsTable.table.data.find((sl) => sl.table === 'cache').id === 'on') {
            const tableData = localStorage.getItem(tableName);
            if (tableData) {
                const table = { data: JSON.parse(tableData), status: 200 };
                await setData(tableName, table, false, callback);
            } else {
                await saveTableDataInLocalStorage(tableName, callback);
            }
        } else {
            await saveTableDataInLocalStorage(tableName, callback);
        }
    }, [saveTableDataInLocalStorage, setData]);

    const load = useCallback(async (isFirstLoad = false) => {
        // if (store.getState().isLoadingSt) return;

        // console.log('load');
        store.getState().setIsLoadingSt(true);
        // if (isFirstLoad) {
        //     setIsLoadingMessageShowingSt(true);
        // }

        const selectionsTable = await setData('selections', null, false, (oldItem, newItem, eventType) => {
            Tables.onSelectionsTableChange(oldItem, newItem, eventType);
        });

        if (selectionsTable.table && selectionsTable.subscriptionResponse === 'SUBSCRIBED') {
            await setData('hdmiSala', null, false, async (oldItem, newItem, eventType) => {
                Tables.onHdmiSalaTableChange(oldItem, newItem, eventType);
            });
            const userDevicesTable = localStorage.getItem('userDevices');
            const userDevices = userDevicesTable ? JSON.parse(userDevicesTable) : null;
            await setData('userDevices', userDevices, false, (oldItem, newItem, eventType) => {
                Tables.onUserDevicesTableChange(oldItem, newItem, eventType);
            });
            await setData('screens', null, false, async (oldItem, newItem, eventType) => {
                Tables.onScreensTableChange(oldItem, newItem, eventType);
            });

            const hdmiSelectionId = store.getState().selectionsSt.find(el => el.table === 'hdmiSala')?.id;
            if (hdmiSelectionId) {
                await viewRouter.onHdmiSalaTableChange(hdmiSelectionId);
            }
            await handleData(selectionsTable, 'rokuApps');
            await handleData(selectionsTable, 'youtubeChannels');
            await handleData(selectionsTable, 'youtubeChannelsImages');
            await handleData(selectionsTable, 'cableChannels');
            if (store.getState().viewSt.roku.apps.selected === 'youtube') {
                await setData('youtubeVideos', null, false, (oldItem, newItem, eventType) => {
                    Tables.onYoutubeVideosTableChange(oldItem, newItem, eventType);
                });
                setIsLoadingMessageShowingSt(false);
            } else {
                setIsLoadingMessageShowingSt(false);
                await setData('youtubeVideos', null, false, (oldItem, newItem, eventType) => {
                    Tables.onYoutubeVideosTableChange(oldItem, newItem, eventType);
                });
            }
            await setData('devices', null, false, (oldItem, newItem, eventType) => {
                Tables.onDevicesTableChange(oldItem, newItem, eventType);
            });
        } else {
            setIsLoadingMessageShowingSt(false);
        }
        store.getState().setIsLoadingSt(false);

        requests.updateTable({
            id: store.getState().userNameDevicesSt,
            table: 'userDevices',
            date: store.getState().userDevicesSt.find(el => el.id === store.getState().userNameDevicesSt)?.date,
            isInForeground: store.getState().isInForegroundSt,
            isConnectedToNoky: store.getState().isConnectedToNokySt,
            isInPresence: true,
            wifiName: store.getState().wifiNameSt,
            networkType: store.getState().networkTypeSt,
            screenSelected: store.getState().screenSelectedSt,
            isConnectedToInternet: true,
            initDate: timeSync.getSyncedIsoString(),
        });
    }, [setData, setIsLoadingMessageShowingSt, handleData]);

    const onSupabaseTimeout = async () => {
        await load();
    };

    const init = useCallback(async () => {
        if (localStorage.getItem('user-type') !== 'guest' && localStorage.getItem('user-type') !== 'owner') {
            eruda.init();
        }
        await load(true);

        // await supabasePeers.subscribeToPeersChannel();
        isReadyRef.current = true;
    }, [load]);

    // 4. Effects
    useEffect(() => {
        const unsub = store.subscribe(
            async (newState, oldState) => {
                if (newState.isLoadingSt && !oldState.isLoadingSt) {
                    await load();
                }
            }
        );
        return unsub;
    }, [userNameDevicesSt, load]);

    useEffect(() => {
        if (isAppSt) {
            document.addEventListener("backbutton", events.onNavigationBack);
            document.addEventListener("volumeupbutton", events.onVolumeUp);
            document.addEventListener("volumedownbutton", events.onVolumeDown);
        }
        window.addEventListener("popstate", events.onNavigationBack);

        return () => {
            if (isAppSt) {
                document.removeEventListener("backbutton", events.onNavigationBack);
                document.removeEventListener("volumeupbutton", events.onVolumeUp);
                document.removeEventListener("volumedownbutton", events.onVolumeDown);
            }
            window.removeEventListener("popstate", events.onNavigationBack);
        };
    }, [isAppSt]);

    // 5. Initialization
    if (!isLoadInitializedSt) {
        setIsLoadInitializedSt(true);
        init();
    }

    return {
        viewSt,
        isLoadingMessageShowingSt,
        userTypeSt,
        wifiNameSt,
        isConnectedToInternetSt,
        supabaseTimeoutSt,
        screensSt,
        devicesSt,
        isRestartingSt,
        showDevViewSt,
        onSupabaseTimeout
    };
}
