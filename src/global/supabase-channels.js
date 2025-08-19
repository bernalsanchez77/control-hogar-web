import supabase from './supabase-client';
class SupabaseChannels {
    supabaseChannels = {};
    subscribeToSupabaseChannel(tableName, callback) {
      // const select = tableName !== 'devices' && tableName !== 'screens';
      const channel = this.getSupabaseChannel(tableName);
      if (channel?.socket.state !== 'joined') {
        channel.on(
          'postgres_changes',
          {event: '*', schema: 'public', table: tableName},
          async (change) => {
            console.log(change.table, ' changed');
            if (callback) {
              callback('set' + change.table.charAt(0).toUpperCase() + change.table.slice(1), change.new);
            }
          }
        ).subscribe(status => {
          console.log(tableName, ' status is: ', status);
          if (status === 'SUBSCRIBED') {
            console.log('Subscribed to ', tableName);
          }
        });
      }
    }
    getSupabaseChannel(name) {
      if (!this.supabaseChannels[name]) {
        console.log(`Creating channel: ${name}`);
        this.supabaseChannels[name] = supabase.channel(name);
      }
      return this.supabaseChannels[name];
    }
    unsubscribeFromSupabaseChannel(tableName) {
      if (this.supabaseChannels[tableName]) {
        console.log(`Removing channel: ${tableName}`);
        this.supabaseChannels[tableName].unsubscribe();
        delete this.supabaseChannels[tableName];
      }
    }
}
export default SupabaseChannels;
