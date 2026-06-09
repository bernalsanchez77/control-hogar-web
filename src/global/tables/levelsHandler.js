import { store } from '../../store/store';
import requests from '../requests';

const external = async (oldItem, newItem, eventType) => {
    const device = store.getState().viewSt.selected === 'roku' ? 'rokuSala' : 'cableSala';
    const rokuValue = newItem.table.charAt(0).toUpperCase() + newItem.table.slice(1);
    if (store.getState().wifiNameSt === 'Noky') {
        requests.fetchRoku({ key: 'keypress', value: rokuValue });
    } else {
        requests.sendIfttt({ device, key: 'command', value: newItem.table });
    }
};

const internal = (oldItem, newItem, eventType) => {

};

const handleLevels = {
    external,
    internal
};

export default handleLevels;
