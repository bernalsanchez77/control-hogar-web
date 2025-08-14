import All from './all/all';
import Youtube from './youtube/youtube';
import './apps.css';

function Apps({view, rokuApps, youtubeSearchVideos, youtubeChannelsLiz, youtubeVideosLiz, changeControlParent, changeViewParent}) {
  const changeControl = (value) => {
    changeControlParent(value);
  }

  const changeView = (view) => {
    changeViewParent(view);
  }

  return (
    <div>
      {view.roku.apps.selected === '' &&
      <All
        view={view}
        rokuApps={rokuApps}
        changeControlParent={changeControl}
        changeViewParent={changeView}>
      </All>
      }
      {view.roku.apps.selected === 'youtube' &&
      <Youtube
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
