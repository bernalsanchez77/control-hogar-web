import React from 'react';
import { useHome } from './useHome';
import './home.css';

function Home() {
    const {
        userNameSt,
        lizEnabledSt,
        youtubeSortedChannels,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    } = useHome();

    return (
        <div>
            <ul className='controls-apps-youtube-ul'>
                {
                    youtubeSortedChannels.map((channel, key) => (
                        ((!lizEnabledSt && channel.user === userNameSt) || (lizEnabledSt && channel.user === 'elizabeth')) &&
                        <li key={key} className='controls-apps-youtube-li'>
                            <button
                                className={'controls-apps-youtube-channel-button'}
                                onTouchStart={(e) => onTouchStart(e)}
                                onTouchMove={(e) => onTouchMove(e)}
                                onTouchEnd={(e) => onTouchEnd(e, 'channel', channel)}>
                                <img
                                    className='controls-apps-youtube-channel-img'
                                    src={channel.img || 'https://control-hogar-psi.vercel.app/imgs/youtube-channels/' + channel.id + '.png'}
                                    alt="icono">
                                </img>
                                <p className='controls-apps-youtube-channel-title'>
                                    {channel.title}
                                </p>
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default Home;
