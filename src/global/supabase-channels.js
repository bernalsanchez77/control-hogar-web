import supabase from './supabase-client';
class SupabaseChannels {
    supabaseChannels = {};
    async subscribeToSupabaseChannel(tableName, callback) {
      if (!this.supabaseChannels[tableName]) {
        this.supabaseChannels[tableName] = {};
      }
      this.supabaseChannels[tableName].channel = supabase.channel(tableName);
      this.supabaseChannels[tableName].subscribed = true;
      console.log('joining to: ', tableName);
      this.supabaseChannels[tableName].channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        async (change) => {
          console.log(change.table, ' changed');
          if (callback) {
            callback(
              'set' + change.table.charAt(0).toUpperCase() + change.table.slice(1),
              change.new
            );
          }
        }
      );
      this.supabaseChannels[tableName].channel.on('subscription_error', (err) => {
        this.supabaseChannels[tableName].subscribed = false;
        console.warn('Channel ' + tableName + ' subscription error:', err);
      });

      // Wrap subscription in a Promise
      return new Promise((resolve, reject) => {
        this.supabaseChannels[tableName].channel.subscribe(async (status) => {
          if (this.supabaseChannels[tableName].subscribed) {
            if (status === 'SUBSCRIBED') {
              console.log('Subscribed to', tableName);
              resolve(true);
            } else {
              console.warn('Error status for', tableName, ':', status);
              // window.location.reload();
              await this.supabaseChannels[tableName].channel.unsubscribe();
              // try {
              //   const retry = await this.subscribeToSupabaseChannel(tableName, callback);
              //   resolve(retry);
              // } catch (err) {
              //   reject(err);
              // }
            }
          } else {
            console.log('Unsubscribed from: ', tableName + ' ' + status);
            this.supabaseChannels[tableName].channel = null;
            reject(new Error(`Unsubscribed from ${tableName}`));
          }
        });
      });
    }

    getChannelState(tableName) {
      if (this.supabaseChannels[tableName]) {
        return this.supabaseChannels[tableName];
      } else {
        return 'no channel for: ' + tableName;
      }
    };

    async unsubscribeFromSupabaseChannel(tableName) {
      if (this.supabaseChannels[tableName] && this.supabaseChannels[tableName].channel) {
        this.supabaseChannels[tableName].subscribed = false;
        await this.supabaseChannels[tableName].channel.unsubscribe();
      }
    }
}
const supabaseChannelsInstance = new SupabaseChannels();
export default supabaseChannelsInstance;
