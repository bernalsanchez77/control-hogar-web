import requests from './requests';
import { store } from '../store/store';

class Youtube {
  clearQueue() {
    const queueElements = store.getState().youtubeVideosLizSt.filter(video => video.queue > 0);
    if (queueElements.length > 0) {
      queueElements.forEach(video => {
        requests.updateTable({ id: video.id, table: 'youtubeVideosLiz', queue: 0 });
      });
    }
  }
  clearCurrentVideo() {
    if (store.getState().selectionsSt.find(el => el.table === 'youtubeVideosLiz')?.id) {
      requests.updateSelections({ table: 'youtubeVideosLiz', id: '' });
    }
  }
  getLastQueue() {
    return store.getState().youtubeVideosLizSt.reduce((maxObject, currentObject) => {
      const maxVal = maxObject['queue'];
      const currentVal = currentObject['queue'];
      if (currentVal > maxVal) {
        return currentObject;
      } else {
        return maxObject;
      }
    });
  }
  async handleQueue(video) {
    if (video.queue) {
      requests.updateTable({ id: video.id, table: 'youtubeVideosLiz', queue: 0, date: video.date });
    } else {
      const lastQueue = this.getLastQueue().queue;
      requests.updateTable({ id: video.id, table: 'youtubeVideosLiz', queue: lastQueue + 1, date: video.date });
    }
  }
  onVideoShortClick(video) {
    const isInYoutubeVideosLizSt = store.getState().youtubeVideosLizSt.find(vid => vid.id === video.id);
    const currentVideoId = store.getState().selectionsSt.find(el => el.table === 'youtubeVideosLiz')?.id;
    if (currentVideoId !== video.id) {
      if (isInYoutubeVideosLizSt) {
        requests.updateSelections({ table: 'youtubeVideosLiz', id: video.id });
      } else {
        requests.updateSelections({ table: 'youtubeVideosLiz', id: video.id });
        requests.updateTable({ id: video.id, table: 'youtubeVideosLiz' });
      }
    }
    const rokuAppsSelectedId = store.getState().selectionsSt.find(el => el.table === 'rokuApps')?.id;
    const youtubeAppId = store.getState().rokuAppsSt.find(app => app.id === 'youtube').rokuId;
    if (rokuAppsSelectedId !== youtubeAppId) {
      requests.updateSelections({ table: 'rokuApps', id: youtubeAppId });
    }
    this.clearQueue();
  }
}
const youtube = new Youtube();
export default youtube;
