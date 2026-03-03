import { store } from '../store/store';
import { handleScreensChange } from './tables/screensHandler';
import { handleYoutubeVideosChange } from './tables/youtubeVideosHandler';
import { handleRokuAppsChange } from './tables/rokuAppsHandler';
import { handlePlayStateChange } from './tables/playStateHandler';
import { handleHdmiSalaChange } from './tables/hdmiSalaHandler';
import { handleArrowsChange } from './tables/arrowsHandler';
import { handleUserDevicesChange } from './tables/userDevicesHandler';
import { handleLevelsChange } from './tables/levelsHandler';
import { handleToolbarChange } from './tables/toolbarHandler';
import { handleSearchChange } from './tables/searchHandler';


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

  async onUserDevicesTableChange(change) {
    if (!this.userName) {
      this.userName = store.getState().userNameSt + '-' + store.getState().userDeviceSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;
    await handleUserDevicesChange(change, this.userName, leader);
  }

  async onSelectionsTableChange(change) {
    if (!this.userName) {
      this.userName = store.getState().userNameSt + '-' + store.getState().userDeviceSt;
    }
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
      case 'rev':
      case 'fwd':
        await handleToolbarChange(change, this.userName, leader);
        break;
      case 'hdmiSala':
        await handleHdmiSalaChange(change);
        break;
      case 'select':
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        await handleArrowsChange(change, this.userName, leader);
        break;
      case 'info':
      case 'back':
        await handleLevelsChange(change, this.userName, leader);
        break;
      case 'backspace':
      case 'input':
        await handleSearchChange(change, this.userName, leader);
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
