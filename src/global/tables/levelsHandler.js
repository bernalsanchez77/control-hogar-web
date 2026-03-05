import { store } from '../../store/store';
import requests from '../requests';

export const handleLevelsChange = async (oldItem, newItem, eventType, userName, leader) => {
    if (userName === leader) {
        const device = store.getState().viewSt.selected === 'roku' ? 'rokuSala' : 'cableSala';
        const rokuValue = newItem.table.charAt(0).toUpperCase() + newItem.table.slice(1);
        if (store.getState().wifiNameSt === 'Noky') {
            requests.fetchRoku({ key: 'keypress', value: rokuValue });
        } else {
            requests.sendIfttt({ device, key: 'command', value: newItem.table });
        }
    }
};
