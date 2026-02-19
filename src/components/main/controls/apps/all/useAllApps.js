import { store } from "../../../../../store/store";
import utils from '../../../../../global/utils';
import requests from '../../../../../global/requests';
import viewRouter from '../../../../../global/view-router';
import { useTouch } from '../../../../../hooks/useTouch';

export function useAllApps() {
    // 1. Store / Global State
    const rokuAppsSt = store(v => v.rokuAppsSt);
    const selectionsSt = store(v => v.selectionsSt);

    // 2. Callbacks / Functions
    const onShortClick = (e, value) => {
        utils.triggerVibrate();
        const app = rokuAppsSt.find(app => app.id === value);
        if (app) {
            requests.updateSelections({ table: 'rokuApps', id: app.rokuId });
        }
    };

    const onLongClick = async (e, value) => {
        utils.triggerVibrate();
        await viewRouter.navigateToRokuApp(value);
    };

    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(onShortClick, onLongClick);

    // 3. Memos / Derived State
    const rokuAppsSelectedRokuId = selectionsSt.find(el => el.table === 'rokuApps')?.id;

    return {
        rokuAppsSt,
        rokuAppsSelectedRokuId,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
