import { useState, useRef, useCallback } from 'react';
import { store } from '../../../../store/store';
import connection from '../../../../global/connection';
import requests from '../../../../global/requests';

export function useCredentials() {
    // 1. Store / Global State
    const setUserTypeSt = store(v => v.setUserTypeSt);
    const setUserNameSt = store(v => v.setUserNameSt);
    const setUserDeviceSt = store(v => v.setUserDeviceSt);
    const setSendEnabledSt = store(v => v.setSendEnabledSt);

    // 2. React State
    const [userValue, setUserValue] = useState('');
    const [deviceValue, setDeviceValue] = useState('');
    const [credentialValue, setCredentialValue] = useState('');

    // 3. Refs
    const userValueRef = useRef('');
    const deviceValueRef = useRef('');
    const credentialValueRef = useRef('');

    // 4. Callbacks / Functions
    const setCredentials = useCallback(async (userType) => {
        if (userValueRef.current.length === 0 || deviceValueRef.current.length === 0 || credentialValueRef.current.length === 0) {
            return;
        }

        const isConnectedToInternet = await connection.getIsConnectedToInternet();
        if (isConnectedToInternet) {
            if (userType === 'guest') {
                const users = await requests.getTable('users');
                if (users.data.find(user => user.id === userValueRef.current)) {
                    localStorage.setItem('user-type', userType);
                    localStorage.setItem('user-name', userValueRef.current);
                    localStorage.setItem('user-device', deviceValueRef.current);
                    setUserNameSt(userValueRef.current);
                    setUserDeviceSt(deviceValueRef.current);
                    setUserTypeSt(userType);
                }
            } else {
                const data = await requests.validateUserType(userType);
                if (data) {
                    const users = await requests.getTable('users');
                    if (users.data.find(user => user.id === userValueRef.current)) {
                        if (data.dev) {
                            localStorage.setItem('user-type', data.dev);
                            setSendEnabledSt(false);
                        } else {
                            localStorage.setItem('user-type', 'owner');
                        }
                        localStorage.setItem('user-name', userValueRef.current);
                        localStorage.setItem('user-device', deviceValueRef.current);
                        setUserNameSt(userValueRef.current);
                        setUserDeviceSt(deviceValueRef.current);
                        setUserTypeSt(data.dev || 'owner');
                    }
                }
            }
        }
    }, [setUserNameSt, setUserDeviceSt, setUserTypeSt, setSendEnabledSt]);

    const setGuestCredential = useCallback(() => {
        setCredentials('guest');
    }, [setCredentials]);

    const setOwnerUser = useCallback((e) => {
        const value = e.target.value;
        setUserValue(value);
        userValueRef.current = value;
        setCredentials(credentialValueRef.current);
    }, [setCredentials]);

    const setOwnerDevice = useCallback((e) => {
        const value = e.target.value;
        setDeviceValue(value);
        deviceValueRef.current = value;
        setCredentials(credentialValueRef.current);
    }, [setCredentials]);

    const setOwnerCredential = useCallback((e) => {
        const value = e.target.value;
        setCredentialValue(value);
        credentialValueRef.current = value;
        setCredentials(value);
    }, [setCredentials]);

    return {
        userValue,
        deviceValue,
        credentialValue,
        setGuestCredential,
        setOwnerUser,
        setOwnerDevice,
        setOwnerCredential
    };
}
