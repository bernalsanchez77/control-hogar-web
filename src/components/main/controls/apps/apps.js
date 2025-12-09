import { store } from "../../../../store/store";
import All from './all/all';
import Youtube from './youtube/youtube';
import './apps.css';

function Apps({ removeSelectedVideoParent }) {
  const viewSt = store(v => v.viewSt);

  const removeSelectedVideo = () => {
    removeSelectedVideoParent();
  };

  return (
    <div>
      {viewSt.roku.apps.selected === '' &&
        <All>
        </All>
      }
      {viewSt.roku.apps.selected === 'youtube' &&
        <Youtube
          removeSelectedVideoParent={removeSelectedVideo}>
        </Youtube>
      }
    </div>
  )
}

export default Apps;
