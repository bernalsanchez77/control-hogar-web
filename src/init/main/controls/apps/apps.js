import { store } from "../../../../store/store";
import All from './all/all';
import Youtube from './youtube/youtube';
import './apps.css';

function Apps() {
  const viewSt = store(v => v.viewSt);

  return (
    <div>
      {viewSt.roku.apps.selected === '' &&
        <All></All>
      }
      {viewSt.roku.apps.selected === 'youtube' &&
        <Youtube></Youtube>
      }
    </div>
  )
}

export default Apps;
