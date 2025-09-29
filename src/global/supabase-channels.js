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
      channel.on('postgres_changes', {event: '*', schema: 'public', table: tableName}, async (change) => {
        console.log(change.table, ' changed');
        if (callback) {
          callback('set' + change.table.charAt(0).toUpperCase() + change.table.slice(1), change.new);
        }
      });
      channel.on('subscription_error', async (err) => {
        await this.handleSubscriptionError(tableName, err, 'subscription_error');
      });
      return new Promise((resolve, reject) => {
        channel.subscribe(async (status) => {
          if (this.supabaseChannels[tableName].subscribed) {
            if (status === 'SUBSCRIBED') {
              console.log('Subscribed to: ', tableName);
              resolve(true);
            } else {
              if (status === 'CHANNEL_ERROR') {
                await this.handleSubscriptionError(tableName, status, 'CHANNEL_ERROR');
              }
              if (status === 'TIMED_OUT') {
                await this.handleSubscriptionError(tableName, status, 'TIMED_OUT');
              }
              if (status === 'CLOSED') {
                await this.handleSubscriptionError(tableName, status, 'CLOSED');
              }
              resolve(false);
            }
          }
        });
      });
    }

    async handleSubscriptionError(tableName, err, type) {
      if (this.supabaseChannels[tableName] && !this.supabaseChannels[tableName].errorHandled) {
        this.supabaseChannels[tableName].errorHandled = true;
        console.log('Channel ' + tableName + ' failed type: ' + type + ' error: ', err);
        await this.unsubscribeFromSupabaseChannel(tableName);
        // setTimeout(async () => {
        //   console.log('Rejoining channel: ' + tableName);
        //   await this.subscribeToSupabaseChannel(tableName);
        // }, 2000);
      }
    }

    getChannelState(tableName) {
      if (this.supabaseChannels[tableName]) {
        return this.supabaseChannels[tableName];
      } else {
        return 'no channel for: ' + tableName;
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
