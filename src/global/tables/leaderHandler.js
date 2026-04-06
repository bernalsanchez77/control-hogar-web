import { store } from '../../store/store';
import Roku from '../roku';

export const handleLeaderChange = async (oldItem, newItem, eventType, userNameDevice, leader) => {
    if (newItem.id !== oldItem.id) {
        if (store.getState().isConnectedToNokySt && newItem.id === userNameDevice) {
            Roku.activatePlayStateListener();
            await Roku.updateDataInSelections();
        } else {
            if (Roku.playStateInterval) {
                Roku.stopPlayStateListener();
            }
        }
    }
};
