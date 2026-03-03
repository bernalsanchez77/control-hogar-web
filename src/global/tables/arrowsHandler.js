import { store } from '../../store/store';
import roku from '../roku';
import requests from '../requests';

export const handleArrowsChange = async (change, userName, leader) => {
    if (userName === leader) {
        const rokuValue = change.table.charAt(0).toUpperCase() + change.table.slice(1);
        if (store.getState().wifiNameSt === 'Noky') {
            requests.fetchRoku({ key: 'keypress', value: rokuValue });
        } else {
            requests.sendIfttt({ device: 'rokuSala', key: 'command', value: change.table });
        }
        if (change.table === 'select') {
            setTimeout(async () => {
                const rokuPlayState = await roku.getPlayState('state');
                if (rokuPlayState !== store.getState().selectionsSt.find(el => el.table === 'playState')?.id) {
                    requests.updateSelections({ table: 'playState', id: rokuPlayState });
                }
            }, 2000);
        }
    }
};
