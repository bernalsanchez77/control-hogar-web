import supabase from './supabase-client';
import utils from '../utils';
import connection from '../connection';
import { store } from '../../store/store';
let handlingNoInternet = false;

class SupabaseChannels {
  supabaseChannels = {};
  hdmiSalaCallback = null;
  rokuAppsCallback = null;
  devicesCallback = null;
  screensCallback = null;
  youtubeVideosLizCallback = null;

  usersChannel = supabase.channel('room_global', {
    config: {
      presence: {
        key: this.userNameSt, // identifying the user
      },
    },
  })

  getLeader(peers) {
    const leader = peers.find(peer => peer.wifiName === 'Noky');
    return leader ? leader.name : '';
  }

  subscribeToUsersChannel(userNameSt, wifiNameSt) {
    let previousPeers = [];
    let currentPeers = [];
    this.usersChannel
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        //console.log(newPresences[0].name, 'joined');
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        //console.log(leftPresences[0].name, 'left');
      })
      .on('presence', { event: 'sync' }, () => {
        const newState = this.usersChannel.presenceState();
        currentPeers = Object.values(newState).flat();
        const joinedIds = currentPeers.filter(id => !previousPeers.includes(id));
        const leftIds = previousPeers.filter(id => !currentPeers.includes(id));
        if (joinedIds.length > 0) {
          console.log('NEW DEVICES JOINED:', joinedIds);
        }
        if (leftIds.length > 0) {
          console.log('DEVICES LEFT:', leftIds);
        }

        if (joinedIds.length === 0 && leftIds.length === 0) {
          console.log('Sync fired, but no population change (likely a Status Update)');
        }
        console.log(currentPeers);
        previousPeers = currentPeers;
        store.getState().setPeersSt(currentPeers);
        store.getState().setLeaderSt(this.getLeader(currentPeers));
        console.log('leader: ', this.getLeader(currentPeers));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.usersChannel.track({
            name: userNameSt,
            status: 'foreground',
            date: new Date().toISOString(),
            wifiName: wifiNameSt,
          });
        }
      });
  }

  async subscribeToSupabaseChannel(tableName, callback, first) {
    if (handlingNoInternet) {
      handlingNoInternet = false;
    }
    if (!this.rokuAppsCallback && tableName === 'rokuApps') this.rokuAppsCallback = callback;
    if (!this.devicesCallback && tableName === 'devices') this.devicesCallback = callback;
    if (!this.screensCallback && tableName === 'screens') this.screensCallback = callback;
    if (!this.youtubeVideosLizCallback && tableName === 'youtubeVideosLiz') this.youtubeVideosLizCallback = callback;
    if (!this.hdmiSalaCallback && tableName === 'hdmiSala') this.hdmiSalaCallback = callback;
    if (!this.supabaseChannels[tableName]) {
      this.supabaseChannels[tableName] = {};
    }

    const channel = supabase.channel(tableName);
    this.supabaseChannels[tableName].channel = channel;
    this.supabaseChannels[tableName].subscribed = true;
    this.supabaseChannels[tableName].errorHandled = false;
    this.supabaseChannels[tableName].errorType = '';

    channel.on('postgres_changes', { event: '*', schema: 'public', table: tableName }, async (change) => {
      console.log(change.table, 'changed');
      if (callback) {
        callback('set' + change.table.charAt(0).toUpperCase() + change.table.slice(1) + 'St', change.new);
      }
    });

    return new Promise((resolve, reject) => {
      channel.subscribe(async (status) => {
        if (this.supabaseChannels[tableName].subscribed) {
          // const now = new Date();
          // const hours = String(now.getHours()).padStart(2, '0');
          // const minutes = String(now.getMinutes()).padStart(2, '0');
          // const seconds = String(now.getSeconds()).padStart(2, '0');
          if (status !== 'SUBSCRIBED') {
            // console.log('Subscription error on', tableName, 'status: ', status, 'at time:', `${hours}:${minutes}:${seconds}`);
          }
          switch (status) {
            case 'SUBSCRIBED':
              if (first) {
                console.log('Subscribed to:', tableName);
              }
              resolve({ success: true, msg: status });
              break;
            case 'CHANNEL_ERROR':
              await this.handleSubscriptionError(tableName, status, callback);
              resolve({ success: false, msg: status });
              break;
            case 'TIMED_OUT':
              await this.handleSubscriptionError(tableName, status, callback);
              resolve({ success: false, msg: status });
              break;
            case 'CLOSED':
              await this.handleSubscriptionError(tableName, status, callback);
              resolve({ success: false, msg: status });
              break;
            default:
              console.warn('Subscription error for other reason');
              reject({ success: false, msg: status });
          }
        }
      });
    });
  }

  async handleSubscriptionError(tableName, type, callback) {
    if (this.supabaseChannels[tableName] && !this.supabaseChannels[tableName].errorHandled) {
      this.supabaseChannels[tableName].errorType = type;
      this.supabaseChannels[tableName].errorHandled = true;
      console.warn('Channel ' + tableName + ' failed type: ' + type);
      await this.unsubscribeFromSupabaseChannel(tableName);
      setTimeout(async () => {
        const isConnectedToInternet = await utils.getIsConnectedToInternet();
        if (isConnectedToInternet) {
          await this.subscribeToSupabaseChannel(tableName, callback).then((res) => {
            if (res.success) {
              console.log('Re-subscribed to:', tableName);
            } else {
              console.warn('not re-subscribed, subscription status:', res.msg);
              switch (res.msg) {
                case 'TIMED_OUT':
                  break;
                case 'CHANNEL_ERROR':
                  break;
                case 'CLOSED':
                  break;
                default:
              }
            }
          }).catch((res) => {
            console.error('Error re-subscribing to ' + tableName + ': ', res);
          });
        } else {
          if (!handlingNoInternet) {
            handlingNoInternet = true;
            connection.onNoInternet();
            supabase.realtime.disconnect();
            console.log('No internet, will not re-subscribe to tables');
          }
        }
      }, 2000); // wait 2 seconds before re-subscribing
    }
  }

  getSupabaseChannelState(tableName) {
    if (this.supabaseChannels[tableName]) {
      return this.supabaseChannels[tableName];
    } else {
      // console.warn('no channel for: ' + tableName);
      return null;
    }
  }

  async unsubscribeFromAllSupabaseChannels() {
    await this.unsubscribeFromSupabaseChannel('hdmiSala');
    await this.unsubscribeFromSupabaseChannel('rokuApps');
    await this.unsubscribeFromSupabaseChannel('devices');
    await this.unsubscribeFromSupabaseChannel('screens');
    await this.unsubscribeFromSupabaseChannel('youtubeVideosLiz');
  }

  async subscribeToAllSupabaseChannels() {
    const tableNames = ['hdmiSala', 'rokuApps', 'devices', 'screens', 'youtubeVideosLiz'];
    for (const tableName of tableNames) {
      await this.subscribeToSupabaseChannel(tableName, this[tableName + 'Callback'], true).then((res) => {
        if (res.success) {
          console.log('Re-subscribed to:', tableName, ' after internet restored');
        } else {
          console.warn('not re-subscribed, subscription status:', res.msg);
          switch (res.msg) {
            case 'TIMED_OUT':
              break;
            case 'CHANNEL_ERROR':
              break;
            case 'CLOSED':
              break;
            default:
          }
        }
      }).catch((res) => {
        console.error('Error re-subscribing to ' + tableName + ' after internet restored: ', res);
      });
    }
  }

  async unsubscribeFromSupabaseChannel(tableName) {
    if (this.supabaseChannels[tableName] && this.supabaseChannels[tableName].channel) {
      this.supabaseChannels[tableName].subscribed = false;
      await this.supabaseChannels[tableName].channel.unsubscribe();
      console.log('Unsubscribed from: ', tableName);
    }
  }
}
const supabaseChannelsInstance = new SupabaseChannels();
export default supabaseChannelsInstance;
