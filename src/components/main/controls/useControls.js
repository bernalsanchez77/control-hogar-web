import { store } from '../../../store/store';

export function useControls() {
    // 1. Store / Global State
    const screensSt = store(v => v.screensSt);
    const rokuAppsSt = store(v => v.rokuAppsSt);
    const hdmiSalaSt = store(v => v.hdmiSalaSt);
    const devicesSt = store(v => v.devicesSt);
    const viewSt = store(v => v.viewSt);

    return {
        screensSt,
        rokuAppsSt,
        hdmiSalaSt,
        devicesSt,
        viewSt
    };
}
