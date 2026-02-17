
import supabaseChannels from './supabase/supabase-channels';
import requests from './requests';
import { store } from '../store/store';

class ViewRouter {
  async subscribeToSupabaseChannel(tableName, setters, onNoInternet) {
    await supabaseChannels.subscribeToSupabaseChannel(tableName, (itemName, newItem) => {
      setters[itemName](items => items.map(item => item.id === newItem.id ? newItem : item));
    }, onNoInternet, true).then((res) => {
      if (res.success) {
        return 'subscribed';
      } else {
        return res.error;
      }
    }).catch((res) => {
      return res.error;
    });
  }
  async changeView(newView) {
    const currentView = store.getState().viewSt;
    if (newView.selected === 'cable') {
      // cable selected
      if (currentView.selected === 'cable') {
        // was in cable
        if (newView.cable.channels.category.length) {
          // category selected
          const cableCategory = newView.cable.channels.category[0];
          window.history.pushState({ page: cableCategory }, cableCategory, '#' + cableCategory);
        } else {
        }
      }
      if (currentView.selected === 'roku') {
        // was in roku
        const channelsTable = await requests.getTable('cableChannels');
        if (channelsTable) {
          store.getState().setRokuSearchModeSt('default');
          // const subscriptionResponse = await this.subscribeToSupabaseChannel('cableChannels', onNoInternet);
          if (currentView.roku.apps.selected) {
            // was in an app
            if (currentView.roku.apps.selected === 'youtube') {
              // app was Youtube
              if (currentView.roku.apps.youtube.channel) {
                // supabaseChannels.unsubscribeFromSupabaseChannel('youtubeVideosLiz');     
              } else {
                store.getState().setRokuSearchModeSt('roku');
              }
            }
          } else {
            // was in home
            // supabaseChannels.unsubscribeFromSupabaseChannel('rokuApps');             
          }
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
                  if (currentView.roku.apps.youtube.mode === '') {
                    // was in no mode (youtube home)
                    const youtubeChannel = newView.roku.apps.youtube.channel;
                    window.history.pushState({ page: youtubeChannel }, youtubeChannel, '#' + youtubeChannel);
                    const videos = await requests.getTable('youtubeVideosLiz');
                    if (videos) {
                      store.getState().setYoutubeVideosLizSt(videos.data);
                      // const subscriptionResponse = await this.subscribeToSupabaseChannel('youtubeVideosLiz', onNoInternet);
                      store.getState().setRokuSearchModeSt('default');
                    }
                  }
                }
                if (newView.roku.apps.youtube.mode === 'search') {
                  // youtube is in search mode
                  if (currentView.roku.apps.youtube.mode === '') {
                    // was in no mode (youtube home)
                    window.history.pushState({ page: 'search' }, 'search', '#search');
                  }
                }
                if (newView.roku.apps.youtube.mode === 'edit') {
                  // youtube is in edit mode
                  window.history.pushState({ page: 'edit' }, 'edit', '#edit');
                }
                if (newView.roku.apps.youtube.mode === 'queue') {
                  // youtube is in queue mode
                  window.history.pushState({ page: 'queue' }, 'queue', '#queue');
                }
              } else {
                // youtube is in home mode
                store.getState().setRokuSearchModeSt('app');
                if (currentView.roku.apps.youtube.mode === 'channel') {
                  // supabaseChannels.unsubscribeFromSupabaseChannel('youtubeVideosLiz');
                }
              }
            }
          } else {
            // was in home
            const app = newView.roku.apps.selected;
            window.history.pushState({ page: app }, app, '#' + app);
            // supabaseChannels.unsubscribeFromSupabaseChannel('rokuApps');
            if (app === 'youtube') {
              // app is Youtube
              // if (!youtubeChannelsLiz?.length) {
              //   const channels = await requests.getTable('youtubeChannelsLiz');
              //   if (channels) {
              //     setters.setYoutubeChannelsLiz(channels.data);
              //   }
              // }
              store.getState().setRokuSearchModeSt('app');
            }
          }
        } else {
          // no app selected
          if (currentView.roku.apps.selected) {
            // was in an app
            const apps = await requests.getTable('rokuApps');
            if (apps) {
              store.getState().setRokuAppsSt(apps.data);
              // const subscriptionResponse = await this.subscribeToSupabaseChannel('rokuApps', onNoInternet);
              // if (rokuApps.find(app => app.state === 'selected')?.id !== 'home') {
              store.getState().setRokuSearchModeSt('roku');
              // } else {
              // store.getState().setRokuSearchModeSt('default');
              // }
            }
          }
        }
      }
      if (currentView.selected === 'cable') {
        //was in cable
        // supabaseChannels.unsubscribeFromSupabaseChannel('cableChannels');
        const apps = await requests.getTable('rokuApps');
        if (apps) {
          store.getState().setRokuAppsSt(apps.data);
          // const subscriptionResponse = await this.subscribeToSupabaseChannel('rokuApps', onNoInternet);
          // if (apps.data.find(app => app.state === 'selected')?.id !== 'home') {
          store.getState().setRokuSearchModeSt('roku');
          // }
        }
      }
      if (currentView.selected === '') {
        // if (rokuApps.find(app => app.state === 'selected')?.id !== 'home') {
        store.getState().setRokuSearchModeSt('roku');
        // }
      }
    }

    if (newView.selected === 'cable' || newView.selected === 'roku') {
      if (newView.devices.device) {
        window.history.pushState({ page: 'devices' }, 'devices', '#devices');
      }
    }
    store.getState().setViewSt(newView);
  }
  async onNavigationBack() {
    const currentView = store.getState().viewSt;
    const newView = structuredClone(currentView);
    if (currentView.selected === 'roku') {
      if (currentView.roku.apps.selected) {
        if (currentView.roku.apps.youtube.mode === 'channel' || currentView.roku.apps.youtube.mode === 'search') {
          newView.roku.apps.youtube.mode = '';
          if (currentView.roku.apps.youtube.channel !== '') {
            newView.roku.apps.youtube.channel = '';
          }
          await this.changeView(newView, currentView);
          return
        } else if (currentView.roku.apps.youtube.mode === 'edit') {
          if (currentView.roku.apps.youtube.channel === '') {
            newView.roku.apps.youtube.mode = 'search';
          } else {
            newView.roku.apps.youtube.mode = 'channel';
          }
          await this.changeView(newView, currentView);
          return;
        } else if (currentView.roku.apps.youtube.mode === 'queue') {
          newView.roku.apps.youtube.mode = '';
          await this.changeView(newView, currentView);
          return;
        } else {
          newView.roku.apps.selected = '';
          await this.changeView(newView, currentView);
          return;
        }
      }
    }
    if (currentView.selected === 'cable') {
      if (currentView.cable.channels.category.length) {
        newView.cable.channels.category = [];
        await this.changeView(newView, currentView);
        return;
      }
    }
    if (currentView.devices.device) {
      newView.devices.device = '';
      await this.changeView(newView, currentView);
      return;
    }
    window.navigator.app.exitApp();
  }
  async onHdmiSalaTableChange(id) {
    const newView = structuredClone(store.getState().viewSt);
    newView.selected = id;
    if (newView.selected === 'roku') {
      newView.cable.channels.category = [];
    }
    if (newView.selected === 'cable') {
      newView.roku.apps.selected = '';
      newView.roku.apps.youtube.mode = '';
      newView.roku.apps.youtube.channel = '';
    }
    await this.changeView(newView, store.getState().viewSt);
  }
  async applyViewUpdate(updateFn) {
    const currentView = store.getState().viewSt;
    const newView = structuredClone(currentView);
    updateFn(newView);
    await this.changeView(newView);
  }

  async _setYoutubeMode(newView, mode, channel = '') {
    newView.selected = 'roku';
    newView.roku.apps.selected = 'youtube';
    newView.roku.apps.youtube.mode = mode;
    newView.roku.apps.youtube.channel = channel;
  }

  async navigateToYoutubeSearch() {
    await this.applyViewUpdate((view) => {
      this._setYoutubeMode(view, 'search');
      view.devices.device = '';
    });
  }

  async navigateToYoutubeChannel(channelId) {
    await this.applyViewUpdate((view) => {
      this._setYoutubeMode(view, 'channel', channelId);
    });
  }

  async navigateToYoutubeQueue() {
    await this.applyViewUpdate((view) => {
      this._setYoutubeMode(view, 'queue');
    });
  }

  async navigateToRokuApp(appId) {
    await this.applyViewUpdate((view) => {
      view.selected = 'roku';
      view.roku.apps.selected = appId;
    });
  }

  async navigateToCableCategory(category) {
    await this.applyViewUpdate((view) => {
      view.cable.channels.category = category;
    });
  }

  async navigateToYoutubeEdit() {
    await this.applyViewUpdate((view) => {
      this._setYoutubeMode(view, 'edit');
    });
  }

  async navigateToDevice(deviceId) {
    await this.applyViewUpdate((view) => {
      view.devices.device = deviceId;
    });
  }
}
const viewRouter = new ViewRouter();
export default viewRouter;
