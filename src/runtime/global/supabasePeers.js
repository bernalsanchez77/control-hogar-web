import supabase from './supabaseClientPeers';
import requests from './runtimeRequests';
import { store } from '../../store/store';
import timeSync from '../../utils/timeSync';
import utils from '../../utils/utils';

class PeersChannel {
  constructor() {
    this.reconnectTimeout = null;
    this.syncTimeout = null;
  }

  getPeers() {
    return store.getState().supabasePeersSt.presenceState();
  }

  getRealPeers(presenceState) {
    const allPresences = Object.values(presenceState).flat();
    const uniquePeersMap = new Map();
    allPresences.forEach((peer) => {
      const existingPeer = uniquePeersMap.get(peer.id);
      if (!existingPeer) {
        uniquePeersMap.set(peer.id, peer);
      } else {
        const peerLastUpdated = new Date(peer.updatedAt || peer.date).getTime();
        const existingLastUpdated = new Date(existingPeer.updatedAt || existingPeer.date).getTime();
        if (peerLastUpdated > existingLastUpdated) {
          uniquePeersMap.set(peer.id, peer);
        }
      }
    });
    return Array.from(uniquePeersMap.values());
  }

  killPeersChannel() {
    if (store.getState().supabasePeersSt) {
      supabase.removeChannel(store.getState().supabasePeersSt);
      store.getState().setSupabasePeersSt(null);
    }
  }
  removeChannel(channel) {
    supabase.removeChannel(channel);
  }

