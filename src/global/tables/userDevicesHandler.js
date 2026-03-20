import { store } from '../../store/store';
import requests from '../requests';
import roku from '../roku';
import utils from '../utils';

export const handleUserDevicesChange = async (userBefore, userNow, eventType, userNameDevice, leader) => {
    const userDevices = store.getState().userDevices2St;
    const expectedLeader = utils.getExpectedLeader(userDevices, store.getState().peersSt);
    console.log('the leader should be: ', expectedLeader);
    if (userNow.date !== userBefore.date) {
        console.log('date changed');
        if (userNameDevice === userNow.id) {
            console.log('I have the latest date now');
        } else {
            console.log(userNow.id + ' has the latest date now');
        }
        if (expectedLeader === userNameDevice) {
            console.log('I updated the leader to myself because there was a change in date and I have the condition to be leader');
            requests.updateSelections({ table: 'leader2', id: userNameDevice });
        } else {
            console.log('I don\'t update the leader to myself because I don\'t have the condition to be leader');
        }
    } else if (userNow.isInPresence !== userBefore.isInPresence) {
        console.log('isInPresence changed');
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
            console.log('I updated the leader to myself because there was a change in isInPresence and I have the condition to be leader');
            requests.updateSelections({ table: 'leader2', id: userNameDevice });
        } else {
            console.log('I don\'t update the leader to myself because I don\'t have the condition to be leader');
        }
    } else if (userNow.isConnectedToNoky !== userBefore.isConnectedToNoky) {
        console.log('isConnectedToNoky changed');
        if (userNow.isConnectedToNoky) {
            if (userNameDevice === userNow.id) {
                console.log('I am connected to Noky now');
            } else {
                console.log(userNow.id + ' is connected to Noky now');
            }
        } else {
            if (userNameDevice === userNow.id) {
                console.warn('I am not connected to Noky anymore');
            } else {
                console.log(userNow.id + ' is not connected to Noky anymore');
            }
        }
        if (expectedLeader === userNameDevice) {
            console.log('I updated the leader to myself because there was a change in isConnectedToNoky and I have the condition to be leader');
            requests.updateSelections({ table: 'leader2', id: userNameDevice });
        } else {
            console.log('I don\'t update the leader to myself because I don\'t have the condition to be leader');
        }
    } else if (userNow.isInForeground !== userBefore.isInForeground) {
        console.log('isInForeground changed');
    }

    if (userNow.isInForeground && !userBefore.isInForeground && userNameDevice === leader) {
        const rokuPlayState = await roku.getPlayState('state');
        if (rokuPlayState !== store.getState().selectionsSt.find(el => el.table === 'playState')?.id) {
            requests.updateSelections({ table: 'playState', id: rokuPlayState });
        }
    }
};
