
import SupabaseChannels from './supabase-channels';
import Requests from './requests';
const supabaseChannels = new SupabaseChannels();
const requests = new Requests();
class ViewRouter {
  async changeView(params, viewRef, youtubeChannelsLiz, setView, setCableChannels, setRokuApps, setYoutubeVideosLiz, setYoutubeChannelsLiz) {
    const newView = structuredClone(params);

    if (newView.selected === 'cable') {
      // cable selected
      if (viewRef.current.selected === 'cable') {
        // was in cable
        if (newView.cable.channels.category.length) {
          // category selected   
        } else {
        }
      }
      if (viewRef.current.selected === 'roku') {
        // was in roku
        const channels = await requests.getTableFromSupabase('cableChannels');
        setCableChannels(channels.data);
        supabaseChannels.subscribeToSupabaseChannel('cableChannels');
        if (viewRef.current.roku.apps.selected) {
          // was in an app 
          if (viewRef.current.roku.apps.selected === 'youtube') {
            // app was Youtube
            if (viewRef.current.roku.apps.youtube.channel) {
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
      if (viewRef.current.selected === 'roku') {
        // was in roku
        if (newView.roku.apps.selected) {
          // app is selected
          if (viewRef.current.roku.apps.selected) {
            // was in an app
            if (newView.roku.apps.selected === 'youtube') {
              // app is Youtube
              if (newView.roku.apps.youtube.channel) {
                // youtube channel selected
                const videos = await requests.getTableFromSupabase('youtubeVideosLiz');
                setYoutubeVideosLiz(videos.data);
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
                setYoutubeChannelsLiz(channels.data);
              }
            }
          }
        } else {
          // no app selected
          if (viewRef.current.roku.apps.selected) {
            // was in an app
            const apps = await requests.getTableFromSupabase('rokuApps');
            setRokuApps(apps.data);
            supabaseChannels.subscribeToSupabaseChannel('rokuApps');
          }
        }
      }
      if (viewRef.current.selected === 'cable') {
        //was in cable
        supabaseChannels.unsubscribeFromSupabaseChannel('cableChannels');
        const apps = await requests.getTableFromSupabase('rokuApps');
        setRokuApps(apps.data);
        supabaseChannels.subscribeToSupabaseChannel('rokuApps');
      }
    }
    setView(newView);
  };
}
export default ViewRouter;
