import { store } from '../../store/store';
import requests from '../requests';
import roku from '../roku';
import supabasePeers from '../supabase/supabase-peers';

export const handleUserDevicesChange = async (oldItem, newItem, eventType, userNameDevice, leader) => {
    if (newItem.id === userNameDevice) {
        if (newItem.isInForeground !== oldItem.isInForeground) {
            console.log('change isInForeground property to peers after isInForeground change');
            await supabasePeers.trackPeers(oldItem.date);
        }
        if (newItem.isConnectedToNoky !== oldItem.isConnectedToNoky) {
            console.log('change isConnectedToNoky property to peers after isConnectedToNoky change');
            await supabasePeers.trackPeers(oldItem.date);
        }
    }
    if (newItem.isInForeground && !oldItem.isInForeground && userNameDevice === leader) {
        const rokuPlayState = await roku.getPlayState('state');
        if (rokuPlayState !== store.getState().selectionsSt.find(el => el.table === 'playState')?.id) {
            requests.updateSelections({ table: 'playState', id: rokuPlayState });
        }
    }
};
