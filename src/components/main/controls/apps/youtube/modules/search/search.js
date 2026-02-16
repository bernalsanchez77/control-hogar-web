import { useRef } from 'react';
import { store } from "../../../../../../../store/store";
import utils from '../../../../../../../global/utils';
import youtube from '../../../../../../../global/youtube';
import viewRouter from '../../../../../../../global/view-router';
import './search.css';

function Search({ setVideoToSave }) {
    const youtubeSearchVideosSt = store(v => v.youtubeSearchVideosSt);
    const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
    const viewSt = store(v => v.viewSt);
    const leaderSt = store(v => v.leaderSt);
    const selectionsSt = store(v => v.selectionsSt);
    const youtubeVideosLizSelectedId = selectionsSt.find(el => el.table === 'youtubeVideosLiz')?.id;

    let youtubeSortedVideos = youtubeSearchVideosSt.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        img: item.snippet.thumbnails.medium.url,
        duration: utils.formatYoutubeDuration(item.contentDetails.duration),
    }));

    let touchMoved = false;
    let touchStartY = 0;
    const timeout3s = useRef(null);
    const longClick = useRef(false);

    const onTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
        timeout3s.current = setTimeout(() => {
            longClick.current = true;
        }, 500);
    };

    const onTouchMove = (e) => {
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
        if (deltaY > 10) {
            touchMoved = true;
        }
    };

    const onTouchEnd = (e, type, video) => {
        e.preventDefault();
        clearTimeout(timeout3s.current);
        if (!touchMoved) {
            if (longClick.current) {
                utils.triggerVibrate();
                youtube.handleQueue(video);
            } else {
                if (type === 'video') {
                    if (leaderSt) {
                        utils.triggerVibrate();
                        youtube.onVideoShortClick(video);
                    }
                }
                if (type === 'edit') {
                    utils.triggerVibrate();
                    setVideoToSave(video);
                    const newView = structuredClone(viewSt);
                    newView.roku.apps.youtube.mode = 'edit';
                    viewRouter.changeView(newView);
                }
            }
        }
        longClick.current = false;
    };

    const getQueueConsecutiveNumber = (video) => {
        return youtube.getQueueConsecutiveNumber(video);
    };

    return (
        <div className='controls-apps-youtube controls-apps-youtube--search'>
            <ul className='controls-apps-youtube-ul'>
                {
                    youtubeSortedVideos.map((video, key) => (
                        <li key={key} className='controls-apps-youtube-li-search'>
                            <button
                                className={`controls-apps-youtube-video-button ${video.id === youtubeVideosLizSelectedId ? 'controls-apps-youtube-video-button--selected' : ''}`}
                                onTouchStart={(e) => onTouchStart(e)}
                                onTouchMove={(e) => onTouchMove(e)}
                                onTouchEnd={(e) => onTouchEnd(e, 'video', video)}>
                                <img
                                    className='controls-apps-youtube-video-img'
                                    src={video.img}
                                    alt="icono">
                                </img>
                                <div className='controls-apps-youtube-video-queue-number'>
                                    <span>{getQueueConsecutiveNumber(video) || ''}</span>
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
                                        const savedVideo = youtubeVideosLizSt.find(v => v.id === video.id);
                                        const hasCustomChannel = savedVideo && savedVideo.channelId !== 'zz-channel';
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

export default Search;