  subscribeToPeersChannel() {
    if (store.getState().supabasePeersSt?.state === 'joining' || store.getState().supabasePeersSt?.state === 'joined') return;
    store.getState().setSupabasePeersSt(supabase.channel('peers', {
      config: {
        presence: {
          key: store.getState().userNameDevicesSt, // identifying the user
        },
      },
    }));
    store.getState().supabasePeersSt.on('presence', { event: 'sync' }, () => {
      if (this.syncTimeout) {
        clearTimeout(this.syncTimeout);
      }
      this.syncTimeout = setTimeout(() => {
        this.syncTimeout = null;
        let expectedLeader;
        const tableLeader = store.getState().selectionsSt.find(el => el.table === 'leader').id;
        const currentUser = store.getState().userNameDevicesSt;
        let usersInPresence = this.getRealPeers(store.getState().supabasePeersSt.presenceState());
        store.getState().setPeersSt(usersInPresence);
        console.log('Users in presence:', usersInPresence);
        const tableLeaderIsInPresence = usersInPresence.some(user => user.id === tableLeader);
        const usersInTable = store.getState().userDevicesSt;
        console.log('Users in table:', usersInTable);
        let newLeaderIsMe = false;
        const usersToSetInPresenceFalse = usersInTable.filter(user =>
          !usersInPresence.some(userInPresence => (userInPresence.id) === user.id) &&
          (user.isInPresence === true || user.isConnectedToNoky === true || user.isInForeground === true)
        );
        const usersToSetInPresenceTrue = usersInTable.filter(user => {
          const presenceData = usersInPresence.find(up => up.id === user.id);
          if (!presenceData) return false;
          return user.isInPresence === false || user.date.slice(0, -6) !== presenceData.date;
        });
        if (usersToSetInPresenceFalse.length > 0) {
          console.log('Users to set isInPresence to false:', usersToSetInPresenceFalse);
        } else {
          console.log('No users to set isInPresence to false.');
        }
        if (usersToSetInPresenceTrue.length > 0) {
          console.log('Users to set isInPresence to true:', usersToSetInPresenceTrue);
        } else {
          console.log('No users to set isInPresence to true.');
        }
        if (tableLeaderIsInPresence) {
          expectedLeader = utils.getExpectedLeader(usersInTable, usersInPresence);
        } else {
          expectedLeader = utils.getExpectedLeader(usersInTable, usersInPresence, tableLeader);
        }
        if (expectedLeader === currentUser) {
          console.log('I am the expected leader, I update the table');
          newLeaderIsMe = true;
        } else {
          console.log('I am not the expected leader, I don\'t update the table');
        }
        if (newLeaderIsMe) {
          if (usersToSetInPresenceFalse.length > 0 || usersToSetInPresenceTrue.length > 0) {
            usersToSetInPresenceFalse.forEach(user => {
              requests.updateTable({
                id: user.id,
                table: 'userDevices',
                date: user.date,
                isInForeground: false,
                wifiName: user.wifiName,
                networkType: user.networkType,
                isConnectedToNoky: false,
                isInPresence: false,
                screenSelected: user.screenSelected,
                isConnectedToInternet: true,
                initDate: user.initDate
              });
            });
            usersToSetInPresenceTrue.forEach(user => {
              const presenceData = usersInPresence.find(u => u.id === user.id);
              if (user.id === currentUser) {
                requests.updateTable({
                  id: currentUser,
                  table: 'userDevices',
                  date: presenceData.date,
                  isInForeground: store.getState().isInForegroundSt,
                  wifiName: store.getState().wifiNameSt,
                  networkType: store.getState().networkTypeSt,
                  isConnectedToNoky: store.getState().isConnectedToNokySt,
                  isInPresence: true,
                  screenSelected: store.getState().screenSelectedSt,
                  isConnectedToInternet: true,
                  initDate: user.initDate
                });
              } else {
                requests.updateTable({
                  id: user.id,
                  table: 'userDevices',
                  date: presenceData.date,
                  isInForeground: user.isInForeground,
                  wifiName: user.wifiName,
                  networkType: user.networkType,
                  isConnectedToNoky: user.isConnectedToNoky,
                  isInPresence: true,
                  screenSelected: user.screenSelected,
                  isConnectedToInternet: true,
                  initDate: user.initDate
                });
              }
            });
          } else {
            console.log('No users to update in userDevices table, checking if selected leader is correct, and if not update correspoding table');
            if (tableLeader === currentUser) {
              console.log('Selected leader is correct.');
            } else {
              console.log(`Table leader (${tableLeader}) is incorrect. I am updating it to myself: ${currentUser}`);
              requests.updateSelections({ table: 'leader', id: currentUser });
            }
          }
        }
      }, 500);
    })
      .subscribe(async (status) => {
        switch (status) {
          case 'SUBSCRIBED':
            console.log(store.getState().userNameDevicesSt + ' subscribed at: ', timeSync.getSyncedIsoString());
            await store.getState().supabasePeersSt.track({
              id: store.getState().userNameDevicesSt,
              date: timeSync.getSyncedIsoString()
            });
            break;
          case 'CHANNEL_ERROR':
          case 'TIMED_OUT':
          case 'CLOSED':
            // if (this.reconnectTimeout) return;
            // console.log(`Peers channel ${status}.`);

            // supabase.removeChannel(this.peersChannel);
            // this.peersChannel = {};

            // if (store.getState().isConnectedToInternetSt) {
            //   console.log('Attempting reconnect in 3s...');
            //   this.reconnectTimeout = setTimeout(() => {
            //     this.reconnectTimeout = null;
            //     this.subscribeToPeersChannel();
            //   }, 3000);
            // }
            break;
          default:
            console.warn('Subscription status change:', status);
        }
      });
  }

  async trackPeers(date) {
    if (store.getState().supabasePeersSt?.track) {
      await store.getState().supabasePeersSt.track({
        id: store.getState().userNameDevicesSt,
        date,
        isConnectedToNoky: store.getState().isConnectedToNokySt,
        isInForeground: store.getState().isInForegroundSt,
        isLeader: store.getState().selectionsSt.find(el => el.table === 'leader')?.id === store.getState().userNameDevicesSt,
        updatedAt: timeSync.getSyncedIsoString()
      });
    }
  }
}
const peersChannelInstance = new PeersChannel();
export default peersChannelInstance;
