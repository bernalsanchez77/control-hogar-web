
import { store } from "../store/store";
import requests from './requests';
let playStateInterval = null;
let position = 0;
let playState = {};
const simulatePlayState = true;

class Roku {
  constructor() {
    this.wifi = '';
    this.testCount = 1540000;
  }

  async getPlayState(data) {
    if (this.wifi) {
      try {
        const playState = await requests.getRokuData('media-player');
        if (playState && playState.status === 200) {
          if (data === 'state') {
            return playState.data['player'].state;
          } else {
            return playState.data['player'];
          }
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    } else {
      return null;
    }
  }

  async getActiveApp() {
    try {
      const activeApp = await requests.getRokuData('active-app');
      if (activeApp && activeApp.status === 200) {
        return activeApp.data['active-app'].app.id;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  async startPlayStateListener() {
    if (!playStateInterval) {
      console.log('playstatelistener started');
      position = 0;
      playStateInterval = setInterval(async () => {

        if (simulatePlayState) {
          this.testCount = this.testCount + 5000;
          playState.position = this.testCount;
          if (playState.position >= 1568000) {
            playState.state = 'stop';
          } else {
            playState.state = 'play';
          }
        } else {
          playState = await this.getPlayState();
        }
        if (playState) {
          console.log('escuchando');
          position = parseInt(playState.position);
        } else {
          position = 0;
        }
        if (playState) {
          switch (playState.state) {
            case 'play':
              store.getState().setRokuPlayStatePositionSt(position);
              break;
            case 'pause':
              break;
            default:
              break;
          }
        }
      }, 5000);
    }
  }

  refreshCounter() {
    this.testCount = 1540000;
  }

  async stopPlayStateListener() {
    if (playStateInterval) {
      console.log('playstatelistener stopped');
      position = 0;
      clearInterval(playStateInterval);
      playStateInterval = null;
      this.refreshCounter();
    }
  }

  setWifi(wifi) {
    this.wifi = wifi;
    if (!wifi) {
      this.stopPlayStateListener();
    }
  }

  async setRoku() {
    const rokuActiveApp = await this.getActiveApp();
    if (rokuActiveApp) {
      const rokuAppsSt = store.getState().rokuAppsSt;
      if (rokuActiveApp !== rokuAppsSt.find(v => v.state === 'selected').rokuId) {
        requests.updateTable({
          current: { currentId: rokuAppsSt.find(app => app.state === 'selected').id, currentTable: 'rokuApps' },
          new: { newId: rokuAppsSt.find(app => app.rokuId === rokuActiveApp).id, newTable: 'rokuApps' }
        });
      }
      const playStateFromRoku = await this.getPlayState();
      if (playStateFromRoku?.state) {
        const hdmiSalaSt = store.getState().hdmiSalaSt;
        const youtubeVideosLizSt = store.getState().youtubeVideosLizSt;
        if (playStateFromRoku.state !== hdmiSalaSt.find(hdmi => hdmi.id === 'roku').playState) {
          requests.updateTable({
            new: { newId: hdmiSalaSt.find(hdmi => hdmi.id === 'roku').id, newTable: 'hdmiSala', newPlayState: playStateFromRoku.state }
          });
        }
        if (playStateFromRoku.state !== 'play' && playStateFromRoku.state !== 'pause' && youtubeVideosLizSt.find(video => video.state === 'selected')) {
          requests.updateTable({
            current: { currentId: youtubeVideosLizSt.find(video => video.state === 'selected').id, currentTable: 'youtubeVideosLiz', currentState: '' }
          });
        }
      }
    }
  }
}
const roku = new Roku();
export default roku;
