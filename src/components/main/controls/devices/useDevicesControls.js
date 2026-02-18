import { store } from '../../../../store/store';

export function useDevicesControls() {
    const devicesSt = store(v => v.devicesSt);
    const viewSt = store(v => v.viewSt);

    const luzCuarto = devicesSt.find(device => device.id === 'luzCuarto');

    return {
        viewSt,
        luzCuarto
    };
}
