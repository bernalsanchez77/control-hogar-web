import { useEffect, useCallback } from 'react';
import { store } from '../store/store';
import connection from '../global/connection';
import tables from '../global/tables';

/**
 * useAppLifecycle Hook
 * Handles the application lifecycle events (Resume, Pause, Visibility Change)
 * across both Cordova (app) and Browser environments.
 */
export function useAppLifecycle() {
    // 1. Store / Global State
    const isAppSt = store(v => v.isAppSt);

    // 2. Callbacks / Functions
    const onResume = useCallback(async () => {
        console.log('To Foreground');
        store.getState().setIsInForegroundSt(true);

        if (store.getState().networkTypeSt === 'wifi' && (store.getState().wifiNameSt === 'unknown-wifi' || store.getState().wifiNameSt === '')) {
            console.log('unknown-wifi, updating connection');
            await connection.updateConnection();
        }
        if (store.getState().isConnectedToInternetSt && store.getState().userNameDevicesSt) {
            if (store.getState().isLoadingSt) {
                store.getState().setIsLoadingSt(false);
            }
            store.getState().setIsLoadingSt(true);
            await new Promise((resolve) => {
                const unsubscribe = store.subscribe((currState) => {
                    if (!currState.isLoadingSt) {
                        if (unsubscribe) unsubscribe();
                        resolve();
                    }
                });
            });
            tables.updateUserDevicesTable();
        }
    }, []);

    const onPause = useCallback(async () => {
        console.log('To Background');
        store.getState().setIsInForegroundSt(false);
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
