import { store } from '../store/store';
import { handleScreensChange } from './tables/screensHandler';
import { handleYoutubeVideosChange } from './tables/youtubeVideosHandler';
import { handleRokuAppsChange } from './tables/rokuAppsHandler';
import { handleHdmiSalaChange } from './tables/hdmiSalaHandler';
import { handleArrowsChange } from './tables/arrowsHandler';
import { handleUserDevicesChange } from './tables/userDevicesHandler';
import { handleLevelsChange } from './tables/levelsHandler';
import { handleToolbarChange } from './tables/toolbarHandler';
import { handleSearchChange } from './tables/searchHandler';
import { handleCableChannelsChange } from './tables/cableChannelsHandler';
import { handleDevicesChange } from './tables/devicesHandler';
import { handleLeaderChange } from './tables/leaderHandler';
import requests from './requests';
import timeSync from './timeSync';


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
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader2')?.id;
    await handleScreensChange(oldItem, newItem, eventType, this.userNameDevice, leader);
  }

  onYoutubeVideosTableChange(oldItem, newItem, eventType) {
    // Top-level youtubeVideos table subscription (optional logic)
  }

  async onDevicesTableChange(oldItem, newItem, eventType) {
    if (!this.userNameDevice) {
      this.userNameDevice = store.getState().userNameDevicesSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader2')?.id;
    await handleDevicesChange(oldItem, newItem, eventType, this.userNameDevice, leader);
  }

  async onUserDevicesTableChange(oldItem, newItem, eventType) {
    if (!this.userNameDevice) {
      this.userNameDevice = store.getState().userNameDevicesSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader2')?.id;
    await handleUserDevicesChange(oldItem, newItem, eventType, this.userNameDevice, leader);
  }

  async onSelectionsTableChange(oldItem, newItem, eventType) {
    if (!this.userNameDevice) {
      this.userNameDevice = store.getState().userNameDevicesSt;
    }
    const leader = store.getState().selectionsSt.find(el => el.table === 'leader2')?.id;

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
      case 'leader2':
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
      table: 'userDevices2',
      date: newDate ? timeSync.getSyncedIsoString() : store.getState().userDevices2St.find(el => el.id === store.getState().userNameDevicesSt).date,
      isInForeground: store.getState().isInForegroundSt,
      isConnectedToNoky: store.getState().isConnectedToNokySt
    });
  }
}

const tables = new Tables();
export default tables;
