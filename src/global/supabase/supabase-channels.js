import supabase from './supabase-client';
import Utils from '../utils';
const utils = new Utils();

class SupabaseChannels {
    supabaseChannels = {};
    hdmiSalaCallback = null;
    rokuAppsCallback = null;
    devicesCallback = null;
    screensCallback = null;
    youtubeVideosLizCallback = null;
    setInternetFn = null;

    async subscribeToSupabaseChannel(tableName, callback, setInternet, first) {
      if (!this.rokuAppsCallback && tableName === 'rokuApps') this.rokuAppsCallback = callback;
      if (!this.devicesCallback && tableName === 'devices') this.devicesCallback = callback;
      if (!this.screensCallback && tableName === 'screens') this.screensCallback = callback;
      if (!this.youtubeVideosLizCallback && tableName === 'youtubeVideosLiz') this.youtubeVideosLizCallback = callback;
      if (!this.hdmiSalaCallback && tableName === 'hdmiSala') this.hdmiSalaCallback = callback;
      if (!this.setInternetFn) this.setInternetFn = setInternet;
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
          callback('set' + change.table.charAt(0).toUpperCase() + change.table.slice(1), change.new);
        }
      });

      return new Promise((resolve, reject) => {
        channel.subscribe(async (status) => {
          if (this.supabaseChannels[tableName].subscribed) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            if (status !== 'SUBSCRIBED') {
              console.log('Subscription error on', tableName, 'status: ', status, 'at time:', `${hours}:${minutes}:${seconds}`);
            }
            switch (status) {
              case 'SUBSCRIBED':
                if (first) {
                  console.log('Subscribed to:', tableName);
                }
                resolve({success: true, msg: status});
                break;
              case 'CHANNEL_ERROR':
                await this.handleSubscriptionError(tableName, status);
                resolve({success: false, msg: status});
                break;
              case 'TIMED_OUT':
                await this.handleSubscriptionError(tableName, status);
                resolve({success: false, msg: status});
                break;
              case 'CLOSED':
                await this.handleSubscriptionError(tableName, status);
                resolve({success: false, msg: status});
                break;
              default:
                console.warn('Subscription error for other reason');
                reject({success: false, msg: status});
            }
          }
        });
      });
    }

    async handleSubscriptionError(tableName, type) {
      if (this.supabaseChannels[tableName] && !this.supabaseChannels[tableName].errorHandled) {
        this.supabaseChannels[tableName].errorType = type;
        this.supabaseChannels[tableName].errorHandled = true;
        console.warn('Channel ' + tableName + ' failed type: ' + type);
        await this.unsubscribeFromSupabaseChannel(tableName);
        setTimeout(async () => {
          const internetConnection = await utils.checkInternet();
          if (internetConnection) {
            await this.subscribeToSupabaseChannel(tableName, this[tableName + 'Callback'], this.setInternet).then((res) => {
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
            console.log('No internet, will not re-subscribe to ' + tableName);
            this.setInternetFn(false);
          }
        }, 5000); // wait 5 seconds before re-subscribing
      }
    }

    getSupabaseChannelState(tableName) {
      if (this.supabaseChannels[tableName]) {
        return this.supabaseChannels[tableName];
      } else {
        console.warn('no channel for: ' + tableName);
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
        await this.subscribeToSupabaseChannel(tableName, this[tableName + 'Callback'], this.setInternet, true).then((res) => {
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
