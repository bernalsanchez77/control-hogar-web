import { store } from '../../store/store';
import requests from '../requests';
import roku from '../roku';

export const handleUserDevicesChange = async (change, userName, leader) => {
    if (change.isInForeground && userName === leader) {
        const rokuPlayState = await roku.getPlayState('state');
        if (rokuPlayState !== store.getState().selectionsSt.find(el => el.table === 'playState')?.id) {
            requests.updateSelections({ table: 'playState', id: rokuPlayState });
        }
    }
};
