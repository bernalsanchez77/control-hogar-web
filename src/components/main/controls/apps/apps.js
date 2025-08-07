import All from './all/all';
import Youtube from './youtube/youtube';
import './apps.css';

function Apps({devicesState, view, rokuApps, youtubeSearchVideos, youtubeChannelsLiz, youtubeVideosLiz, changeControlParent, changeViewParent}) {
  const changeControl = (value) => {
    changeControlParent(value);
  }

  const changeView = (view) => {
    changeViewParent(view);
  }

  return (
    <div>
      {view.apps.selected === '' &&
      <All
        devicesState={devicesState}
        view={view}
        rokuApps={rokuApps}
        changeControlParent={changeControl}
        changeViewParent={changeView}>
      </All>
      }
      {view.apps.selected === 'youtube' &&
      <Youtube
        devicesState={devicesState}
        view={view}
        rokuApps={rokuApps}
        youtubeChannelsLiz={youtubeChannelsLiz}
        youtubeVideosLiz={youtubeVideosLiz}
        youtubeSearchVideos={youtubeSearchVideos}
        changeControlParent={changeControl}
        changeViewParent={changeView}>
      </Youtube>
      }
    </div>
  )
}

export default Apps;
