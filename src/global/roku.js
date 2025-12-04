
import {store} from "../store/store";
import Requests from './requests';
const requests = new Requests();
let playStateInterval = null;
let position = 0;
let handlePlayState = null;
// test
let playState = {};

// end test
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

  async startPlayStateListener(handlePlayStateFromRoku) {
    if (!handlePlayState) {
      handlePlayState = handlePlayStateFromRoku;
    }
    if (!playStateInterval) {
      console.log('playstatelistener started');
      position = 0;
      playStateInterval = setInterval(async () => {

        // no test
        playState = await this.getPlayState();
        // end no test

        // test
        // this.testCount = this.testCount + 5000;
        // playState.position = this.testCount;
        // if (playState.position >= 1568000) {
        //   playState.state = 'stop';
        // } else {
        //   playState.state = 'play';
        // }
        // end test

        // position = parseInt(playState.position) / 1000;
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
          handlePlayState(playState.state);
        }
      }, 5000);
    }
  }

  // test
  refreshCounter() {
    this.testCount = 1540000;
  }
  // end test

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
}
const roku = new Roku();
export default roku;
