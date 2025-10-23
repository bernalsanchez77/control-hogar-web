import All from './all/all';
import Youtube from './youtube/youtube';
import './apps.css';

function Apps({rokuPlayStatePosition, rokuPlayState, view, rokuApps, rokuSearchMode, youtubeSearchVideos, youtubeChannelsLiz, youtubeVideosLiz, changeControlParent, changeRokuSearchModeParent, changeViewParent, handleYoutubeQueueParent, stopPlayStateListenerParent}) {
  const changeControl = (value) => {
    changeControlParent(value);
  }

  const changeView = (view) => {
    changeViewParent(view);
  }

  const handleYoutubeQueue = (params) => {
    handleYoutubeQueueParent(params);
  }

  const changeRokuSearchMode = (mode) => {
    changeRokuSearchModeParent(mode);
  }

  const stopPlayStateListener = () => {
    stopPlayStateListenerParent();
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
        handleQueueParent={handleYoutubeQueue}
        stopPlayStateListenerParent={stopPlayStateListener}
        changeViewParent={changeView}>
      </Youtube>
      }
    </div>
  )
}

export default Apps;
