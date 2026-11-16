import { store } from '../../../store/store';
import requests from '../../global/runtimeRequests';
import roku from '../../global/roku';
import utils from '../../../utils/utils';
import Statusbar from '../../global/statusbar';
import BackgroundService from '../../global/backgroundService';
import supabasePeers from '../../global/supabasePeers';
import lifecycle from '../../global/lifecycle';

let isBackgroundServiceListening = false;
let isUpdatingConnection = false;

const handleUserDevices = async (userBefore, userNow, eventType, userNameDevice, leader) => {
  const userDevices = store.getState().userDevicesSt;
  const expectedLeader = utils.getExpectedLeader(userDevices, store.getState().peersSt);

  const messages = {
    'initDate': {
      'true': {
        'me': 'I am starting the app now!',
        'other': ' is starting the app now!',
      },
    },
    'presenceDate': {
      'true': {
        'me': 'I have the latest presence date now',
        'other': ' has the latest presence date now',
      },
    },
    'isInPresence': {
      'true': {
        'me': 'I am in presence now',
        'other': ' is in presence now',
      },
      'false': {
        'me': 'I am not in presence anymore, yet I received an update',
        'other': ' is not in presence anymore',
      },
    },
    'isConnectedToNoky': {
      'true': {
        'me': 'I am connected to Noky now',
        'other': ' is connected to Noky now',
      },
      'false': {
        'me': 'I am not connected to Noky anymore',
        'other': ' is not connected to Noky anymore',
      },
    },
    'wifiName': {
      'true': {
        'me': 'I am connected to ' + userNow.wifiName,
        'other': ' is connected to ' + userNow.wifiName,
      },
      'false': {
        'me': 'I am not connected to any wifi anymore',
        'other': ' is not connected to any wifi anymore',
      },
    },
    'networkType': {
      'true': {
        'me': 'I am connected to cellular network now',
        'other': ' is connected to cellular network now',
      },
      'false': {
        'me': 'I am not connected to any cellular network anymore',
        'other': ' is not connected to any cellular network anymore',
      },
    },
    'isInForeground': {
      'true': {
        'me': 'I am in foreground now',
        'other': ' is in foreground now',
      },
      'false': {
        'me': 'I am in background now',
        'other': ' is in background now',
      },
    },
  };

  const restart = async () => {
    if (store.getState().isRestartingSt) return;
    store.getState().setIsRestartingSt(true);
    store.getState().setIsLoadingMessageShowingSt(false);
    if (store.getState().isConnectedToInternetIntervalSt) {
      clearInterval(store.getState().isConnectedToInternetIntervalSt);
      store.getState().setIsConnectedToInternetIntervalSt(null);
    }
    killPeersChannel();
    const bgFlag = !store.getState().isInForegroundSt ? '?isInBackground=true' : '';
    await new Promise((resolve) => {
      setTimeout(() => {
        window.location.href = window.location.pathname + bgFlag;
        resolve();
      }, 2000);
    });
  };

  const updateNotificationBar = async () => {
    const isPlaying = store.getState().selectionsSt.find(el => el.table === 'playState')?.id === 'play';
    Statusbar.updatePlayState(isPlaying);
    const screenSelected = store.getState().screensSt.find(el => el.id === store.getState().screenSelectedSt);
    if (screenSelected) {
      Statusbar.updateScreenSelected(screenSelected.label + ' ' + screenSelected.state.toUpperCase());
      Statusbar.updateScreenState(screenSelected.state);
      Statusbar.updateMuteState(screenSelected.mute);
    }
    const rokuAppsSelectedRokuId = store.getState().selectionsSt.find(el => el.table === 'rokuApps')?.id;
    const appSelected = store.getState().rokuAppsSt.find(el => el.rokuId === rokuAppsSelectedRokuId);
    if (appSelected) {
      Statusbar.updateAppSelected(appSelected.label);
    }
  };

  const killPeersChannel = () => {
    if (store.getState().supabasePeersSt) {
      supabasePeers.removeChannel(store.getState().supabasePeersSt);
      store.getState().setSupabasePeersSt(null);
    }
  };

  const consoleText = (isChanged, msg) => {
    if (userNameDevice === userNow.id) {
      console.log(messages[msg][isChanged].me);
    } else {
      console.log(userNow.id + ' ' + messages[msg][isChanged].other);
    }
  };

  const handleText = (msg) => {
    if (userNow[msg]) {
      consoleText('true', msg);
    } else {
      consoleText('false', msg);
    }
  };

  const updateLeader = () => {
    if (expectedLeader === userNameDevice) {
      if (leader === userNameDevice) {
        console.log('I am the expected leader, but I am the leader, so no need to update the leader');
      } else {
        console.log('I update the leader to myself');
        requests.updateSelections({ table: 'leader', id: userNameDevice });
      }
    }
  };

  const onWifiNameChange = async (wifiName) => {
    if (store.getState().isInForegroundSt) {
      await restart();
    } else {
      store.getState().setRestartOnResume(true);
      // store.getState().setWifiNameSt(wifiName);
      setTimeout(async () => {
        if (!isUpdatingConnection) {
          isUpdatingConnection = true;
          // await updateConnection();
          setTimeout(() => {
            isUpdatingConnection = false;
          }, 1000);
        }
      }, 5000);
    }
  }

  const onNetworkTypeChange = async (networkType) => {
    if (store.getState().isInForegroundSt) {
      await restart();
    } else {
      store.getState().setRestartOnResume(true);
      // store.getState().setNetworkTypeSt(networkType);
      setTimeout(async () => {
        if (!isUpdatingConnection) {
          isUpdatingConnection = true;
          // await updateConnection();
          setTimeout(() => {
            isUpdatingConnection = false;
          }, 1000);
        }
      }, 5000);
    }
  }

  const initDateChange = async () => {
    // a user started the app
    console.log('initDate changed for ' + userNow.id);
    consoleText('true', 'initDate');
    if (userNow.id === userNameDevice) {
      await supabasePeers.subscribeToPeersChannel();
      lifecycle.startEventListeners();
      if (store.getState().isAppSt) {
        if (!isBackgroundServiceListening) {
          await BackgroundService.getPermissions();
          await BackgroundService.startWifiNameListener((wifiName) => onWifiNameChange(wifiName));
          await BackgroundService.startNetworkTypeListener((netType) => onNetworkTypeChange(netType));
          isBackgroundServiceListening = true;
        }
        updateNotificationBar();
      }
    }
  }

  const presenceDateChange = async () => {
    // a user returned to presence
    console.log('presenceDate changed from ' + userBefore.date.slice(11, 19) + ' to ' + userNow.date.slice(11, 19) + ' for ' + userNow.id + ' the leader should be ' + expectedLeader);
    consoleText('true', 'presenceDate');
    updateLeader();
    if (userNow.id === userNameDevice) {
      if (expectedLeader === userNameDevice && store.getState().isConnectedToNokySt) {
        roku.activatePlayStateListener();
        await roku.updateDataInSelections();
      }
    }
  };

  const isInForegroundChange = async () => {
    console.log('isInForeground changed from ' + userBefore.isInForeground + ' to ' + userNow.isInForeground + ' for ' + userNow.id + ', the leader should be ' + expectedLeader);
    if (userNow.isInForeground && (!userNow.isInPresence || store.getState().restartOnResume)) {
      await restart();
    } else {
      handleText('isInForeground');
      if (expectedLeader === userNameDevice && leader !== userNameDevice) {
        console.error('watch out, change in isInForeground and leader was not correct');
        localStorage.setItem('leaderfixed', userNameDevice);
        requests.updateSelections({ table: 'leader', id: userNameDevice });
      }
      if (userNameDevice === leader && store.getState().isConnectedToNokySt) {
        await roku.updateDataInSelections();
      }
    }
  };

  const isConnectedToInternetChange = async () => {
    console.log('isConnectedToInternet changed from ' + userBefore.isConnectedToInternet + ' to ' + userNow.isConnectedToInternet + ' for ' + userNow.id + ', the leader should be ' + expectedLeader);
    if (!userNow.isConnectedToInternet) {
      await restart();
    }
  };

  const wifiNameChange = async () => {
    console.log('wifiName changed from ' + userBefore.wifiName + ' to ' + userNow.wifiName + ' for ' + userNow.id + ', the leader should be ' + expectedLeader);
    updateLeader();
    if (userNow.id === userNameDevice) {
    } else {
      handleText('wifiName');
    }
  };

  const networkTypeChange = async () => {
    console.log('networkType changed from ' + userBefore.networkType + ' to ' + userNow.networkType + ' for ' + userNow.id + ', the leader should be ' + expectedLeader);
    updateLeader();
    if (userNow.id === userNameDevice) {
    } else {
      handleText('networkType');
    }
  };

  const screenSelectedChange = async () => {
    if (userNow.id === userNameDevice && store.getState().isAppSt) {
      const screenSelected = store.getState().screensSt.find(el => el.id === userNow.screenSelected);
      Statusbar.updateScreenSelected(screenSelected.label + ' ' + screenSelected.state.toUpperCase());
      Statusbar.updateScreenState(screenSelected.state);
      Statusbar.updateMuteState(screenSelected.mute);
    }
  };

  const isInPresenceChange = async () => {
    // a user left presence
    // if (!userNow.isInPresence) {
    //   localStorage.setItem('isInPresence', userNow.triggerUser);
    // }
    // console.log('isInPresence changed from ' + userBefore.isInPresence + ' to ' + userNow.isInPresence + ' for ' + userNow.id + ' the leader should be ' + expectedLeader);
    // handleText('isInPresence');
    // updateLeader();
    // if (userNameDevice === leader && store.getState().isConnectedToNokySt) {
    //   await roku.updateDataInSelections();
    // }
  };

  if (userNow.isConnectedToInternet !== userBefore.isConnectedToInternet) {
    await isConnectedToInternetChange(userBefore, userNow, userNameDevice);
  } else if (userNow.initDate !== userBefore.initDate) {
    await initDateChange(userBefore, userNow, userNameDevice);
  } else if (userNow.date !== userBefore.date) {
    await presenceDateChange(userBefore, userNow, userNameDevice);
  } else if (userNow.isInPresence !== userBefore.isInPresence) {
    await isInPresenceChange(userBefore, userNow, userNameDevice);
  } else if (userNow.wifiName !== userBefore.wifiName) {
    await wifiNameChange(userBefore, userNow, userNameDevice);
  } else if (userNow.networkType !== userBefore.networkType) {
    await networkTypeChange(userBefore, userNow, userNameDevice);
  } else if (userNow.isInForeground !== userBefore.isInForeground) {
    await isInForegroundChange(userBefore, userNow, userNameDevice);
  } else if (userNow.screenSelected !== userBefore.screenSelected) {
    await screenSelectedChange(userBefore, userNow, userNameDevice);
  }
};

export default handleUserDevices;
