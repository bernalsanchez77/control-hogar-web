import { store } from '../../store/store';
import requests from '../requests';

export const handleSearchChange = async (change, userName, leader) => {
    if (userName === leader && store.getState().wifiNameSt === 'Noky') {
        if (change.table === 'backspace') {
            const rokuValue = change.table.charAt(0).toUpperCase() + change.table.slice(1);
            requests.fetchRoku({ key: 'keypress', value: rokuValue });
        }
        if (change.table === 'input') {
            requests.fetchRoku({ key: 'keypress', value: change.id });
        }
    }
};
