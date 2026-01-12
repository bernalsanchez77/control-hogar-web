
import { store } from "../store/store";
import requests from './requests';
let playStateInterval = null;
let position = 0;
let playState = {};
const simulatePlayState = false;
let testCount = 40000;

class Roku {
  constructor() {
    this.isConnectedToNokyWifi = '';
    this.testCount = testCount;
  }

  async getPlayState(data) {
    if (this.isConnectedToNokyWifi) {
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

  async runPlayStateListener() {
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
          this.updatePlayState();
          break;
        case 'pause':
          this.updatePlayState();
          break;
        default:
          break;
      }
    }
  }

  async startPlayStateListener() {
    console.log('startPlayStateListener');
    if (!playStateInterval) {
      console.log('playstatelistener started');
      position = 0;
      this.runPlayStateListener();
      playStateInterval = setInterval(async () => {
        this.runPlayStateListener();
      }, 5000);
    }
  }

  refreshCounter() {
    this.testCount = testCount;
  }

  async stopPlayStateListener() {
    if (playStateInterval) {
      store.getState().setRokuPlayStatePositionSt(0);
      console.log('playstatelistener stopped');
      position = 0;
      clearInterval(playStateInterval);
      playStateInterval = null;
      this.refreshCounter();
    }
  }

  setIsConnectedToNokyWifi(isConnectedToNokyWifi) {
    this.isConnectedToNokyWifi = isConnectedToNokyWifi;
    if (!isConnectedToNokyWifi) {
      // this.stopPlayStateListener();
    }
  }

  async updateState() {
    const playState = await this.getPlayState();
    const youtubeVideosLizSt = store.getState().youtubeVideosLizSt;
    const hdmiSalaSt = store.getState().hdmiSalaSt;
    if (playState) {
      if (hdmiSalaSt.find(hdmi => hdmi.id === 'roku').playState !== playState.state) {
        requests.updateTable({
          new: { newId: hdmiSalaSt.find(hdmi => hdmi.id === 'roku').id, newTable: 'hdmiSala', newPlayState: playState.state }
        });
      }
      if (playState.state !== 'play' && playState.state !== 'pause' && youtubeVideosLizSt.find(video => video.state === 'selected')) {
        requests.updateTable({
          current: { currentId: youtubeVideosLizSt.find(video => video.state === 'selected').id, currentTable: 'youtubeVideosLiz', currentState: '' }
        });
      }
    }
  }

  async updatePlayState(timeout) {
    if (timeout) {
      setTimeout(async () => {
        this.updateState();
      }, timeout);
    } else {
      this.updateState();
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
      this.updatePlayState();
    }
  }
}
const roku = new Roku();
export default roku;
