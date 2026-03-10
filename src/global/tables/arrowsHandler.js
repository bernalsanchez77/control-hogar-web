import { store } from '../../store/store';
import roku from '../roku';
import requests from '../requests';

export const handleArrowsChange = async (oldItem, newItem, eventType, userNameDevice, leader) => {
    if (userNameDevice === leader) {
        const rokuValue = newItem.table.charAt(0).toUpperCase() + newItem.table.slice(1);
        if (store.getState().wifiNameSt === 'Noky') {
            requests.fetchRoku({ key: 'keypress', value: rokuValue });
        } else {
            requests.sendIfttt({ device: 'rokuSala', key: 'command', value: newItem.table });
        }
        if (newItem.table === 'select') {
            setTimeout(async () => {
                const rokuPlayState = await roku.getPlayState('state');
                if (rokuPlayState !== store.getState().selectionsSt.find(el => el.table === 'playState')?.id) {
                    requests.updateSelections({ table: 'playState', id: rokuPlayState });
                }
            }, 2000);
        }
    }
};
