import { useEffect, useCallback } from 'react';
import { store } from '../store/store';
import requests from '../global/requests';

/**
 * useAppLifecycle Hook
 * Handles the application lifecycle events (Resume, Pause, Visibility Change)
 * across both Cordova (app) and Browser environments.
 */
export function useAppLifecycle() {
    // 1. Store / Global State
    const setIsInForegroundSt = store(v => v.setIsInForegroundSt);
    const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
    const setIsLoadingSt = store(v => v.setIsLoadingSt);
    const isAppSt = store(v => v.isAppSt);
    const userNameDeviceSt = store(v => v.userNameDeviceSt);

    // 2. Callbacks / Functions
    const onResume = useCallback(async () => {
        console.log('To Foreground');
        setIsInForegroundSt(true);
        if (isConnectedToInternetSt && userNameDeviceSt) {
            setIsLoadingSt(true);
            await new Promise((resolve) => {
                const unsubscribe = store.subscribe((state) => {
                    if (!state.isLoadingSt) {
                        if (unsubscribe) unsubscribe();
                        resolve();
                    }
                });
            });
            requests.updateTable({
                id: userNameDeviceSt,
                table: 'userDevices',
                date: store.getState().userDevicesSt.find(el => el.id === userNameDeviceSt)?.date,
                isInForeground: true,
                isConnectedToNoky: store.getState().isConnectedToNokySt,
                isConnectedToInternet: store.getState().isConnectedToInternetSt
            });
        }
    }, [setIsInForegroundSt, isConnectedToInternetSt, userNameDeviceSt, setIsLoadingSt]);

    const onPause = useCallback(async () => {
        console.log('To Background');
        setIsInForegroundSt(false);
        if (isConnectedToInternetSt && userNameDeviceSt) {
            requests.updateTable({
                id: userNameDeviceSt,
                table: 'userDevices',
                date: store.getState().userDevicesSt.find(el => el.id === userNameDeviceSt)?.date,
                isInForeground: false,
                isConnectedToNoky: store.getState().isConnectedToNokySt,
                isConnectedToInternet: store.getState().isConnectedToInternetSt
            });
        }
    }, [isConnectedToInternetSt, setIsInForegroundSt, userNameDeviceSt]);

    const onVisibilityChange = useCallback(() => {
        if (document.visibilityState === 'visible') {
            onResume();
        } else {
            onPause();
        }
    }, [onPause, onResume]);

    // 3. Effects
    useEffect(() => {
        if (isAppSt) {
            document.addEventListener("pause", onPause);
            document.addEventListener("resume", onResume);
        } else {
            document.addEventListener('visibilitychange', onVisibilityChange);
        }

        return () => {
            if (isAppSt) {
                document.removeEventListener("pause", onPause);
                document.removeEventListener("resume", onResume);
            } else {
                document.removeEventListener('visibilitychange', onVisibilityChange);
            }
        };
    }, [isAppSt, onPause, onResume, onVisibilityChange]);
}
