
import { store } from "../store/store";
import requests from './requests';

import utils from './utils/utils';
let position = 0;
let playState = {};
let testCount = 0;

class Roku {
  constructor() {
    this.testCount = testCount;
    this.playStateInterval = null;
    this.currentVideo = null;
    this.currentVideoDuration = 0;
  }

  async getPlayState(data) {
    if (store.getState().isConnectedToNokySt) {
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
        const selectedVideoId = store.getState().selectionsSt.find(el => el.table === 'youtubeVideos')?.id;
        const youtubeAppId = store.getState().rokuAppsSt.find(app => app.id === 'youtube')?.rokuId;
        if (activeApp.data['active-app'].app.id !== youtubeAppId && selectedVideoId) {
          requests.updateSelections({ table: 'youtubeVideos', id: '' });
        }
        return activeApp.data['active-app'].app.id;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  async runPlayStateListener() {
    if (this.playStateInterval) {
      if (store.getState().simulatePlayStateSt) {
        this.testCount = this.testCount + 5000;
        playState.position = this.testCount;
        if (playState.position >= this.currentVideoDuration) {
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
            requests.updateSelections({ table: 'playPosition', id: position });
            break;
          case 'pause':
            break;
          case 'stop':
            break;
          default:
            break;
        }
      }
    }
  }

  async startPlayStateListener(currentVideo) {
    this.currentVideo = currentVideo;
    this.currentVideoDuration = utils.timeToMs(currentVideo.duration);
    console.log('playstatelistener started');
    position = 0;
    this.runPlayStateListener();
    this.playStateInterval = setInterval(async () => {
      this.runPlayStateListener();
    }, 5000);
  }

  refreshCounter() {
    this.testCount = testCount;
  }

  async stopPlayStateListener() {
    if (this.playStateInterval) {
      position = 0;
      clearInterval(this.playStateInterval);
      this.playStateInterval = null;
      this.refreshCounter();
    }
  }

  async updatePlayStateInSelections() {
    const rokuPlayState = await this.getPlayState('state');
    if (rokuPlayState) {
      if (rokuPlayState !== store.getState().selectionsSt.find(el => el.table === 'playState').id) {
        requests.updateSelections({ table: 'playState', id: rokuPlayState });
      }
      if (rokuPlayState !== 'pause' && rokuPlayState !== 'play' && store.getState().selectionsSt.find(el => el.table === 'youtubeVideos').id) {
        requests.updateSelections({ table: 'youtubeVideos', id: '' });
      }
    }
  }

  async updateActiveAppInSelections(simulate = false) {
    let rokuActiveApp;
    if (simulate) {
      rokuActiveApp = '837';
    } else {
      rokuActiveApp = await this.getActiveApp();
    }
    if (rokuActiveApp && rokuActiveApp !== store.getState().selectionsSt.find(el => el.table === 'rokuApps').id) {
      console.log('activeApp changed');
      requests.updateSelections({ table: 'rokuApps', id: rokuActiveApp });
    }
  }

  async updateDataInSelections() {
    if (store.getState().simulatePlayStateSt) {
      await this.updatePlayStateInSelections();
      await this.updateActiveAppInSelections(true);
    } else {
      await this.updatePlayStateInSelections();
      await this.updateActiveAppInSelections(false);
    }
  }

  async activatePlayStateListener() {
    this.stopPlayStateListener();
    const youtubeVideosSelectedId = store.getState().selectionsSt.find(el => el.table === 'youtubeVideos')?.id;
    if (youtubeVideosSelectedId) {
      const youtubeVideosSelected = store.getState().youtubeVideosSt.find(el => el.id === youtubeVideosSelectedId) || {};
      if (youtubeVideosSelected) {
        this.startPlayStateListener(youtubeVideosSelected);
      }
    }
  }
}
const roku = new Roku();
export default roku;
