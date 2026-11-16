import { store } from '../../store/store';
import handleScreens from './modules/screensHandler';
import handleDevices from './modules/devicesHandler';
import handleUserDevices from './modules/userDevicesHandler';
import handleYoutubeVideos from './modules/youtubeVideosHandler';
import handleRokuApps from './modules/rokuAppsHandler';
import toolbarHandler from './modules/toolbarHandler';
import handleHdmiSala from './modules/hdmiSalaHandler';
import handleCableChannels from './modules/cableChannelsHandler';
import handleArrows from './modules/arrowsHandler';
import handleLevels from './modules/levelsHandler';
import handleSearch from './modules/searchHandler';
// import { handleLeaderChange } from './leaderHandler';

class Tables {
  constructor() {
    this.userNameDevice = '';
  }

  async onHdmiSalaTableChange(oldItem, newItem, eventType) {
    // Top-level hdmiSala table subscription (optional logic)
  }

  onYoutubeVideosTableChange(oldItem, newItem, eventType) {
    // Top-level youtubeVideos table subscription (optional logic)
  }

  async onScreensTableChange(oldItem, newItem, eventType) {
    await this.handleChange(handleScreens, oldItem, newItem, eventType);
  }

  async onDevicesTableChange(oldItem, newItem, eventType) {
    await this.handleChange(handleDevices, oldItem, newItem, eventType);
  }

  async onUserDevicesTableChange(oldItem, newItem, eventType) {
    if (!this.userNameDevice) {
      this.userNameDevice = store.getState().userNameDevicesSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;
    await handleUserDevices(oldItem, newItem, eventType, this.userNameDevice, leader);
  }

  async onSelectionsTableChange(oldItem, newItem, eventType) {
    switch (newItem.table) {
      case 'youtubeVideos':
        await this.handleChange(handleYoutubeVideos, oldItem, newItem, eventType);
        break;
      case 'rokuApps':
        await this.handleChange(handleRokuApps, oldItem, newItem, eventType);
        break;
      case 'playState':
      case 'rev':
      case 'fwd':
        await this.handleChange(toolbarHandler, oldItem, newItem, eventType);
        break;
      case 'hdmiSala':
        await this.handleChange(handleHdmiSala, oldItem, newItem, eventType);
        break;
      case 'cableChannels':
        await this.handleChange(handleCableChannels, oldItem, newItem, eventType);
        break;
      case 'select':
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        await this.handleChange(handleArrows, oldItem, newItem, eventType);
        break;
      case 'info':
      case 'back':
        await this.handleChange(handleLevels, oldItem, newItem, eventType);
        break;
      case 'backspace':
      case 'input':
        await this.handleChange(handleSearch, oldItem, newItem, eventType);
        break;
      case 'leader':
        // await handleLeaderChange(oldItem, newItem, eventType, this.userNameDevice, leader);
        break;
      default:
        break;
    }
  }

  verifyUser(triggerUser) {
    if (!this.userNameDevice) {
      this.userNameDevice = store.getState().userNameDevicesSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;
    if (store.getState().skipLeaderSt) {
      if (triggerUser === this.userNameDevice) {
        return true;
      }
    } else {
      if (this.userNameDevice === leader) {
        return true;
      }
    }
    return false;
  }

  async handleChange(fn, oldItem, newItem, eventType) {
    if (this.verifyUser(newItem.triggerUser)) {
      await fn.external(oldItem, newItem, eventType);
    }
    fn.internal(oldItem, newItem, eventType);
  }
}

const tables = new Tables();
export default tables;
