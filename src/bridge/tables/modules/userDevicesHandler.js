import { store } from '../../../store/store';
import requests from '../../global/requests';
import roku from '../../global/roku';
import utils from '../../../utils/utils';
import PeersChannel from '../../../global/supabase/supabase-peers';
import SupabaseChannels from '../../../global/supabase/supabase-channels';
import supabase from '../../../global/supabase/supabase-client';
import Statusbar from '../../global/statusbar';
import BackgroundService from '../../global/backgroundService';

const handleUserDevices = async (userBefore, userNow, eventType, userNameDevice, leader) => {
    console.log('userBefore', userBefore);
    console.log('userNow', userNow);

    const userDevices = store.getState().userDevicesSt;
    const expectedLeader = utils.getExpectedLeader(userDevices, store.getState().peersSt);


    const handleRestart = async () => {
        if (store.getState().isRestartingSt) return;
        store.getState().setIsLoadingMessageShowingSt(false);
        if (store.getState().isConnectedToInternetIntervalSt) {
            clearInterval(store.getState().isConnectedToInternetIntervalSt);
            store.getState().setIsConnectedToInternetIntervalSt(null);
        }
        if (store.getState().isAppSt) {
            await BackgroundService.stopWifiNameListener();
            await BackgroundService.stopNetworkTypeListener();
        }
        PeersChannel.killPeersChannel();
        await SupabaseChannels.unsubscribeFromAllSupabaseChannels();
        supabase.realtime.disconnect();
        const bgFlag = !store.getState().isInForegroundSt ? '?isInBackground=true' : '';
        store.getState().setIsRestartingSt(true);
        await new Promise((resolve) => {
            setTimeout(() => {
                window.location.href = window.location.pathname + bgFlag;
                resolve();
            }, 3000);
        });
    };

    const onNetworkTypeChange = async (netType) => {
        console.log('changed in network type: ', netType);
        await handleRestart();
    };
    const onWifiNameChange = async (wifiName) => {
        console.log('changed in ssid: ', wifiName);
        await handleRestart();
    };

    const updateNotificationBar = async () => {
        const isPlaying = store.getState().selectionsSt.find(el => el.table === 'playState')?.id === 'play';
        Statusbar.updatePlayState(isPlaying);
        const screenSelected = store.getState().screensSt.find(el => el.id === store.getState().screenSelectedSt);
        if (screenSelected) {
            Statusbar.updateScreenSelected(screenSelected.label + ' ' + screenSelected.state.toUpperCase());
            Statusbar.updateScreenState(screenSelected.state);
            Statusbar.updateMuteState(screenSelected.mute);
        }
        const rokuAppsSelectedRokuId = store.getState().selectionsSt.find(el => el.table === 'rokuApps')?.id;
        const appSelected = store.getState().rokuAppsSt.find(el => el.rokuId === rokuAppsSelectedRokuId);
        if (appSelected) {
            Statusbar.updateAppSelected(appSelected.label);
        }
    };

    console.log('the leader should be: ', expectedLeader);
    if (userNow.date !== userBefore.date) {
        if (userNameDevice === userNow.id) {
            console.log('I have the latest date now');
        } else {
            console.log(userNow.id + ' has the latest date now');
        }
        if (expectedLeader === userNameDevice) {
            if (leader === userNameDevice) {
                console.log('I am the expected leader, but I am the leader, so no need to update the leader');
            } else {
                console.log('I update the leader to myself');
                requests.updateSelections({ table: 'leader', id: userNameDevice });
            }
            if (store.getState().isConnectedToNokySt) {
                roku.activatePlayStateListener();
            }
        }
        if (userNow.id === userNameDevice) {
            if (store.getState().isAppSt) {
                await BackgroundService.getPermissions();
                await BackgroundService.startWifiNameListener((wifiName) => onWifiNameChange(wifiName));
                await BackgroundService.startNetworkTypeListener((netType) => onNetworkTypeChange(netType));
            }
            if (userNow.isConnectedToNoky) {
                await roku.updateDataInSelections();
            }
            if (store.getState().isAppSt) {
                updateNotificationBar();
            }
        }
    } else if (userNow.isInPresence !== userBefore.isInPresence) {
        if (userNow.isInPresence) {
            if (userNameDevice === userNow.id) {
                console.log('I am in presence now');
            } else {
                console.log(userNow.id + ' is in presence now');
            }
        } else {
            if (userNameDevice === userNow.id) {
                console.warn('I am not in presence anymore, yet I received an update');
            } else {
                console.log(userNow.id + ' is not in presence anymore');
            }
        }
        if (expectedLeader === userNameDevice) {
            if (leader === userNameDevice) {
                console.log('I am the expected leader, but I am the leader, so no need to update the leader');
            } else {
                console.log('I update the leader to myself');
                requests.updateSelections({ table: 'leader', id: userNameDevice });
            }
        }
        if (userNow.id === userNameDevice && userNow.isInPresence && userNow.isConnectedToNoky) {
            await roku.updateDataInSelections();
        }
    } else if (userNow.isConnectedToNoky !== userBefore.isConnectedToNoky) {
        if (userNow.isConnectedToNoky) {
            if (userNameDevice === userNow.id) {
                console.log('I am connected to Noky now');
            } else {
                console.log(userNow.id + ' is connected to Noky now');
            }
        } else {
            if (userNameDevice === userNow.id) {
                console.log('I am not connected to Noky anymore');
            } else {
                console.log(userNow.id + ' is not connected to Noky anymore');
            }
        }
        if (expectedLeader === userNameDevice) {
            if (leader === userNameDevice) {
                console.log('I am the expected leader, but I am the leader, so no need to update the leader');
            } else {
                console.log('I update the leader to myself');
                requests.updateSelections({ table: 'leader', id: userNameDevice });
            }
        }
        if (userNow.id === userNameDevice && userNow.isConnectedToNoky) {
            await roku.updateDataInSelections();
        }
    } else if (userNow.wifiName !== userBefore.wifiName) {
        if (userNow.wifiName) {
            if (userNameDevice === userNow.id) {
                console.log('I am connected to ' + userNow.wifiName);
            } else {
                console.log(userNow.id + ' is connected to ' + userNow.wifiName);
            }
        } else {
            if (userNameDevice === userNow.id) {
                console.log('I am not connected to any wifi anymore');
            } else {
                console.log(userNow.id + ' is not connected to any wifi anymore');
            }
        }
        onWifiNameChange(userNow.wifiName);
    } else if (userNow.networkType !== userBefore.networkType) {
        if (userNow.networkType) {
            if (userNameDevice === userNow.id) {
                console.log('I am connected to cellular network now');
            } else {
                console.log(userNow.id + ' is connected to cellular network now');
            }
        } else {
            if (userNameDevice === userNow.id) {
                console.log('I am not connected to any cellular network anymore');
            } else {
                console.log(userNow.id + ' is not connected to any cellular network anymore');
            }
        }
        onNetworkTypeChange(userNow.networkType);
    } else if (userNow.isInForeground !== userBefore.isInForeground) {
        if (userNow.isInForeground) {
            if (userNameDevice === userNow.id) {
                console.log('I am in foreground now');
            } else {
                console.log(userNow.id + ' is in foreground now');
            }
            if (userNameDevice === leader && store.getState().isConnectedToNokySt) {
                await roku.updateDataInSelections();
            }
        } else {
            if (userNameDevice === userNow.id) {
                console.log('I am in background now');
            } else {
                console.log(userNow.id + ' is in background now');
            }
        }
        if (userNow.id === userNameDevice && userNow.isInForeground && userNow.isConnectedToNoky) {
            await roku.updateDataInSelections();
        }
    } else if (userNow.screenSelected !== userBefore.screenSelected) {
        if (store.getState().isAppSt) {
            const screenSelected = store.getState().screensSt.find(el => el.id === userNow.screenSelected);
            Statusbar.updateScreenSelected(screenSelected.label + ' ' + screenSelected.state.toUpperCase());
            Statusbar.updateScreenState(screenSelected.state);
            Statusbar.updateMuteState(screenSelected.mute);
        }
    }
};

export default handleUserDevices;
