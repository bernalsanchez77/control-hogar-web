import { store } from '../../store/store';
import handleScreens from './screensHandler';
import handleDevices from './devicesHandler';
import handleUserDevices from './userDevicesHandler';
import handleYoutubeVideos from './youtubeVideosHandler';
import handleRokuApps from './rokuAppsHandler';
import toolbarHandler from './toolbarHandler';
import handleHdmiSala from './hdmiSalaHandler';
import handleCableChannels from './cableChannelsHandler';
import handleArrows from './arrowsHandler';
import handleLevels from './levelsHandler';
import handleSearch from './searchHandler';
// import { handleLeaderChange } from './leaderHandler';
import requests from '../requests';
import timeSync from '../utils/timeSync';

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

  updateUserDevicesTable(newDate) {
    requests.updateTable({
      id: store.getState().userNameDevicesSt,
      table: 'userDevices',
      date: newDate ? timeSync.getSyncedIsoString() : store.getState().userDevicesSt.find(el => el.id === store.getState().userNameDevicesSt).date,
      isInForeground: store.getState().isInForegroundSt,
      isConnectedToNoky: store.getState().isConnectedToNokySt
    });
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
