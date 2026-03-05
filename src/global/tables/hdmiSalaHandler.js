import { store } from '../../store/store';
import viewRouter from '../view-router';

export const handleHdmiSalaChange = async (oldItem, newItem, eventType) => {
    if (store.getState().viewSt.selected !== newItem.id) {
        viewRouter.onHdmiSalaTableChange(newItem.id);
    }
};
