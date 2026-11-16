import { store } from '../../../../store/store';

export function useChannelsControls() {
    const viewSt = store(v => v.viewSt);

    return {
        viewSt
    };
}
