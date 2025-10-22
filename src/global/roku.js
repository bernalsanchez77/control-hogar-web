
import Requests from './requests';
const requests = new Requests();
let playStateInterval = null;
let position = 0;
// test
let testCount = 1540000;
let playState = {};
// end test
class Roku {
  async getPlayState(setRokuPlayState) {
    try {
      const playState = await requests.getRokuData('media-player');
      if (playState && playState.status === 200) {
        setRokuPlayState(playState.data['player']);
        return playState.data['player'];
      } else {
        setRokuPlayState({});
        return null;
      }
    } catch (err) {
      setRokuPlayState({});
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

  async updatePlayState(setRokuPlayState, currentPlayState) {
    let playState = await this.getPlayState(setRokuPlayState);
    if (playState) {
      const newPlayState = playState.state;
      if (currentPlayState !== newPlayState) {
        requests.updateTableInSupabase({
          new: {newId: 'roku', newTable: 'hdmiSala', newPlayState, newDate: new Date().toISOString()}
        });
      }
    }
  }

  async startPlayStateListener(setRokuPlayState, setRokuPlayStatePosition) {
    position = 0;
    playStateInterval = setInterval(async () => {
      // playState = await this.getPlayState(setRokuPlayState);

      // test
      testCount = testCount + 5000;
      playState.position = testCount
      playState.state = 'play';
      // end test

      // position = parseInt(playState.position) / 1000;
      position = parseInt(playState.position);
      if (playState && playState.state === 'play') {
        setRokuPlayStatePosition(position);
      }
    }, 5000);
  }

  async stopPlayStateListener() {
    clearInterval(playStateInterval);
  }
}
const roku = new Roku();
export default roku;
