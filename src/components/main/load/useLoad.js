import { useEffect, useCallback, useRef } from 'react';
import eruda from 'eruda';
import supabaseChannels from '../../../global/supabase/supabase-channels';
import supabasePeers from '../../../global/supabase/supabase-peers';
import viewRouter from '../../../global/view-router';
import requests from '../../../global/requests';
import Roku from '../../../global/roku';
import CordovaPlugins from '../../../global/cordova-plugins';
import Tables from '../../../global/tables/tables';
import events from './events/events';
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
    const screenSelectedSt = store(v => v.screenSelectedSt);
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

    const setData = useCallback(async (tableName, data, callback) => {
        let subscriptionResponse = '';
        let table = await requests.getTable(tableName);
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
            if (data) {
                return table.data;
            } else {
                return { table, subscriptionResponse };
            }
        } else {
            return { table: null };
        }
    }, [subscribeToSupabaseChannel, setTableSt]);

    const updateNotificationBar = useCallback(async () => {
        const isPlaying = store.getState().selectionsSt.find(el => el.table === 'playState')?.id === 'play';
        CordovaPlugins.updatePlayState(isPlaying);
        const screenSelected = store.getState().screensSt.find(el => el.id === screenSelectedSt);
        if (screenSelected) {
            CordovaPlugins.updateScreenSelected(screenSelected.label + ' ' + screenSelected.state.toUpperCase());
            CordovaPlugins.updateScreenState(screenSelected.state);
            CordovaPlugins.updateMuteState(screenSelected.mute);
        }
        const rokuAppsSelectedRokuId = store.getState().selectionsSt.find(el => el.table === 'rokuApps')?.id;
        const appSelected = store.getState().rokuAppsSt.find(el => el.rokuId === rokuAppsSelectedRokuId);
        if (appSelected) {
            CordovaPlugins.updateAppSelected(appSelected.label);
        }
    }, [screenSelectedSt]);

    const load = useCallback(async (firstLoad = false) => {
        // if (store.getState().isLoadingSt) return;

        console.log('load');
        store.getState().setIsLoadingSt(true);
        if (firstLoad) {
            setIsLoadingMessageShowingSt(true);
        }
        const hdmiSalaTable = await setData('hdmiSala', false, async (oldItem, newItem, eventType) => {
            Tables.onHdmiSalaTableChange(oldItem, newItem, eventType);
        });

        if (hdmiSalaTable.table && hdmiSalaTable.subscriptionResponse === 'SUBSCRIBED') {
            await setData('userDevices', true, (oldItem, newItem, eventType) => {
                Tables.onUserDevicesTableChange(oldItem, newItem, eventType);
            });
            await setData('screens', false, async (oldItem, newItem, eventType) => {
                Tables.onScreensTableChange(oldItem, newItem, eventType);
            });
            await setData('selections', true, (oldItem, newItem, eventType) => {
                Tables.onSelectionsTableChange(oldItem, newItem, eventType);
            });
            setIsLoadingMessageShowingSt(false);
            const hdmiSelectionId = store.getState().selectionsSt.find(el => el.table === 'hdmiSala')?.id;
            if (hdmiSelectionId) {
                await viewRouter.onHdmiSalaTableChange(hdmiSelectionId);
            }
            await setData('rokuApps');
            await setData('devices', true, (oldItem, newItem, eventType) => {
                Tables.onDevicesTableChange(oldItem, newItem, eventType);
            });
            await setData('youtubeChannels');
            await setData('youtubeChannelsImages');
            await setData('cableChannels');
            await setData('youtubeVideos', true, (oldItem, newItem, eventType) => {
                Tables.onYoutubeVideosTableChange(oldItem, newItem, eventType);
            });
        }
        if (isAppSt) {
            updateNotificationBar();
        }
        if (wifiNameSt === 'Noky') {
            Roku.updateDataInSelections();
        }
        setIsLoadingMessageShowingSt(false);
        store.getState().setIsLoadingSt(false);
    }, [setData, setIsLoadingMessageShowingSt, wifiNameSt, isAppSt, updateNotificationBar]);

    const onSupabaseTimeout = async () => {
        await load();
    };

    const init = useCallback(async () => {
        if (localStorage.getItem('user-type') !== 'guest' && localStorage.getItem('user-type') !== 'owner') {
            eruda.init();
        }
        await load(true);
        await supabasePeers.subscribeToPeersChannel();
        const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;
        if (store.getState().isConnectedToNokySt && userNameDevicesSt === leader) {
            Roku.activatePlayStateListener();
        }
        isReadyRef.current = true;
    }, [load, userNameDevicesSt]);

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
