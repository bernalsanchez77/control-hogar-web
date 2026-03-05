import { store } from '../../store/store';
import requests from '../requests';

export const handleToolbarChange = async (oldItem, newItem, eventType, userName, leader) => {
    if (userName === leader) {
        const rokuValue = newItem.table.charAt(0).toUpperCase() + newItem.table.slice(1);
        if (store.getState().wifiNameSt === 'Noky') {
            requests.fetchRoku({ key: 'keydown', value: rokuValue });
        } else {
            requests.sendIfttt({ device: 'rokuSala', key: 'command', value: newItem.table });
        }
    }
};
