import { store } from '../../store/store';
import requests from '../requests';
import roku from '../roku';
import supabasePeers from '../supabase/supabase-peers';

export const handleUserDevicesChange = async (oldItem, newItem, eventType, userName, leader) => {
    if (newItem.id === userName) {
        if (newItem.isInForeground !== oldItem.isInForeground) {
            console.log('resubscribing to peers channel after isInForeground change');
            await supabasePeers.trackPeers(oldItem.date, newItem.isConnectedToNoky, newItem.isInForeground);
            if (newItem.isInForeground) {
                store.getState().setIsLoadingSt(true);
            }
        }
        if (newItem.isConnectedToNoky !== oldItem.isConnectedToNoky) {
            console.log('resubscribing to peers channel after isConnectedToNoky change');
            await supabasePeers.trackPeers(oldItem.date, newItem.isConnectedToNoky, newItem.isInForeground);
            if (newItem.isConnectedToNoky) {
                store.getState().setIsLoadingSt(true);
            }
        }
    }
    if (newItem.isInForeground && !oldItem.isInForeground && userName === leader) {
        const rokuPlayState = await roku.getPlayState('state');
        if (rokuPlayState !== store.getState().selectionsSt.find(el => el.table === 'playState')?.id) {
            requests.updateSelections({ table: 'playState', id: rokuPlayState });
        }
    }
};
