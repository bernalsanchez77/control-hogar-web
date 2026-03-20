import supabase from './supabase-client';
import requests from '../requests';
import { store } from '../../store/store';
import timeSync from '../timeSync';
import utils from '../utils';

class PeersChannel {
  constructor() {
    this.peersChannel = {};
    this.reconnectTimeout = null;
    this.syncTimeout = null;
  }

  getPeers() {
    return this.peersChannel.presenceState();
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
    supabase.removeChannel(this.peersChannel);
    this.peersChannel = {};
  }

  subscribeToPeersChannel() {
    if (this.peersChannel?.state === 'joining' || this.peersChannel?.state === 'joined') return;
    this.peersChannel = supabase.channel('peers', {
      config: {
        presence: {
          key: store.getState().userNameDevicesSt, // identifying the user
        },
      },
    })
    this.peersChannel
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        // const newUser = newPresences[0].id;
        // const currentUser = store.getState().userNameDevicesSt;
        // const currentTime = timeSync.getSyncedIsoString();
        // const isConnectedToNoky = store.getState().isConnectedToNokySt;
        // const timeout = 1000;

        // if (newUser === currentUser) {
        //   console.log('%cI joined, updating table', 'color: lightgreen;');
        //   // setTimeout(() => {
        //   requests.updateTable({
        //     id: currentUser,
        //     table: 'userDevices2',
        //     date: currentTime,
        //     isInForeground: true,
        //     isConnectedToNoky: isConnectedToNoky,
        //     isInPresence: true
        //   });
        //   // }, timeout);
        // } else {
        //   console.log('%c' + newUser + ' joined, I do not update the table cause I am not that user', 'color: lightgreen;');
        // }
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        // const leftUser = leftPresences[0].id;
        // const currentUser = store.getState().userNameDevicesSt;
        // const currentLeader = store.getState().selectionsSt.find(el => el.table === 'leader2').id;
        // const timeout = 1000;

        // if (leftUser === currentLeader) {
        //   const expectedLeader = utils.getExpectedLeader(store.getState().userDevices2St, leftUser);
        //   if (expectedLeader === currentUser) {
        //     const leftUserData = store.getState().userDevices2St.find(d => d.id === leftUser);
        //     console.log('%cI update the table after the leader ' + leftUser + ' left, I am the new leader now', 'color: yellow;');
        //     // setTimeout(() => {
        //     requests.updateTable({
        //       id: leftUser,
        //       table: 'userDevices2',
        //       date: leftUserData.date,
        //       isInForeground: false,
        //       isConnectedToNoky: false,
        //       isInPresence: false
        //     });
        //     // }, timeout);
        //   } else {
        //     console.log('%cI do not update the table after the leader ' + leftUser + ' left, I am not the new leader', 'color: yellow;');
        //   }
        // } else if (currentLeader === currentUser) {
        //   const leftUserData = store.getState().userDevices2St.find(d => d.id === leftUser);
        //   console.log('%cI am the leader so I updated the table after ' + leftUser + ' left', 'color: yellow;');
        //   // setTimeout(() => {
        //   requests.updateTable({
        //     id: leftUser,
        //     table: 'userDevices2',
        //     date: leftUserData.date,
        //     isInForeground: false,
        //     isConnectedToNoky: false,
        //     isInPresence: false
        //   });
        //   // }, timeout);
        // } else {
        //   console.log('%c' + leftUser + ' left, I am not the leader so I do not update the table', 'color: yellow;');
        // }
      })
      .on('presence', { event: 'sync' }, () => {
        if (this.syncTimeout) {
          clearTimeout(this.syncTimeout);
        }
        this.syncTimeout = setTimeout(() => {
          this.syncTimeout = null;
          let expectedLeader;
          const tableLeader = store.getState().selectionsSt.find(el => el.table === 'leader2').id;
          const currentUser = store.getState().userNameDevicesSt;
          let usersInPresence = this.getRealPeers(this.peersChannel.presenceState());
          // temporal, erase later
          usersInPresence = usersInPresence.filter(d => d.name !== 'amanda-celular');
          // end temporal
          store.getState().setPeersSt(usersInPresence);
          console.log('Users in presence:', usersInPresence);
          const tableLeaderIsInPresence = usersInPresence.some(user => user.id === tableLeader);
          const usersInTable = store.getState().userDevices2St;
          let leaderIsMe = false;
          const usersToSetInPresenceFalse = usersInTable.filter(user =>
            !usersInPresence.some(userInPresence => (userInPresence.id) === user.id) &&
            user.isInPresence === true
          );
          const usersToSetInPresenceTrue = usersInTable.filter(user => {
            const presenceData = usersInPresence.find(up => up.id === user.id);
            if (!presenceData) return false;
            return user.isInPresence === false || user.date !== presenceData.date;
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
            console.log('Table Leader is in presence');
            expectedLeader = utils.getExpectedLeader(usersInTable, usersInPresence);
          } else {
            console.log('Table Leader is not in presence');
            expectedLeader = utils.getExpectedLeader(usersInTable, usersInPresence, tableLeader);
          }
          if (expectedLeader === currentUser) {
            console.log('I am the expected leader, I have to update the table');
            leaderIsMe = true;
          } else {
            console.log('I am not the expected leader, I don\'t have to update the table');
          }
          if (leaderIsMe) {
            if (usersToSetInPresenceFalse.length > 0 || usersToSetInPresenceTrue.length > 0) {
              usersToSetInPresenceFalse.forEach(user => {
                requests.updateTable({
                  id: user.id,
                  table: 'userDevices2',
                  date: user.date,
                  isInForeground: false,
                  isConnectedToNoky: false,
                  isInPresence: false
                });
              });
              usersToSetInPresenceTrue.forEach(user => {
                const presenceData = usersInPresence.find(u => u.id === user.id);
                if (user.id === currentUser) {
                  requests.updateTable({
                    id: currentUser,
                    table: 'userDevices2',
                    date: presenceData.date,
                    isInForeground: store.getState().isInForegroundSt,
                    isConnectedToNoky: store.getState().isConnectedToNokySt,
                    isInPresence: true
                  });
                } else {
                  requests.updateTable({
                    id: user.id,
                    table: 'userDevices2',
                    date: presenceData.date,
                    isInForeground: user.isInForeground,
                    isConnectedToNoky: user.isConnectedToNoky,
                    isInPresence: true
                  });
                }
              });
            } else {
              console.log('No users to update in userDevices2 table, checking if selected leader is correct, and if not update correspoding table');
              if (tableLeader !== currentUser) {
                console.log(`Table leader (${tableLeader}) is incorrect. I am updating it to myself: ${currentUser}`);
                requests.updateSelections({ table: 'leader2', id: currentUser });
              } else {
                console.log('Selected leader is correct.');
              }
            }
          }
        }, 500);
      })
      .subscribe(async (status) => {
        switch (status) {
          case 'SUBSCRIBED':
            console.log('Peers channel SUBSCRIBED at: ', timeSync.getSyncedIsoString());
            await this.peersChannel.track({
              id: store.getState().userNameDevicesSt,
              date: timeSync.getSyncedIsoString(),
              // isConnectedToNoky: store.getState().isConnectedToNokySt,
              // isInForeground: store.getState().isInForegroundSt,
              // isLeader: store.getState().selectionsSt.find(el => el.table === 'leader2')?.id === store.getState().userNameDevicesSt,
              // updatedAt: timeSync.getSyncedIsoString()
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
    if (this.peersChannel?.track) {
      await this.peersChannel.track({
        id: store.getState().userNameDevicesSt,
        date,
        isConnectedToNoky: store.getState().isConnectedToNokySt,
        isInForeground: store.getState().isInForegroundSt,
        isLeader: store.getState().selectionsSt.find(el => el.table === 'leader2')?.id === store.getState().userNameDevicesSt,
        updatedAt: timeSync.getSyncedIsoString()
      });
    }
  }
}
const peersChannelInstance = new PeersChannel();
export default peersChannelInstance;
