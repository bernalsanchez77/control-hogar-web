import requests from './requests';
import { store } from '../store/store';
import utils from './utils';

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
    const currentVideoId = store.getState().hdmiSalaSt.find(el => el.id === 'roku')?.videoId;
    if (currentVideoId !== video.id) {
      const existingVideo = store.getState().youtubeVideosLizSt.find(v => v.id === video.id);
      if (!existingVideo) {
        requests.upsertTable({ id: video.id, table: 'youtubeVideosLiz', title: utils.decodeYoutubeTitle(video.title), duration: video.duration, channelId: 'zz-channel' });
        setTimeout(() => {
          requests.updateSelections({ table: 'youtubeVideosLiz', id: video.id });
        }, 1000);
      } else {
        requests.updateTable({ id: video.id, table: 'youtubeVideosLiz', position: '0' });
        requests.updateSelections({ table: 'youtubeVideosLiz', id: video.id });
      }
    }
    const rokuAppsSelectedId = store.getState().selectionsSt.find(el => el.table === 'rokuApps')?.id;
    const youtubeAppId = store.getState().rokuAppsSt.find(app => app.id === 'youtube').rokuId;
    if (rokuAppsSelectedId !== youtubeAppId) {
      requests.updateSelections({ table: 'rokuApps', id: youtubeAppId });
    }
    this.clearQueue();
  }

  getQueueConsecutiveNumber(video) {
    let sortedQueue = [...store.getState().youtubeVideosLizSt].sort((a, b) => {
      return Number(a.queue) - Number(b.queue);
    });
    sortedQueue = sortedQueue.filter(obj => Number(obj.queue) !== 0);
    if (sortedQueue.includes(video)) {
      return sortedQueue.findIndex(obj => obj.id === video.id) + 1;
    } else {
      return 0;
    }
  };
}
const youtube = new Youtube();
export default youtube;
