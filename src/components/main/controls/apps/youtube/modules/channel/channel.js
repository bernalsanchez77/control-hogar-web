import { useRef } from 'react';
import { store } from "../../../../../../../store/store";
import utils from '../../../../../../../global/utils';
import youtube from '../../../../../../../global/youtube';
import viewRouter from '../../../../../../../global/view-router';
import { useTouch } from '../../../../../../../hooks/useTouch';
import './channel.css';

function Channel({ setVideoToSave }) {
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
  const leaderSt = store(v => v.peersSt.findLast(p => p.wifiName === 'Noky')?.name || '');
  const selectionsSt = store(v => v.selectionsSt);
  const youtubeVideosLizSelectedId = selectionsSt.find(el => el.table === 'youtubeVideosLiz')?.id;

  const channelSelected = useRef(localStorage.getItem('channelSelected') || '');

  let youtubeSortedVideos = youtubeVideosLizSt.filter(video => video.channelId === channelSelected.current);
  youtubeSortedVideos = Object.values(youtubeSortedVideos).sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleShortPress = (e, type, video) => {
    if (type === 'video') {
      if (leaderSt) {
        utils.triggerVibrate();
        youtube.onVideoShortClick(video);
      }
    }
    if (type === 'edit') {
      utils.triggerVibrate();
      setVideoToSave(video);
      viewRouter.navigateToYoutubeEdit();
    }
  };

  const handleLongPress = (e, type, video) => {
    utils.triggerVibrate();
    youtube.handleQueue(video);
  };

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(handleShortPress, handleLongPress);

  const getQueueConsecutiveNumber = (video) => {
    return youtube.getQueueConsecutiveNumber(video);
  };

  return (
    <div className='controls-apps-youtube controls-apps-youtube--channel'>
      <ul className='controls-apps-youtube-ul'>
        {
          youtubeSortedVideos.map((video, key) => (
            <li key={key} className='controls-apps-youtube-li-channel'>
              <button
                className={`controls-apps-youtube-video-button ${video.id === youtubeVideosLizSelectedId ? 'controls-apps-youtube-video-button--selected' : ''}`}
                onTouchStart={(e) => onTouchStart(e)}
                onTouchMove={(e) => onTouchMove(e)}
                onTouchEnd={(e) => onTouchEnd(e, 'video', video)}>
                <div>
                  <img
                    className={`controls-apps-youtube-video-img ${video.queue > 0 ? 'controls-apps-youtube-video-img--queue' : ''}`}
                    src={video.img || 'https://img.youtube.com/vi/' + video.id + '/sddefault.jpg'}
                    alt="icono">
                  </img>
                  <div className='controls-apps-youtube-video-queue-number'>
                    <span>{getQueueConsecutiveNumber(video) || ''}</span>
                  </div>
                </div>
              </button>
              <p className='controls-apps-youtube-video-title'>
                {video.title}
              </p>
              <div className='controls-apps-youtube-video-edit-container'>
                <p className='controls-apps-youtube-video-duration'>
                  {video.duration}
                </p>
                <button
                  className={`controls-apps-youtube-video-edit`}
                  onTouchStart={(e) => onTouchStart(e)}
                  onTouchMove={(e) => onTouchMove(e)}
                  onTouchEnd={(e) => onTouchEnd(e, 'edit', video)}>
                  {(() => {
                    const hasCustomChannel = video && video.channelId !== 'zz-channel';
                    return (
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        height="18"
                        width="18">
                        {!hasCustomChannel &&
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.2 2.6666666666666665c0 -0.29454933333333333 0.238784 -0.5333333333333333 0.5333333333333333 -0.5333333333333333h8.533333333333333c0.2945066666666667 0 0.5333333333333333 0.238784 0.5333333333333333 0.5333333333333333v11.733333333333333c0 0.19391999999999998 -0.10517333333333333 0.37248000000000003 -0.2747733333333333 0.46645333333333333 -0.1696 0.09397333333333333 -0.3768533333333333 0.08853333333333334 -0.5412266666666666 -0.014186666666666665L8 12.36224 4.016 14.852266666666665c-0.16440533333333332 0.10271999999999999 -0.3716373333333333 0.10816 -0.5412053333333334 0.014186666666666665C3.305216 14.77248 3.2 14.59392 3.2 14.4v-11.733333333333333ZM4.266666666666667 3.2v10.23776l3.168 -1.9800533333333334c0.345888 -0.21610666666666667 0.7847786666666666 -0.21610666666666667 1.1306666666666667 0L11.733333333333333 13.437759999999999V3.2H4.266666666666667Z"
                            fill="#fff"
                            strokeWidth="1.0667">
                          </path>
                        }
                        {hasCustomChannel &&
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.2 2.6666666666666665c0 -0.29454933333333333 0.238784 -0.5333333333333333 0.5333333333333333 -0.5333333333333333h8.533333333333333c0.2945066666666667 0 0.5333333333333333 0.238784 0.5333333333333333 0.5333333333333333v11.733333333333333c0 0.19391999999999998 -0.10517333333333333 0.37248000000000003 -0.2747733333333333 0.46645333333333333 -0.1696 0.09397333333333333 -0.3768533333333333 0.08853333333333334 -0.5412266666666666 -0.014186666666666665L8 12.36224 4.016 14.852266666666665c-0.16440533333333332 0.10271999999999999 -0.3716373333333333 0.10816 -0.5412053333333334 0.014186666666666665C3.305216 14.77248 3.2 14.59392 3.2 14.4v-11.733333333333333Z"
                            fill="#FFFFFF"
                          />
                        }
                      </svg>
                    );
                  })()}
                </button>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Channel;
