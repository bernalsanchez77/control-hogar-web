import { store } from '../../store/store';
import requests from '../requests';

export const handleCableChannelsChange = async (oldItem, newItem, eventType, userNameDevice, leader) => {
    if (userNameDevice === leader) {
        const device = 'channelsSala';
        const ifttt = store.getState().cableChannelsSt.find(ch => ch.id === newItem.id).ifttt;
        requests.sendIfttt({ device: device + ifttt, key: 'selected', value: newItem.id });
    }
};
