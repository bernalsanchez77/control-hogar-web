import supabase from './supabase-client';
import requests from '../requests';
import { store } from '../../store/store';
import timeSync from '../timeSync';

class PeersChannel {
  constructor() {
    this.peersChannel = {};
    this.reconnectTimeout = null;
  }

  getPeers() {
    return this.peersChannel.presenceState();
  }

  getRealPeers(presenceState) {
    const allPresences = Object.values(presenceState).flat();
    const uniquePeersMap = new Map();
    allPresences.forEach((peer) => {
      const existingPeer = uniquePeersMap.get(peer.name);
      if (!existingPeer || new Date(peer.date) > new Date(existingPeer.date)) {
        uniquePeersMap.set(peer.name, peer);
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
          key: store.getState().userNameDeviceSt, // identifying the user
        },
      },
    })
    this.peersChannel
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        //console.log(newPresences[0].name, 'joined');
        if (newPresences[0].name === 'Noky') {
          console.log('Noky joined');
        }
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        //console.log(leftPresences[0].name, 'left');
      })
      .on('presence', { event: 'sync' }, async () => {
        const newState = this.peersChannel.presenceState();
        const realPeers = this.getRealPeers(newState);
        // Deterministic Leader Selection: Newest peer on "Noky" wifi handles the record
        const sortedByNewest = [...realPeers].sort((a, b) => new Date(b.date) - new Date(a.date));
        const potentialLeader = sortedByNewest.find(p => p.isConnectedToNoky);
        const me = store.getState().userNameDeviceSt;
        let currentLeaderInDb = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;

        if (potentialLeader) {
          if (potentialLeader.name === me && currentLeaderInDb !== me) {
            requests.updateSelections({ table: 'leader', id: me });
            currentLeaderInDb = me;
          }
        } else if (realPeers.length > 0) {
          // No one on Noky. Oldest overall peer clears the record.
          const oldestOverall = [...realPeers].sort((a, b) => new Date(a.date) - new Date(b.date))[0];
          if (oldestOverall.name === me && currentLeaderInDb !== me) {
            requests.updateSelections({ table: 'leader', id: me });
            currentLeaderInDb = me;
          }
        }

        console.log('realPeers: ', realPeers);
        store.getState().setPeersSt(realPeers);
      })
      .subscribe(async (status) => {
        switch (status) {
          case 'SUBSCRIBED':
            console.log('Peers channel SUBSCRIBED.');
            await this.peersChannel.track({
              name: store.getState().userNameDeviceSt,
              date: timeSync.getSyncedIsoString(),
              isConnectedToNoky: store.getState().isConnectedToNokySt,
              isInForeground: store.getState().isInForegroundSt,
              isLeader: store.getState().selectionsSt.find(el => el.table === 'leader')?.id === store.getState().userNameDeviceSt,
              isConnectedToInternet: store.getState().isConnectedToInternetSt,
            });
            break;
          case 'CHANNEL_ERROR':
          case 'TIMED_OUT':
          case 'CLOSED':
            // if (this.reconnectTimeout) return;
            console.log(`Peers channel ${status}.`);

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
        name: store.getState().userNameDeviceSt,
        date,
        isConnectedToNoky: store.getState().isConnectedToNokySt,
        isInForeground: store.getState().isInForegroundSt,
        isLeader: store.getState().selectionsSt.find(el => el.table === 'leader')?.id === store.getState().userNameDeviceSt,
        isConnectedToInternet: store.getState().isConnectedToInternetSt,
      });
    }
  }
}
const peersChannelInstance = new PeersChannel();
export default peersChannelInstance;
