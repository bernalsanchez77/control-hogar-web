
import Requests from './requests';
const requests = new Requests();
class Roku {
  async getRokuPlayState(setRokuPlayState) {
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

  async getRokuActiveApp(setConnectedToRoku) {
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
}
const roku = new Roku();
export default roku;
