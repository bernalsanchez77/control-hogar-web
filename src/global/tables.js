
import viewRouter from './view-router';
import { store } from '../store/store';
import CordovaPlugins from './cordova-plugins';
import roku from './roku';
class Tables {
  async onHdmiSalaTableChange(change) {
    if (store.getState().isAppSt) {
      CordovaPlugins.updatePlayState(change.playState === 'play');
    }
  }

  async onScreensTableChange(change) {
    if (store.getState().isAppSt) {
      CordovaPlugins.updateScreenState(change.state);
      CordovaPlugins.updateMuteState(change.mute);
    }
  }

  onYoutubeVideosLizTableChange(change) {
    store.getState().setRokuPlayStatePositionSt(change.position);
  }

  onSelectionsTableChange(change) {
    if (change.table === 'youtubeVideosLiz') {
      if (change.id) {
        if (roku.playStateInterval) {
          roku.stopPlayStateListener();
        }
        if (store.getState().userNameSt === store.getState().leaderSt) {
          const currentVideo = store.getState().youtubeVideosLizSt.find(video => video.id === change.id);
          roku.startPlayStateListener(currentVideo);
        }
      } else {
        if (roku.playStateInterval) {
          roku.stopPlayStateListener();
        }
      }
    }
    if (change.table === 'rokuApps') {
      store.getState().setRokuSearchModeSt('roku');
      if (store.getState().isAppSt) {
        const label = store.getState().rokuAppsSt.find(app => app.rokuId === change.id).label;
        CordovaPlugins.updateAppSelected(label);
      }
    }
    if (change.table === 'hdmiSala') {
      if (store.getState().viewSt.selected !== change.id) {
        viewRouter.onHdmiSalaTableChange(change.id);
      }
    }
    if (change.table === 'users') {
      console.log('user selected:', change.id);
    }
  }
}
const tables = new Tables();
export default tables;
