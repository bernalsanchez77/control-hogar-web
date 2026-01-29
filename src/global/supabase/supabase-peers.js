import supabase from './supabase-client';
import { store } from '../../store/store';

class PeersChannel {
    constructor() {
        this.peersChannel = {};
    }

    getLeader(peers) {
        const leader = peers.find(peer => peer.wifiName === 'Noky');
        return leader ? leader.name : '';
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
        console.log('subscribing to peers channel');
        this.peersChannel.status = 'subscribing';
        let previousPeers = [];
        let currentPeers = [];
        const userName = store.getState().userNameSt;
        this.peersChannel = supabase.channel('peers', {
            config: {
                presence: {
                    key: userName, // identifying the user
                },
            },
        })
        this.peersChannel
            .on('presence', { event: 'join' }, ({ newPresences }) => {
                //console.log(newPresences[0].name, 'joined');
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }) => {
                //console.log(leftPresences[0].name, 'left');
            })
            .on('presence', { event: 'sync' }, () => {
                const newState = this.peersChannel.presenceState();
                const realPeers = this.getRealPeers(newState);
                currentPeers = Object.values(newState).flat();
                console.log('currentPeers: ', currentPeers);
                const previousIds = new Set(previousPeers.map(p => p.name));
                const currentIds = new Set(currentPeers.map(p => p.name));
                const joinedIds = currentPeers.filter(peer => !previousIds.has(peer.name));
                const leftIds = previousPeers.filter(peer => !currentIds.has(peer.name));
                if (joinedIds.length > 0) {
                    //console.log('NEW DEVICES JOINED:', joinedIds);
                }
                if (leftIds.length > 0) {
                    //console.log('DEVICES LEFT:', leftIds);
                }
                if (joinedIds.length === 0 && leftIds.length === 0) {
                    //console.log('Sync fired, but no population change (likely a Status Update)');
                }
                previousPeers = currentPeers;
                store.getState().setPeersSt(realPeers);
                store.getState().setLeaderSt(this.getLeader(realPeers));
                console.log('leader: ', this.getLeader(realPeers));
            })
            .subscribe(async (status) => {
                switch (status) {
                    case 'SUBSCRIBED':
                        this.peersChannel.status = 'subscribed';
                        await this.peersChannel.track({
                            name: store.getState().userNameSt,
                            status: store.getState().isInForegroundSt ? 'foreground' : 'background',
                            date: new Date().toISOString(),
                            wifiName: store.getState().wifiNameSt,
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
                        console.log('peers closed');
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
