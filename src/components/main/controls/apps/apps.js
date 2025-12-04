import { store } from "../../../../store/store";
import All from './all/all';
import Youtube from './youtube/youtube';
import './apps.css';

function Apps({ changeControlParent, handleYoutubeQueueParent, removeSelectedVideoParent }) {
  const viewSt = store(v => v.viewSt);
  const changeControl = (value) => {
    changeControlParent(value);
  };

  const handleYoutubeQueue = (params) => {
    handleYoutubeQueueParent(params);
  };

  const removeSelectedVideo = () => {
    removeSelectedVideoParent();
  };

  return (
    <div>
      {viewSt.roku.apps.selected === '' &&
        <All
          changeControlParent={changeControl}>
        </All>
      }
      {viewSt.roku.apps.selected === 'youtube' &&
        <Youtube
          changeControlParent={changeControl}
          handleQueueParent={handleYoutubeQueue}
          removeSelectedVideoParent={removeSelectedVideo}>
        </Youtube>
      }
    </div>
  )
}

export default Apps;
