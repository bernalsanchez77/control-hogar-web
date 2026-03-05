import { store } from '../../store/store';
import requests from '../requests';

export const handleSearchChange = async (oldItem, newItem, eventType, userName, leader) => {
    if (userName === leader && store.getState().wifiNameSt === 'Noky') {
        if (newItem.table === 'backspace') {
            const rokuValue = newItem.table.charAt(0).toUpperCase() + newItem.table.slice(1);
            requests.fetchRoku({ key: 'keypress', value: rokuValue });
        }
        if (newItem.table === 'input') {
            requests.fetchRoku({ key: 'keypress', value: newItem.id });
        }
    }
};
