import { useEffect, useCallback } from 'react';
import { store } from '../../store/store';
import tables from '../../bridge/tables/tables';
import requests from '../../components/global/requests';
import lifecycle from '../global/lifecycle';
/**
 * useAppLifecycle Hook
 * Handles the application lifecycle events (Resume, Pause, Visibility Change)
 * across both Cordova (app) and Browser environments.
 */
export function useAppLifecycle(isReady) {
    // 1. Store / Global State
    const isAppSt = store(v => v.isAppSt);

    // 2. Callbacks / Functions
    const onResume = useCallback(async () => {
        console.log('To Foreground');
        const userDevicesTable = await requests.getTable('userDevices');
        localStorage.setItem('userDevices', JSON.stringify(userDevicesTable));
        const user = store.getState().userNameDevicesSt;
        const userDevice = userDevicesTable.data.find(el => el.id === user);
        if (!userDevice.isInPresence) {
            await lifecycle.handleRestart();
        } else {
            store.getState().setIsInForegroundSt(true);
            if (store.getState().networkTypeSt === 'wifi' && (store.getState().wifiNameSt === 'unknown-wifi' || store.getState().wifiNameSt === '')) {
                console.log('unknown-wifi, updating connection');
                await lifecycle.updateConnection();
            }
            if (store.getState().isConnectedToInternetSt && store.getState().userNameDevicesSt) {
                if (store.getState().isLoadingSt) {
                    store.getState().setIsLoadingSt(false);
                }
                store.getState().setIsLoadingSt(true);
                await new Promise((resolve) => {
                    const unsubscribe = store.subscribe((currentState) => {
                        if (!currentState.isLoadingSt) {
                            if (unsubscribe) unsubscribe();
                            resolve();
                        }
                    });
                });
                tables.updateUserDevicesTable();
            }
        }
    }, []);

    const onPause = useCallback(async () => {
        console.log('To Background');
        store.getState().setIsInForegroundSt(false);
        store.getState().setIsLoadingMessageShowingSt(true);
        if (store.getState().isConnectedToInternetSt && store.getState().userNameDevicesSt) {
            tables.updateUserDevicesTable();
        }
    }, []);

    const onVisibilityChange = useCallback(() => {
        if (document.visibilityState === 'visible') {
            onResume();
        } else {
            onPause();
        }
    }, [onPause, onResume]);

    // 3. Effects
    useEffect(() => {
        if (isReady) {
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
        }
    }, [isAppSt, onPause, onResume, onVisibilityChange, isReady]);
}
