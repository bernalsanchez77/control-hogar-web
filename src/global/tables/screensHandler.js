import { store } from '../../store/store';
import CordovaPlugins from '../cordova-plugins';

export const handleScreensChange = async (change) => {
    if (store.getState().isAppSt) {
        CordovaPlugins.updateScreenState(change.state);
        CordovaPlugins.updateMuteState(change.mute);
    }
};
