import { store } from '../../store/store';
import roku from '../roku';
import requests from '../requests';

const external = async (oldItem, newItem, eventType) => {
    const rokuValue = newItem.table.charAt(0).toUpperCase() + newItem.table.slice(1);
    if (store.getState().wifiNameSt === 'Noky') {
        requests.fetchRoku({ key: 'keypress', value: rokuValue });
    } else {
        requests.sendIfttt({ device: 'rokuSala', key: 'command', value: newItem.table });
    }
    if (newItem.table === 'select') {
        setTimeout(async () => {
            if (store.getState().isConnectedToNokySt) {
                roku.updatePlayStateInSelections();
            }
        }, 2000);
    }
};

const internal = (oldItem, newItem, eventType) => {

};

const handleArrows = {
    external,
    internal
};

export default handleArrows;
