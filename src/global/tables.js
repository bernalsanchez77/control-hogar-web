
import viewRouter from './view-router';
import { store } from '../store/store';
import CordovaPlugins from './cordova-plugins';
import roku from './roku';
import requests from './requests';
import youtube from './youtube';
class Tables {
  constructor() {
    this.userName = '';
  }
  async onHdmiSalaTableChange(change) {
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

  async onSelectionsTableChange(change) {
    this.userName = store.getState().userNameSt + '-' + store.getState().userDeviceSt;
    if (change.table === 'youtubeVideosLiz') {
      if (change.id) {
        if (roku.playStateInterval) {
          roku.stopPlayStateListener();
        }
        if (this.userName === store.getState().leaderSt) {
          const rokuId = store.getState().rokuAppsSt.find(app => app.label === 'Youtube').rokuId;
          if (!store.getState().simulatePlayStateSt) {
            requests.fetchRoku({ key: 'launch', value: rokuId, params: { contentID: change.id } });
          }
          const currentVideo = store.getState().youtubeVideosLizSt.find(video => video.id === change.id) || store.getState().currentYoutubeVideoSt;
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
      if (this.userName === store.getState().leaderSt) {
        if (store.getState().wifiNameSt === 'Noky') {
          requests.fetchRoku({ key: 'launch', value: change.id });
        } else {
          requests.sendIfttt({ device: 'rokuSala', key: 'app', value: change.id });
        }
        const app = store.getState().rokuAppsSt.find(app => app.rokuId === change.id);
        if (app.id !== 'youtube') {
          youtube.clearCurrentVideo();
          youtube.clearQueue();
        }
        if (app.id === 'home') {
          requests.updateSelections({ table: 'rokuSala', id: 'stop' });
        }
      }
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
    if (change.table === 'rokuSala') {
      if (store.getState().isAppSt) {
        CordovaPlugins.updatePlayState(change.id === 'play');
      }
      if (this.userName === store.getState().leaderSt) {
        const rokuPlayState = await roku.getPlayState('state');
        if (rokuPlayState !== change.id) {
          requests.fetchRoku({ key: 'keypress', value: change.id });
        }
      }
    }
    if (change.table === 'users') {
      console.log('user selected:', change.id);
    }
  }
}
const tables = new Tables();
export default tables;
