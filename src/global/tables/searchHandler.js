import { store } from '../../store/store';
import requests from '../requests';

const external = async (oldItem, newItem, eventType) => {
    if (store.getState().wifiNameSt === 'Noky') {
        if (newItem.table === 'backspace') {
            const rokuValue = newItem.table.charAt(0).toUpperCase() + newItem.table.slice(1);
            requests.fetchRoku({ key: 'keypress', value: rokuValue });
        }
        if (newItem.table === 'input') {
            requests.fetchRoku({ key: 'keypress', value: newItem.id });
        }
    }
};

const internal = (oldItem, newItem, eventType) => {

};

const handleSearch = {
    external,
    internal
};

export default handleSearch;
