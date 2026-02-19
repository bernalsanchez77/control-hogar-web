import { store } from '../../store/store';
import viewRouter from '../view-router';

export const handleHdmiSalaChange = async (change) => {
    if (store.getState().viewSt.selected !== change.id) {
        viewRouter.onHdmiSalaTableChange(change.id);
    }
};
