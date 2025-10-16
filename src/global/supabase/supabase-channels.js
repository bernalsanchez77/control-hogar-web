import supabase from './supabase-client';
class SupabaseChannels {
    supabaseChannels = {};
    async subscribeToSupabaseChannel(tableName, callback) {
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
                console.log('Subscribed to:', tableName);
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
      await this.unsubscribeFromSupabaseChannel('screens');
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
