import All from './all/all';
import Youtube from './youtube/youtube';
import './apps.css';

function Apps({rokuPlayStatePosition, rokuPlayState, view, rokuApps, rokuSearchMode, youtubeSearchVideos, youtubeChannelsLiz, youtubeVideosLiz, changeControlParent, changeRokuSearchModeParent, changeViewParent, addToYoutubeQueueParent}) {
  const changeControl = (value) => {
    changeControlParent(value);
  }

  const changeView = (view) => {
    changeViewParent(view);
  }

  const addToYoutubeQueue = (videoId, number) => {
    addToYoutubeQueueParent(videoId, number);
  }

  const changeRokuSearchMode = (mode) => {
    changeRokuSearchModeParent(mode);
  }

  return (
    <div>
      {view.roku.apps.selected === '' &&
      <All
        view={view}
        rokuApps={rokuApps}
        rokuSearchMode={rokuSearchMode}
        changeControlParent={changeControl}
        changeRokuSearchModeParent={changeRokuSearchMode}
        changeViewParent={changeView}>
      </All>
      }
      {view.roku.apps.selected === 'youtube' &&
      <Youtube
        rokuPlayState={rokuPlayState}
        rokuPlayStatePosition={rokuPlayStatePosition}
        view={view}
        rokuApps={rokuApps}
        youtubeChannelsLiz={youtubeChannelsLiz}
        youtubeVideosLiz={youtubeVideosLiz}
        youtubeSearchVideos={youtubeSearchVideos}
        changeControlParent={changeControl}
        addToQueueParent={addToYoutubeQueue}
        changeViewParent={changeView}>
      </Youtube>
      }
    </div>
  )
}

export default Apps;
