import { store } from '../../store/store';
import requests from '../requests';

export const handleLevelsChange = async (change, userName, leader) => {
    if (userName === leader) {
        const device = store.getState().viewSt.selected === 'roku' ? 'rokuSala' : 'cableSala';
        const rokuValue = change.table.charAt(0).toUpperCase() + change.table.slice(1);
        if (store.getState().wifiNameSt === 'Noky') {
            requests.fetchRoku({ key: 'keypress', value: rokuValue });
        } else {
            requests.sendIfttt({ device, key: 'command', value: change.table });
        }
    }
};
