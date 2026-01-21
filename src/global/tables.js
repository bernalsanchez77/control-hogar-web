
import viewRouter from './view-router';
import { store } from '../store/store';
import requests from './requests';
import CordovaPlugins from './cordova-plugins';
import roku from './roku';
class Tables {
  async onHdmiSalaTableChange(change) {
    if (store.getState().viewSt.selected !== change.id) {
      await viewRouter.onHdmiSalaTableChange(store.getState().viewSt, change.id);
    }
    if (store.getState().isAppSt) {
      CordovaPlugins.updatePlayState(change.playState === 'play');
    }
  }

  async onScreensTableChange(change) {
    if (store.getState().isAppSt) {
      CordovaPlugins.updateScreenSelected(change.label + ' ' + change.state.toUpperCase());
      CordovaPlugins.updateScreenState(change.state);
      CordovaPlugins.updateMuteState(change.mute);
    }
  }

  onYoutubeVideosLizTableChange(change) {
    if (store.getState().youtubeVideosLizSt.find(video => video.state === 'selected')) {
      roku.startPlayStateListener();
    } else {
      roku.stopPlayStateListener();
    }
  }

  onRokuSalaTableChange(change) {
    if (change.state === 'selected') {
      store.getState().setRokuSearchModeSt('roku');
      if (store.getState().isAppSt) {
        CordovaPlugins.updateAppSelected(change.label);
      }
      if (store.getState().youtubeVideosLizSt.find(video => video.state === 'selected')) {
        requests.updateTable({
          current: { currentId: store.getState().youtubeVideosLizSt.find(video => video.state === 'selected').id, currentTable: 'youtubeVideosLiz', currentState: '' }
        });
      }
    }
  }
}
const tables = new Tables();
export default tables;
