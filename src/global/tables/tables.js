import { store } from '../../store/store';
import { handleScreensChange } from './screensHandler';
import { handleYoutubeVideosChange } from './youtubeVideosHandler';
import { handleRokuAppsChange } from './rokuAppsHandler';
import { handleHdmiSalaChange } from './hdmiSalaHandler';
import { handleArrowsChange } from './arrowsHandler';
import { handleUserDevicesChange } from './userDevicesHandler';
import { handleLevelsChange } from './levelsHandler';
import { handleToolbarChange } from './toolbarHandler';
import { handleSearchChange } from './searchHandler';
import { handleCableChannelsChange } from './cableChannelsHandler';
import { handleDevicesChange } from './devicesHandler';
import { handleLeaderChange } from './leaderHandler';
import requests from '../requests';
import timeSync from '../utils/timeSync';


class Tables {
  constructor() {
    this.userNameDevice = '';
  }

  async onHdmiSalaTableChange(oldItem, newItem, eventType) {
    // Top-level hdmiSala table subscription (optional logic)
  }

  async onScreensTableChange(oldItem, newItem, eventType) {
    if (!this.userNameDevice) {
      this.userNameDevice = store.getState().userNameDevicesSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;
    await handleScreensChange(oldItem, newItem, eventType, this.userNameDevice, leader);
  }

  onYoutubeVideosTableChange(oldItem, newItem, eventType) {
    // Top-level youtubeVideos table subscription (optional logic)
  }

  async onDevicesTableChange(oldItem, newItem, eventType) {
    if (!this.userNameDevice) {
      this.userNameDevice = store.getState().userNameDevicesSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;
    await handleDevicesChange(oldItem, newItem, eventType, this.userNameDevice, leader);
  }

  async onUserDevicesTableChange(oldItem, newItem, eventType) {
    if (!this.userNameDevice) {
      this.userNameDevice = store.getState().userNameDevicesSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;
    await handleUserDevicesChange(oldItem, newItem, eventType, this.userNameDevice, leader);
  }

  async onSelectionsTableChange(oldItem, newItem, eventType) {
    if (!this.userNameDevice) {
      this.userNameDevice = store.getState().userNameDevicesSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;

    switch (newItem.table) {
      case 'youtubeVideos':
        await handleYoutubeVideosChange(oldItem, newItem, eventType, this.userNameDevice, leader);
        break;
      case 'rokuApps':
        await handleRokuAppsChange(oldItem, newItem, eventType, this.userNameDevice, leader);
        break;
      case 'playState':
      case 'rev':
      case 'fwd':
        await handleToolbarChange(oldItem, newItem, eventType, this.userNameDevice, leader);
        break;
      case 'hdmiSala':
        await handleHdmiSalaChange(oldItem, newItem, eventType);
        break;
      case 'cableChannels':
        await handleCableChannelsChange(oldItem, newItem, eventType, this.userNameDevice, leader);
        break;
      case 'select':
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        await handleArrowsChange(oldItem, newItem, eventType, this.userNameDevice, leader);
        break;
      case 'info':
      case 'back':
        await handleLevelsChange(oldItem, newItem, eventType, this.userNameDevice, leader);
        break;
      case 'backspace':
      case 'input':
        await handleSearchChange(oldItem, newItem, eventType, this.userNameDevice, leader);
        break;
      case 'leader':
        await handleLeaderChange(oldItem, newItem, eventType, this.userNameDevice, leader);
        break;
      default:
        // Other tables in selections if needed
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
}

const tables = new Tables();
export default tables;
