import { useEffect, useCallback } from 'react';
import { store } from '../store/store';
import requests from '../global/requests';
import connection from '../global/connection';
import { useLeader } from './useSelectors';

/**
 * useAppLifecycle Hook
 * Handles the application lifecycle events (Resume, Pause, Visibility Change)
 * across both Cordova (app) and Browser environments.
 */
export function useAppLifecycle() {
    // 1. Store / Global State
    const setIsInForegroundSt = store(v => v.setIsInForegroundSt);
    const userNameSt = store(v => v.userNameSt);
    const isConnectedToInternetSt = store(v => v.isConnectedToInternetSt);
    const isAppSt = store(v => v.isAppSt);
    const leaderSt = useLeader();

    // 2. Callbacks / Functions
    const onResume = useCallback(async () => {
        console.log('To Foreground, the leader is:', leaderSt);
        connection.updateConnection();
        setIsInForegroundSt(true);
        if (isConnectedToInternetSt && userNameSt) {
            requests.updateTable({ id: userNameSt, table: 'users', state: 'foreground' });
        }
    }, [setIsInForegroundSt, userNameSt, leaderSt, isConnectedToInternetSt]);

    const onPause = useCallback(async () => {
        console.log('To Background, the leader is:', leaderSt);
        setIsInForegroundSt(false);
        if (isConnectedToInternetSt && userNameSt) {
            requests.updateTable({ id: userNameSt, table: 'users', state: 'background' });
        }
    }, [isConnectedToInternetSt, setIsInForegroundSt, userNameSt, leaderSt]);

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
