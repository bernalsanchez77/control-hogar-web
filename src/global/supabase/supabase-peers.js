import supabase from './supabase-client';
import requests from '../requests';
import { store } from '../../store/store';

class PeersChannel {
  constructor() {
    this.peersChannel = {};
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

  subscribeToPeersChannel() {
    this.peersChannel.status = 'subscribing';
    const userName = store.getState().userNameSt;
    const userDevice = store.getState().userDeviceSt;
    this.peersChannel = supabase.channel('peers', {
      config: {
        presence: {
          key: userName + '-' + userDevice, // identifying the user
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
        const me = store.getState().userNameSt + '-' + store.getState().userDeviceSt;
        const currentLeaderInDb = store.getState().selectionsSt.find(el => el.table === 'leader')?.id;

        if (potentialLeader) {
          if (potentialLeader.name === me && currentLeaderInDb !== me) {
            requests.updateSelections({ table: 'leader', id: me });
          }
        } else if (realPeers.length > 0) {
          // No one on Noky. Oldest overall peer clears the record.
          const oldestOverall = [...realPeers].sort((a, b) => new Date(a.date) - new Date(b.date))[0];
          if (oldestOverall.name === me && currentLeaderInDb !== '') {
            requests.updateSelections({ table: 'leader', id: '' });
          }
        }
        console.log('realPeers: ', realPeers);
        store.getState().setPeersSt(realPeers);
      })
      .subscribe(async (status) => {
        switch (status) {
          case 'SUBSCRIBED':
            this.peersChannel.status = 'subscribed';
            console.log('subscribed and isConnectedToNoky:', store.getState().isConnectedToNokySt);
            await this.peersChannel.track({
              name: store.getState().userNameSt + '-' + store.getState().userDeviceSt,
              status: store.getState().isInForegroundSt ? 'foreground' : 'background',
              date: new Date().toISOString(),
              isConnectedToNoky: store.getState().isConnectedToNokySt,
            });
            break;
          case 'CHANNEL_ERROR':
            console.log('peers error');
            if (this.peersChannel.status !== 'unsubscribed') {
              this.peersChannel.status = 'unsubscribed';
              supabase.removeChannel(this.peersChannel);
            }
            break;
          case 'TIMED_OUT':
            console.log('peers time out');
            if (this.peersChannel.status !== 'unsubscribed') {
              this.peersChannel.status = 'unsubscribed';
              supabase.removeChannel(this.peersChannel);
            }
            break;
          case 'CLOSED':
            // console.log('peers closed');
            if (this.peersChannel.status !== 'unsubscribed') {
              this.peersChannel.status = 'unsubscribed';
              supabase.removeChannel(this.peersChannel);
            }
            break;
          default:
            console.warn('Subscription error for other reason');
        }
      });
  }
}
const peersChannelInstance = new PeersChannel();
export default peersChannelInstance;
