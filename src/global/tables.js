
import viewRouter from './view-router';
import { store } from '../store/store';
import requests from './requests';
import roku from './roku';
class Tables {
  async onHdmiSalaTableChange(change) {
    if (store.getState().viewSt.selected !== change.id) {
      await viewRouter.onHdmiSalaTableChange(store.getState().viewSt, change.id);
    }
  }

  onYoutubeVideosLizTableChange(change) {
    if (store.getState().youtubeVideosLizSt.find(video => video.state === 'selected')) {
      roku.startPlayStateListener();
    } else {
      roku.stopPlayStateListener();
    }
  }

  onRokuSalaTableChange(change) {
    store.getState().setRokuSearchModeSt('roku');
    if (store.getState().rokuAppsSt.find(app => app.state === 'selected')?.rokuId !== change.rokuId && change.state === 'selected') {
      console.log('selected app changed');
      if (store.getState().youtubeVideosLizSt.find(video => video.state === 'selected')) {
        requests.updateTable({
          current: { currentId: store.getState().youtubeVideosLizSt.find(video => video.state === 'selected').id, currentTable: 'youtubeVideosLiz', currentState: '' }
        });
      }
    }
  }
}
const tables = new Tables();
export default tables;
