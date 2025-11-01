
import Requests from './requests';
const requests = new Requests();
let playStateInterval = null;
let position = 0;
let handlePlayState = null;
// test
let testCount = 1540000;
let playState = {};

// end test
class Roku {

  async getPlayState() {
    try {
      const playState = await requests.getRokuData('media-player');
      if (playState && playState.status === 200) {
        return playState.data['player'].state;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  async getActiveApp(setConnectedToRoku) {
    try {
      const activeApp = await requests.getRokuData('active-app');
      if (activeApp && activeApp.status === 200) {
        setConnectedToRoku(true);
        return activeApp.data['active-app'].app.id;
      } else {
        setConnectedToRoku(false);
        return null;
      }
    } catch (err) {
      setConnectedToRoku(false);
      return null;
    }
  }

  async startPlayStateListener(setRokuPlayStatePosition, handlePlayStateFromRoku) {
    if (!handlePlayState) {
      handlePlayState = handlePlayStateFromRoku;
    }
    if (!playStateInterval) {
      position = 0;
      playStateInterval = setInterval(async () => {

        // no test
        playState = await this.getPlayState();
        // end no test

        // test
        // testCount = testCount + 5000;
        // playState.position = testCount;
        // if (playState.position >= 1568000) {
        //   playState.state = 'stop';
        // } else {
        //   playState.state = 'play';
        // }
        // end test

        // position = parseInt(playState.position) / 1000;
        position = parseInt(playState.position);
        if (playState) {
          switch (playState.state) {
            case 'play':
              setRokuPlayStatePosition(position);
              break;
            case 'pause':
              break;
            default:
              handlePlayState('stop');
              break;
          }
        }
      }, 5000);
    }
  }

  // test
  refreshCounter() {
    testCount = 1540000;
  }
  // end test

  async stopPlayStateListener() {
    position = 0;
    clearInterval(playStateInterval);
    playStateInterval = null;
  }
}
const roku = new Roku();
export default roku;
