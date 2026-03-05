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
import { handleCableChannelsChange } from './tables/cableChannelsHandler';
import { handleDevicesChange } from './tables/devicesHandler';


class Tables {
  constructor() {
    this.userName = '';
  }

  async onHdmiSalaTableChange(oldItem, newItem, eventType) {
    // Top-level hdmiSala table subscription (optional logic)
  }

  async onScreensTableChange(oldItem, newItem, eventType) {
    await handleScreensChange(oldItem, newItem, eventType);
  }

  onYoutubeVideosTableChange(oldItem, newItem, eventType) {
    // Top-level youtubeVideos table subscription (optional logic)
  }

  async onDevicesTableChange(oldItem, newItem, eventType) {
    if (!this.userName) {
      this.userName = store.getState().userNameDeviceSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;
    await handleDevicesChange(oldItem, newItem, eventType, this.userName, leader);
  }

  async onUserDevicesTableChange(oldItem, newItem, eventType) {
    if (!this.userName) {
      this.userName = store.getState().userNameDeviceSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;
    await handleUserDevicesChange(oldItem, newItem, eventType, this.userName, leader);
  }

  async onSelectionsTableChange(oldItem, newItem, eventType) {
    if (!this.userName) {
      this.userName = store.getState().userNameDeviceSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;

    switch (newItem.table) {
      case 'youtubeVideos':
        await handleYoutubeVideosChange(oldItem, newItem, eventType, this.userName, leader);
        break;
      case 'rokuApps':
        await handleRokuAppsChange(oldItem, newItem, eventType, this.userName, leader);
        break;
      case 'playState':
        await handlePlayStateChange(oldItem, newItem, eventType, this.userName, leader);
        break;
      case 'rev':
      case 'fwd':
        await handleToolbarChange(oldItem, newItem, eventType, this.userName, leader);
        break;
      case 'hdmiSala':
        await handleHdmiSalaChange(oldItem, newItem, eventType);
        break;
      case 'cableChannels':
        await handleCableChannelsChange(oldItem, newItem, eventType, this.userName, leader);
        break;
      case 'select':
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        await handleArrowsChange(oldItem, newItem, eventType, this.userName, leader);
        break;
      case 'info':
      case 'back':
        await handleLevelsChange(oldItem, newItem, eventType, this.userName, leader);
        break;
      case 'backspace':
      case 'input':
        await handleSearchChange(oldItem, newItem, eventType, this.userName, leader);
        break;
      case 'leader':
        console.log('leader changed:', newItem.id);
        break;
      default:
        // Other tables in selections if needed
        break;
    }
  }
}

const tables = new Tables();
export default tables;
