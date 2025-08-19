
import SupabaseChannels from './supabase-channels';
import Requests from './requests';
const supabaseChannels = new SupabaseChannels();
const requests = new Requests();
class ViewRouter {
  async changeView(params, currentView, youtubeChannelsLiz, setters) {
    const newView = structuredClone(params);

    if (newView.selected === 'cable') {
      // cable selected
      if (currentView.selected === 'cable') {
        // was in cable
        if (newView.cable.channels.category.length) {
          // category selected   
        } else {
        }
      }
      if (currentView.selected === 'roku') {
        // was in roku
        const channels = await requests.getTableFromSupabase('cableChannels');
        setters.setCableChannels(channels.data);
        supabaseChannels.subscribeToSupabaseChannel('cableChannels');
        if (currentView.roku.apps.selected) {
          // was in an app 
          if (currentView.roku.apps.selected === 'youtube') {
            // app was Youtube
            if (currentView.roku.apps.youtube.channel) {
             supabaseChannels.unsubscribeFromSupabaseChannel('youtubeVideosLiz');     
            }
          } 
        } else {
          // was in home
          supabaseChannels.unsubscribeFromSupabaseChannel('rokuApps');             
        }
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
              if (newView.roku.apps.youtube.channel) {
                // youtube channel selected
                const videos = await requests.getTableFromSupabase('youtubeVideosLiz');
                setters.setYoutubeVideosLiz(videos.data);
                supabaseChannels.subscribeToSupabaseChannel('youtubeVideosLiz');
              } else {
                // youtube channel is not selected
                supabaseChannels.unsubscribeFromSupabaseChannel('youtubeVideosLiz');
              }
            }
          } else {
            // was in home
            supabaseChannels.unsubscribeFromSupabaseChannel('rokuApps');
            if (newView.roku.apps.selected === 'youtube') {
              // app is Youtube
              if (!youtubeChannelsLiz.length) {
                const channels = await requests.getTableFromSupabase('youtubeChannelsLiz');
                setters.setYoutubeChannelsLiz(channels.data);
              }
            }
          }
        } else {
          // no app selected
          if (currentView.roku.apps.selected) {
            // was in an app
            const apps = await requests.getTableFromSupabase('rokuApps');
            setters.setRokuApps(apps.data);
            supabaseChannels.subscribeToSupabaseChannel('rokuApps');
          }
        }
      }
      if (currentView.selected === 'cable') {
        //was in cable
        supabaseChannels.unsubscribeFromSupabaseChannel('cableChannels');
        const apps = await requests.getTableFromSupabase('rokuApps');
        setters.setRokuApps(apps.data);
        supabaseChannels.subscribeToSupabaseChannel('rokuApps');
      }
    }
    return newView;
  };
}
export default ViewRouter;
