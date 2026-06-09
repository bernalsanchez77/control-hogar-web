import { store } from '../../store/store';
import viewRouter from '../view-router';
import requests from '../requests';

const external = async (oldItem, newItem, eventType) => {
    if (store.getState().viewSt.selected !== newItem.id) {
        requests.sendIfttt({ device: 'hdmiSala', value: newItem.id });
    }
};

const internal = (oldItem, newItem, eventType) => {
    viewRouter.onHdmiSalaTableChange(newItem.id);
};

const handleHdmiSala = {
    external,
    internal
};

export default handleHdmiSala;
