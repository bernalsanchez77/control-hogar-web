
import supabaseChannels from './supabase-channels';
import Requests from './requests';
const requests = new Requests();
class ViewRouter {
  subscribeToSupabaseChannel(tableName, setters) {
    supabaseChannels.subscribeToSupabaseChannel(tableName, (itemName, newItem) => {
      setters[itemName](items => items.map(item => item.id === newItem.id ? newItem : item));
    });
  };
  async changeView(newView, currentView, youtubeChannelsLiz, setters, rokuApps) {
    if (newView.selected === 'cable') {
      // cable selected
      if (currentView.selected === 'cable') {
        // was in cable
        if (newView.cable.channels.category.length) {
          // category selected
          const cableCategory = newView.cable.channels.category[0];
          window.history.pushState({page: cableCategory}, cableCategory, '#' + cableCategory);
        } else {
        }
      }
      if (currentView.selected === 'roku') {
        // was in roku
        const channelsTable = await requests.getTableFromSupabase('cableChannels');
        setters.setCableChannels(channelsTable.data);
        setters.setRokuSearchMode('default');
        this.subscribeToSupabaseChannel('cableChannels', setters);
        if (currentView.roku.apps.selected) {
          // was in an app
          if (currentView.roku.apps.selected === 'youtube') {
            // app was Youtube
            if (currentView.roku.apps.youtube.channel) {
             supabaseChannels.unsubscribeFromSupabaseChannel('youtubeVideosLiz');     
            } else {
              setters.setRokuSearchMode('roku');
            }
          } 
        } else {
          // was in home
          supabaseChannels.unsubscribeFromSupabaseChannel('rokuApps');             
        }
      }
      if (currentView.selected === '') {

      }
    }

    if (newView.selected === 'roku') {
      // roku selected
      if (currentView.selected === 'roku') {
        // was in roku
        if (newView.roku.apps.selected) {
          // app is selected
          if (currentView.roku.apps.selected) {
            // was in an app
            if (newView.roku.apps.selected === 'youtube') {
              // app is Youtube
              if (newView.roku.apps.youtube.mode) {
                // youtube is in a mode
                if (newView.roku.apps.youtube.mode === 'channel') {
                  // youtube is in channel mode
                  const youtubeChannel = newView.roku.apps.youtube.channel;
                  window.history.pushState({page: youtubeChannel}, youtubeChannel, '#' + youtubeChannel);
                  const videos = await requests.getTableFromSupabase('youtubeVideosLiz');
                  setters.setYoutubeVideosLiz(videos.data);
                  this.subscribeToSupabaseChannel('youtubeVideosLiz', setters);
                  setters.setRokuSearchMode('default');
                }
                if (newView.roku.apps.youtube.mode === 'search') {
                  // youtube is in search mode
                  supabaseChannels.unsubscribeFromSupabaseChannel('youtubeVideosLiz');
                  window.history.pushState({page: 'search'}, 'search', '#search');
                }
              } else {
                // youtube is in home mode
                setters.setRokuSearchMode('app');
              }
            }
          } else {
            // was in home
            const app = newView.roku.apps.selected;
            window.history.pushState({page: app}, app, '#' + app);
            supabaseChannels.unsubscribeFromSupabaseChannel('rokuApps');
            if (app === 'youtube') {
              // app is Youtube
              if (!youtubeChannelsLiz?.length) {
                const channels = await requests.getTableFromSupabase('youtubeChannelsLiz');
                setters.setYoutubeChannelsLiz(channels.data);
              }
              setters.setRokuSearchMode('app');
            }
          }
        } else {
          // no app selected
          if (currentView.roku.apps.selected) {
            // was in an app
            const apps = await requests.getTableFromSupabase('rokuApps');
            setters.setRokuApps(apps.data);
            this.subscribeToSupabaseChannel('rokuApps', setters);
            if (rokuApps.find(app => app.state === 'selected')?.id !== 'home') {
              setters.setRokuSearchMode('roku');
            } else {
              setters.setRokuSearchMode('default');
            }
          }
        }
      }
      if (currentView.selected === 'cable') {
        //was in cable
        supabaseChannels.unsubscribeFromSupabaseChannel('cableChannels');
        const apps = await requests.getTableFromSupabase('rokuApps');
        setters.setRokuApps(apps.data);
        this.subscribeToSupabaseChannel('rokuApps', setters);
        if (apps.data.find(app => app.state === 'selected')?.id !== 'home') {
          setters.setRokuSearchMode('roku');
        }
      }
      if (currentView.selected === '') {
        if (rokuApps.find(app => app.state === 'selected')?.id !== 'home') {
          setters.setRokuSearchMode('roku');
        }
      }
    }

    if (newView.selected === 'cable' || newView.selected === 'roku' ) {
      if (newView.devices.device) {
        window.history.pushState({page: 'devices'}, 'devices', '#devices');
      }
    }
    return newView;
  };
}
export default ViewRouter;
