import supabase from './supabase-client';
class SupabaseChannels {
    supabaseChannels = {};
    async subscribeToSupabaseChannel(tableName, callback, timeoutMs = 200) {
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

      channel.on('subscription_error', async (err) => {
        console.log('error en la subcription');
        await this.handleSubscriptionError(tableName, err, 'subscription_error');
      });

      return new Promise((resolve, reject) => {
        // let settled = false;

        // timeout handling
        // const timer = setTimeout(async () => {
        //   if (!settled) {
        //     settled = true;
        //     await this.handleSubscriptionError(tableName, 'Timeout', 'TIMEOUT');
        //     resolve({response: false, error: 'timeout'});
        //   }
        // }, timeoutMs);

        channel.subscribe(async (status) => {
          // if (settled) return; // ignore late events

          if (this.supabaseChannels[tableName].subscribed) {
            if (status === 'SUBSCRIBED') {
              // clearTimeout(timer);
              // settled = true;
              console.log('✅ Subscribed to:', tableName);
              resolve({response: true, error: ''});
            } else if (['CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(status)) {
              const now = new Date();
              const hours = String(now.getHours()).padStart(2, '0');
              const minutes = String(now.getMinutes()).padStart(2, '0');
              const seconds = String(now.getSeconds()).padStart(2, '0');
              console.log('Subscription error on ', tableName, 'status: ', status, 'at time: ', `${hours}:${minutes}:${seconds}`);
              // clearTimeout(timer);
              // settled = true;
              await this.handleSubscriptionError(tableName, status, status);
              resolve({response: false, error: status});
            } else {
              console.log('Subscription error for other reason');
            }
          }
        });
      });
    }

    async handleSubscriptionError(tableName, err, type) {
      if (this.supabaseChannels[tableName] && !this.supabaseChannels[tableName].errorHandled) {
        this.supabaseChannels[tableName].errorType = type;
        this.supabaseChannels[tableName].errorHandled = true;
        console.log('Channel ' + tableName + ' failed type: ' + type + ' error: ', err);
        await this.unsubscribeFromSupabaseChannel(tableName);
        // setTimeout(async () => {
        //   console.log('Rejoining channel: ' + tableName);
        //   await this.subscribeToSupabaseChannel(tableName);
        // }, 5000);
      }
    }

    getChannelState(tableName) {
      if (this.supabaseChannels[tableName]) {
        return this.supabaseChannels[tableName];
      } else {
        console.log('no channel for: ' + tableName);
        return null;
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
