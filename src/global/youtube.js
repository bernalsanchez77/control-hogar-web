import requests from './requests';
import { store } from '../store/store';

class Youtube {
  clearQueue() {
    const queueElements = store.getState().youtubeVideosLizSt.filter(video => video.queue > 0);
    if (queueElements.length > 0) {
      queueElements.forEach(video => {
        requests.updateTable({
          new: { newId: video.id, newTable: 'youtubeVideosLiz', newQueue: 0 }
        });
      });
    }
  }
  clearCurrentVideo() {
    const selectedVideo = store.getState().youtubeVideosLizSt.find(vid => vid.state === 'selected');
    if (selectedVideo) {
      requests.updateTable({
        current: { currentId: selectedVideo.id, currentTable: 'youtubeVideosLiz', currentState: '' }
      });
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
      requests.updateTable({
        new: { newId: video.id, newTable: 'youtubeVideosLiz', newQueue: 0, newDate: video.date }
      });
    } else {
      const lastQueue = this.getLastQueue().queue;
      requests.updateTable({
        new: { newId: video.id, newTable: 'youtubeVideosLiz', newQueue: lastQueue + 1, newDate: video.date }
      });
    }
  }
  onVideoShortClick(video) {
    const rokuId = store.getState().rokuAppsSt.find(app => app.id === 'youtube').rokuId;
    const currentVideo = store.getState().youtubeVideosLizSt.find(vid => vid.state === 'selected');
    const isInYoutubeVideosLizSt = store.getState().youtubeVideosLizSt.find(vid => vid.id === video.id);
    if (currentVideo) {
      if (currentVideo.id !== video.id) {
        requests.fetchRoku({ key: 'launch', value: rokuId, params: { contentID: video.id } });
        if (isInYoutubeVideosLizSt) {
          requests.updateTable({
            current: { currentId: currentVideo.id, currentTable: 'youtubeVideosLiz' },
            new: { newId: video.id, newTable: 'youtubeVideosLiz' }
          });
          requests.updateTable2({ table: 'youtubeVideosLiz', id: currentVideo.id });
        } else {
          requests.updateTable({
            current: { currentId: currentVideo.id, currentTable: 'youtubeVideosLiz', currentState: '' }
          });
        }
      }
    } else {
      requests.fetchRoku({ key: 'launch', value: rokuId, params: { contentID: video.id } });
      if (isInYoutubeVideosLizSt) {
        requests.updateTable({
          new: { newId: video.id, newTable: 'youtubeVideosLiz', newState: 'selected' }
        });
      }
    }
    const rokuAppsSt = store.getState().rokuAppsSt;
    const rokuActiveApp = rokuAppsSt.find(app => app.state === 'selected').id;
    if (rokuActiveApp !== 'youtube') {
      requests.updateTable({
        current: { currentId: rokuActiveApp, currentTable: 'rokuApps' },
        new: { newId: 'youtube', newTable: 'rokuApps' }
      });
    }
    this.clearQueue();
  }
}
const youtube = new Youtube();
export default youtube;
