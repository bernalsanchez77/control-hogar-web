import { store } from "../../../store/store";

export function useNotifications() {
    // 1. Store / Global State
    const wifiNameSt = store(v => v.wifiNameSt);

    // 2. Return
    return {
        wifiNameSt
    };
}
