import { useEffect, useCallback, useRef } from 'react';
import eruda from 'eruda';
import supabaseChannels from '../../../global/supabase/supabase-channels';
import supabasePeers from '../../../global/supabase/supabase-peers';
import viewRouter from '../../../global/view-router';
import requests from '../../../global/requests';
import Roku from '../../../global/roku';
import CordovaPlugins from '../../../global/cordova-plugins';
import Tables from '../../../global/tables';
import events from '../../../global/events';
import { store } from '../../../store/store';
import { useLeader } from '../../../hooks/useSelectors';

export function useLoad() {
    // 1. Store / Global State
    const isLoadingSt = store(v => v.isLoadingSt);
    const setIsLoadingSt = store(v => v.setIsLoadingSt);
    const userTypeSt = store(v => v.userTypeSt);
    const userNameSt = store(v => v.userNameSt);
    const userDeviceSt = store(v => v.userDeviceSt);
    const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
    const wifiNameSt = store(v => v.wifiNameSt);
    const supabaseTimeoutSt = store(v => v.supabaseTimeoutSt);
    const setSupabaseTimeoutSt = store(v => v.supabaseSetTimeoutSt);
    const updateTablesSt = store((v) => v.updateTablesSt);
    const setTableSt = store((v) => v.setTableSt);
    const screensSt = store(v => v.screensSt);
    const devicesSt = store(v => v.devicesSt);
    const selectionsSt = store(v => v.selectionsSt);
    const viewSt = store(v => v.viewSt);
    const isAppSt = store(v => v.isAppSt);
    const screenSelectedSt = store(v => v.screenSelectedSt);
    const isLoadInitializedSt = store(v => v.isLoadInitializedSt);
    const setIsLoadInitializedSt = store(v => v.setIsLoadInitializedSt);

    const leaderSt = useLeader();

    // 2. Refs
    const isReadyRef = useRef(false);
    const isLoadingRef = useRef(false);
    const selectionsRef = useRef(null);

    // 3. Callbacks / Functions
    const subscribeToSupabaseChannel = useCallback(async (tableName, callback) => {
        let response = '';
        await supabaseChannels.subscribeToSupabaseChannel(tableName, async (itemName, newItem) => {
            updateTablesSt(tableName + 'St', newItem);
            if (callback) {
                await callback(newItem);
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
                if (state !== 'joined') {
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
        console.log('load');
        if (firstLoad) {
            setIsLoadingSt(true);
        }
        isLoadingRef.current = true;
        const hdmiSalaTable = await setData('hdmiSala', false, async (change) => {
            Tables.onHdmiSalaTableChange(change);
        });

        if (hdmiSalaTable.table && hdmiSalaTable.subscriptionResponse === 'SUBSCRIBED') {
            await setData('screens', false, async (change) => {
                Tables.onScreensTableChange(change);
            });

            setIsLoadingSt(false);
            await setData('selections', true, (change) => {
                Tables.onSelectionsTableChange(change);
            });
            const hdmiSelectionId = store.getState().selectionsSt.find(el => el.table === 'hdmiSala')?.id;
            if (hdmiSelectionId) {
                await viewRouter.onHdmiSalaTableChange(hdmiSelectionId);
            }
            await setData('rokuApps');
            await setData('devices');
            await setData('youtubeChannels');
            await setData('youtubeChannelsImages');
            await setData('cableChannels');
            await setData('youtubeVideos', true, (change) => {
                Tables.onYoutubeVideosTableChange(change);
            });
        }
        if (isAppSt) {
            updateNotificationBar();
        }
        if (wifiNameSt === 'Noky') {
            Roku.setRoku();
        }
        setIsLoadingSt(false);
        isLoadingRef.current = false;
    }, [setData, setIsLoadingSt, wifiNameSt, isAppSt, updateNotificationBar]);

    const onSupabaseTimeout = async () => {
        await load();
    };

    const init = useCallback(async () => {
        console.log('init load');
        await load(true);
        // if (wifiNameSt === 'Noky') {
        //     Roku.setIsConnectedToNokyWifi(true);
        // }
        await supabasePeers.subscribeToPeersChannel();
        const youtubeVideosSelectedId = store.getState().selectionsSt.find(el => el.table === 'youtubeVideos')?.id;
        if (youtubeVideosSelectedId) {
            if (userNameSt + '-' + userDeviceSt === leaderSt && !Roku.playStateInterval) {
                const youtubeVideosSelected = store.getState().youtubeVideosSt.find(el => el.id === youtubeVideosSelectedId) || {};
                if (youtubeVideosSelected) {
                    Roku.startPlayStateListener(youtubeVideosSelected);
                }
            }
        }
        isReadyRef.current = true;
        if (localStorage.getItem('user-type') !== 'guest' && localStorage.getItem('user-type') !== 'owner') {
            eruda.init();
        }
    }, [load, userNameSt, userDeviceSt, leaderSt]);

    // 4. Effects
    useEffect(() => {
        const unsub = store.subscribe(
            async (newState, oldState) => {
                if (supabasePeers.peersChannel.status === 'unsubscribed') {
                    console.log('resubscribing to peers channel from useEffect');
                    supabasePeers.subscribeToPeersChannel();
                } else {
                    if (newState.isConnectedToNokySt !== oldState.isConnectedToNokySt) {
                        console.log('resubscribing to peers channel from useEffect after isConnectedToNokySt change');
                        supabasePeers.peersChannel.track({
                            name: userNameSt + '-' + userDeviceSt,
                            date: new Date().toISOString(),
                            isConnectedToNoky: newState.isConnectedToNokySt,
                            isInForeground: newState.isInForegroundSt,
                        });
                        if (newState.isConnectedToNokySt) {
                            await load();
                        }
                    }
                    if (newState.isInForegroundSt !== oldState.isInForegroundSt) {
                        console.log('resubscribing to peers channel from useEffect after isInForegroundSt change');
                        supabasePeers.peersChannel.track({
                            name: userNameSt + '-' + userDeviceSt,
                            date: store.getState().peersSt.find(el => el.name === userNameSt + '-' + userDeviceSt)?.date,
                            isConnectedToNoky: newState.isConnectedToNokySt,
                            isInForeground: newState.isInForegroundSt,
                        });
                        if (newState.isInForegroundSt) {
                            await load();
                        }
                    }
                    if (newState.leaderSt !== oldState.leaderSt) {
                        if (newState.leaderSt === userNameSt + '-' + userDeviceSt) {
                            if (!Roku.playStateInterval) {
                                const youtubeVideosSelectedId = store.getState().selectionsSt.find(el => el.table === 'youtubeVideos')?.id;
                                if (youtubeVideosSelectedId) {
                                    const youtubeVideosSelected = store.getState().youtubeVideosSt.find(el => el.id === youtubeVideosSelectedId);
                                    Roku.startPlayStateListener(youtubeVideosSelected);
                                }
                            }
                            const playState = await Roku.getPlayState('state');
                            if (playState && playState !== selectionsRef.current?.find(el => el.table === 'playState')?.id) {
                                requests.updateSelections({ table: 'playState', id: playState });
                            }
                        } else {
                            if (Roku.playStateInterval) {
                                Roku.stopPlayStateListener();
                            }
                        }
                    }
                }
            }
        );
        return unsub;
    }, [userNameSt, userDeviceSt, load]);

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

    useEffect(() => {
        selectionsRef.current = selectionsSt;
    }, [selectionsSt]);

    // 5. Initialization
    if (!isLoadInitializedSt) {
        setIsLoadInitializedSt(true);
        init();
    }

    return {
        viewSt,
        isLoadingSt,
        userTypeSt,
        wifiNameSt,
        isConnectedToInternetSt,
        supabaseTimeoutSt,
        screensSt,
        devicesSt,
        onSupabaseTimeout
    };
}
