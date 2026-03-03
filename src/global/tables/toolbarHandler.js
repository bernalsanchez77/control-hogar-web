import { store } from '../../store/store';
import requests from '../requests';

export const handleToolbarChange = async (change, userName, leader) => {
    if (userName === leader) {
        const rokuValue = change.table.charAt(0).toUpperCase() + change.table.slice(1);
        if (store.getState().wifiNameSt === 'Noky') {
            requests.fetchRoku({ key: 'keydown', value: rokuValue });
        } else {
            requests.sendIfttt({ device: 'rokuSala', key: 'command', value: change.table });
        }
    }
};
