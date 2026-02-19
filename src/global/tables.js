import { store } from '../store/store';
import { handleScreensChange } from './tables/screensHandler';
import { handleYoutubeVideosChange } from './tables/youtubeVideosHandler';
import { handleRokuAppsChange } from './tables/rokuAppsHandler';
import { handlePlayStateChange } from './tables/playStateHandler';
import { handleHdmiSalaChange } from './tables/hdmiSalaHandler';

class Tables {
  constructor() {
    this.userName = '';
  }

  async onHdmiSalaTableChange(change) {
    // Top-level hdmiSala table subscription (optional logic)
  }

  async onScreensTableChange(change) {
    await handleScreensChange(change);
  }

  onYoutubeVideosTableChange(change) {
    // Top-level youtubeVideos table subscription (optional logic)
  }

  async onSelectionsTableChange(change) {
    this.userName = store.getState().userNameSt + '-' + store.getState().userDeviceSt;
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;

    switch (change.table) {
      case 'youtubeVideos':
        await handleYoutubeVideosChange(change, this.userName, leader);
        break;
      case 'rokuApps':
        await handleRokuAppsChange(change, this.userName, leader);
        break;
      case 'playState':
        await handlePlayStateChange(change, this.userName, leader);
        break;
      case 'hdmiSala':
        await handleHdmiSalaChange(change);
        break;
      case 'leader':
        console.log('leader changed:', change.id);
        break;
      default:
        // Other tables in selections if needed
        break;
    }
  }
}

const tables = new Tables();
export default tables;
