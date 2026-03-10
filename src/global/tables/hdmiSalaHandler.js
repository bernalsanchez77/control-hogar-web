import { store } from '../../store/store';
import viewRouter from '../view-router';
import requests from '../requests';

export const handleHdmiSalaChange = async (oldItem, newItem, eventType) => {
    if (store.getState().viewSt.selected !== newItem.id) {
        viewRouter.onHdmiSalaTableChange(newItem.id);
        requests.sendIfttt({ device: 'hdmiSala', value: newItem.id });
    }
};
