import { useEffect, useCallback, useRef } from 'react';
import eruda from 'eruda';
import viewRouter from '../../../global/view-router';
import Roku from '../../../global/roku';
import Tables from '../../../global/tables';
import { store } from '../../../store/store';
import CordovaPlugins from '../../../global/cordova-plugins';

import { useAppEvents } from './useAppEvents';
import { usePeerSync } from './usePeerSync';
import { useRokuSync } from './useRokuSync';
import { useSupabaseInit } from './useSupabaseInit';

export function useLoad() {
    // 1. Store / Global State
    const isLoadingSt = store(v => v.isLoadingSt);
    const setIsLoadingSt = store(v => v.setIsLoadingSt);
    const isInForegroundSt = store(v => v.isInForegroundSt);
    const userTypeSt = store(v => v.userTypeSt);
    const userNameSt = store(v => v.userNameSt);
    const userDeviceSt = store(v => v.userDeviceSt);
    const peersSt = store(v => v.peersSt);
    const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
    const wifiNameSt = store(v => v.wifiNameSt);
    const networkTypeSt = store(v => v.networkTypeSt);
    const supabaseTimeoutSt = store(v => v.supabaseTimeoutSt);
    const screensSt = store(v => v.screensSt);
    const devicesSt = store(v => v.devicesSt);
    const selectionsSt = store(v => v.selectionsSt);
    const viewSt = store(v => v.viewSt);
    const isPcSt = store(v => v.isPcSt);
    const isAppSt = store(v => v.isAppSt);
    const screenSelectedSt = store(v => v.screenSelectedSt);
    const leaderSt = store(v => v.selectionsSt.find(el => el.table === 'leader')?.id);

    // 2. Refs
    const isLoadingRef = useRef(false);
    const isLoadInitializedRef = useRef(false);
    const isReadyRef = useRef(false);
    const loadFnRef = useRef(null);
    const selectionsRef = useRef(null);

    // 3. Specialized Hooks
    const { setData } = useSupabaseInit();

    useAppEvents(isAppSt);

    usePeerSync(userNameSt, userDeviceSt, leaderSt, peersSt, selectionsRef);

    useRokuSync(userNameSt, userDeviceSt, leaderSt, selectionsSt);

    // 4. Callbacks / Functions
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
        if (firstLoad) {
            setIsLoadingSt(true);
        }
        isLoadingRef.current = true;
        const newView = structuredClone(viewSt);

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
                newView.selected = hdmiSelectionId;
                await viewRouter.changeView(newView);
            }
            await setData('rokuApps');
            await setData('devices');
            await setData('youtubeChannelsLiz');
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
    }, [setData, setIsLoadingSt, viewSt, wifiNameSt, isAppSt, updateNotificationBar]);

    const onSupabaseTimeout = async () => {
        await load();
    };

    const init = useCallback(async () => {
        await load(true);
        if (wifiNameSt === 'Noky') {
            Roku.setIsConnectedToNokyWifi(true);
        }

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
    }, [load, wifiNameSt, userNameSt, userDeviceSt, leaderSt]);

    // 5. Effects
    useEffect(() => {
        if (isReadyRef.current && isLoadInitializedRef.current && isInForegroundSt && isConnectedToInternetSt) {
            loadFnRef.current?.();
        }
    }, [isInForegroundSt, isConnectedToInternetSt]);

    useEffect(() => {
        if (isReadyRef.current) {
            if (isConnectedToInternetSt && ((isPcSt && wifiNameSt === 'Noky') || (wifiNameSt === 'Noky' && networkTypeSt === 'wifi'))) {
                Roku.setIsConnectedToNokyWifi(true);
            } else {
                Roku.setIsConnectedToNokyWifi(false);
            }
        }
    }, [wifiNameSt, networkTypeSt, isPcSt, isInForegroundSt, userNameSt, userDeviceSt, isConnectedToInternetSt]);

    useEffect(() => {
        selectionsRef.current = selectionsSt;
    }, [selectionsSt]);

    // 6. Initialization
    loadFnRef.current = load;
    if (!isLoadInitializedRef.current) {
        isLoadInitializedRef.current = true;
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
