import { store } from '../../store/store';
import requests from '../requests';
import roku from '../roku';
import utils from '../utils/utils';

const handleUserDevices = async (userBefore, userNow, eventType, userNameDevice, leader) => {
    console.log('userBefore', userBefore);
    console.log('userNow', userNow);

    const userDevices = store.getState().userDevicesSt;
    const expectedLeader = utils.getExpectedLeader(userDevices, store.getState().peersSt);

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
    }
};

export default handleUserDevices;
