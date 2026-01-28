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
    const rokuId = store.getState().rokuAppsSt.find(app => app.id === 'youtube').rokuId;
    const isInYoutubeVideosLizSt = store.getState().youtubeVideosLizSt.find(vid => vid.id === video.id);
    const currentVideoId = this.youtubeVideosLizSelectedId;
    if (currentVideoId) {
      if (currentVideoId !== video.id) {
        requests.fetchRoku({ key: 'launch', value: rokuId, params: { contentID: video.id } });
        if (isInYoutubeVideosLizSt) {
          requests.updateSelections({ table: 'youtubeVideosLiz', id: video.id });
        } else {
          requests.updateSelections({ table: 'youtubeVideosLiz', id: '' });
        }
      }
    } else {
      requests.fetchRoku({ key: 'launch', value: rokuId, params: { contentID: video.id } });
      if (isInYoutubeVideosLizSt) {
        requests.updateSelections({ table: 'youtubeVideosLiz', id: video.id });
      }
    }
    const rokuActiveAppId = this.rokuAppsSelectedId;
    if (rokuActiveAppId !== 'youtube') {
      requests.updateSelections({ table: 'rokuApps', id: this.rokuAppsSelectedRokuId });
    }
    this.clearQueue();
  }
}
const youtube = new Youtube();
export default youtube;
