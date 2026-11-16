import { store } from '../../../store/store';
import requests from '../../global/runtimeRequests';

const external = async (oldItem, newItem, eventType) => {
    if (store.getState().viewSt.selected !== newItem.id) {
        requests.sendIfttt({ device: 'hdmiSala', value: newItem.id });
    }
};

const internal = (oldItem, newItem, eventType) => {
};

const handleHdmiSala = {
    external,
    internal
};

export default handleHdmiSala;
