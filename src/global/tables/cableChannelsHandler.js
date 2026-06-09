import { store } from '../../store/store';
import requests from '../requests';

const external = async (oldItem, newItem, eventType) => {
    const device = 'channelsSala';
    const ifttt = store.getState().cableChannelsSt.find(ch => ch.id === newItem.id).ifttt;
    requests.sendIfttt({ device: device + ifttt, key: 'selected', value: newItem.id });
};

const internal = async (oldItem, newItem, eventType) => {

};

const handleCableChannels = {
    external,
    internal
};

export default handleCableChannels;