
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

  onYoutubeVideosTableChange(change) {
  }

  async onSelectionsTableChange(change) {
    this.userName = store.getState().userNameSt + '-' + store.getState().userDeviceSt;
    const leader = store.getState().leaderSt;

    if (change.table === 'youtubeVideos') {
      if (change.id) {
        if (roku.playStateInterval) {
          roku.stopPlayStateListener();
        }
        if (this.userName === leader) {
          const rokuId = store.getState().rokuAppsSt.find(app => app.label === 'Youtube').rokuId;
          if (!store.getState().simulatePlayStateSt) {
            requests.fetchRoku({ key: 'launch', value: rokuId, params: { contentID: change.id } });
          }
          const currentVideo = store.getState().youtubeVideosSt.find(video => video.id === change.id) || store.getState().currentYoutubeVideoSt;
          roku.startPlayStateListener(currentVideo);
          setTimeout(() => {
            requests.updateSelections({ table: 'playState', id: 'play' });
            requests.updateTable({ id: change.id, table: 'youtubeVideos' });
          }, 1000);
        }
      } else {
        if (roku.playStateInterval) {
          roku.stopPlayStateListener();
        }
        if (this.userName === leader) {
          requests.fetchRoku({ key: 'keypress', value: 'Stop' });
          requests.updateSelections({ table: 'playState', id: 'stop' });
          requests.updateSelections({ table: 'playPosition', id: '0' });
        }
      }
    }
    if (change.table === 'rokuApps') {
      store.getState().setRokuSearchModeSt('roku');
      if (this.userName === leader) {
        if (store.getState().wifiNameSt === 'Noky') {
          requests.fetchRoku({ key: 'launch', value: change.id });
        } else {
          requests.sendIfttt({ device: 'rokuSala', key: 'app', value: change.id });
        }
        const app = store.getState().rokuAppsSt.find(app => app.rokuId === change.id);
        if (app.id !== 'youtube') {
          const videoId = store.getState().selectionsSt.find(el => el.table === 'youtubeVideos')?.id;
          if (videoId) {
            requests.updateSelections({ table: 'youtubeVideos', id: '' });
          }
          youtube.clearQueue();
        }
      }
      store.getState().setRokuSearchModeSt('roku');
      if (store.getState().isAppSt) {
        const label = store.getState().rokuAppsSt.find(app => app.rokuId === change.id).label;
        CordovaPlugins.updateAppSelected(label);
      }
    }
    if (change.table === 'playState') {
      if (store.getState().isAppSt) {
        CordovaPlugins.updatePlayState(change.id === 'play');
      }
      if (this.userName === leader) {
        if (change.id) {
          const rokuPlayState = await roku.getPlayState('state');
          if (rokuPlayState !== change.id) {
            const rokuValue = change.id.charAt(0).toUpperCase() + change.id.slice(1);
            requests.fetchRoku({ key: 'keypress', value: rokuValue });
          }
        }
      }
    }
    if (change.table === 'hdmiSala') {
      if (store.getState().viewSt.selected !== change.id) {
        viewRouter.onHdmiSalaTableChange(change.id);
      }
    }
    if (change.table === 'leader') {
      console.log('leader changed:', change.id);
      store.getState().setLeaderSt(change.id);
    }
  }
}
const tables = new Tables();
export default tables;
