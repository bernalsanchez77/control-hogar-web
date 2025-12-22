import { useRef } from 'react';
import { store } from "../../../../store/store";
import utils from '../../../../global/utils';
import requests from '../../../../global/requests';
import './levels.css';

function Levels() {
  const screenSelectedSt = store(v => v.screenSelectedSt);
  const screensSt = store(v => v.screensSt);
  const cableChannelsSt = store(v => v.cableChannelsSt);
  const viewSt = store(v => v.viewSt);
  const isAppSt = store(v => v.isAppSt);
  const wifiNameSt = store(v => v.wifiNameSt);
  const screen = screensSt.find(screen => screen.id === screenSelectedSt);
  const timeout3s = useRef(null);
  const timeout6s = useRef(null);
  const volumeChange = useRef(1);

  const onMuteShortClick = () => {
    if (screen.state === 'on') {
      utils.triggerVibrate();
      const device = screenSelectedSt;
      const value = screen.mute === 'on' ? 'off' : 'on';
      requests.sendIfttt({ device, key: 'mute', value });
      requests.updateTable({ new: { newId: device, newTable: 'screens', newMute: value } });
    }
  }
  const onOptionsShortClick = (value) => {
    utils.triggerVibrate();
    const device = viewSt.selected === 'roku' ? 'rokuSala' : 'cableSala';
    const rokuValue = value.charAt(0).toUpperCase() + value.slice(1);
    if (isAppSt && wifiNameSt === 'Noky') {
      requests.fetchRoku({ key: 'keypress', value: rokuValue });
    } else {
      requests.sendIfttt({ device, key: 'command', value });
    }
  }

  const onChannelShortClick = (value) => {
    utils.triggerVibrate();
    let newChannel = {};
    const device = 'channelsSala';
    let newChannelOrder = 0;
    const channelSelected = cableChannelsSt.find(ch => ch.state === 'selected');
    const channelOrderSelected = channelSelected.order;
    if (value === 'up') {
      newChannelOrder = channelOrderSelected + 1;
    }
    if (value === 'down') {
      newChannelOrder = channelOrderSelected - 1;
    }
    newChannel = cableChannelsSt.find(ch => ch.order === newChannelOrder);
    if (!newChannel) {
      if (value === 'up') {
        newChannel = cableChannelsSt.find(ch => ch.order === 1);
      } else {
        newChannel = cableChannelsSt[cableChannelsSt.length - 1];
      }
    }
    requests.sendIfttt({ device: device + newChannel.ifttt, key: 'selected', value: newChannel.id });
    requests.updateTable({
      current: { currentId: channelSelected.id, currentTable: 'cableChannels' },
      new: { newId: newChannel.id, newTable: 'cableChannels' }
    });
  }

  const onVolumeClick = (vol, button, vib = true) => {
    const device = screenSelectedSt;
    let newVol = 0;
    if (button === 'up') {
      newVol = screen.volume + vol;
      requests.sendIfttt({ device, key: 'volume', value: button + vol });
      requests.updateTable({ new: { newId: device, newTable: 'screens', newVolume: newVol } });
    } else if (screen.volume !== 0) {
      if (screen.volume - vol >= 0) {
        newVol = screen.volume - vol;
        requests.sendIfttt({ device, key: 'volume', value: button + vol });
        requests.updateTable({ new: { newId: device, newTable: 'screens', newVolume: newVol } });
      } else {
        requests.sendIfttt({ device, key: 'volume', value: button + vol });
        requests.updateTable({ new: { newId: device, newTable: 'screens', newVolume: '0' } });
      }
    } else {
      requests.sendIfttt({ device, key: 'volume', value: button + vol });
    }
  }

  const changeVolumeStart = (e, button) => {
    e.preventDefault();
    if (screen.state === 'on') {
      volumeChange.current = 1;
      timeout3s.current = setTimeout(() => {
        volumeChange.current = 5;
        utils.triggerVibrate(200);
      }, 1000);
      timeout6s.current = setTimeout(() => {
        volumeChange.current = 10;
        utils.triggerVibrate(400);
      }, 2000);
    }
  }

  const changeVolumeEnd = (e, button) => {
    e.preventDefault();
    if (screen.state === 'on') {
      clearTimeout(timeout3s.current);
      clearTimeout(timeout6s.current);
      if (volumeChange.current === 1) {
        utils.triggerVibrate(200);
        onVolumeClick(volumeChange.current, button);
      } else {
        utils.triggerVibrate(200);
        onVolumeClick(volumeChange.current, button, false);
      }
    }
  }

  return (
    <div className='controls-levels'>
      <div className='controls-levels-wrapper'>
        <div className='controls-levels-row controls-levels-row--top'>
          <div className='controls-levels-element controls-levels-element--left'>
            <button
              className='controls-levels-button'
              onTouchStart={(e) => changeVolumeStart(e, 'up')}
              onTouchEnd={(e) => changeVolumeEnd(e, 'up')}>
              &#9650;
            </button>
          </div>
          <div className='controls-levels-element controls-levels-element--mute-icon'>
            <button
              className="controls-levels-button controls-levels-button--img"
              onTouchStart={() => onMuteShortClick()}>
              {screen.mute === 'off' &&
                <img
                  className='controls-levels-img controls-levels-img--no-button'
                  src="/imgs/sound-50.png"
                  alt="icono">
                </img>
              }
              {screen.mute === 'on' &&
                <img
                  className='controls-levels-img controls-levels-img--no-button'
                  src="/imgs/mute-50.png"
                  alt="icono">
                </img>
              }
            </button>
          </div>
          {
            viewSt.selected === 'roku' &&
            <div className='controls-levels-element controls-levels-element--right'>
              <button
                className={`controls-levels-button`}
                onTouchStart={() => onOptionsShortClick('back')}>
                <img
                  className='controls-levels-img controls-levels-img--button'
                  src="/imgs/back-50.png"
                  alt="icono">
                </img>
              </button>
            </div>
          }
          {
            viewSt.selected === 'cable' &&
            <div className='controls-levels-element controls-levels-element--right'>
              <button
                className={'controls-levels-button'}
                onTouchStart={() => onChannelShortClick('up')}>
                &#9650;
              </button>
            </div>
          }
        </div>
        <div className='controls-levels-row controls-levels-row--middle'>
          <div className='controls-levels-element controls-levels-element--no-margin'>
            <span className='controls-levels-span'>
              vol {screen.volume}
            </span>
          </div>
          <div className='controls-levels-element controls-levels-element--right controls-levels-element--no-margin'>
            <span className='controls-levels-span'>
              {viewSt.selected === 'roku' &&
                'op'
              }
              {viewSt.selected === 'cable' &&
                'ch'
              }
            </span>
          </div>
        </div>
        <div className='controls-levels-row controls-levels-row--bottom'>
          <div className='controls-levels-element controls-levels-element--left'>
            <button
              className='controls-levels-button'
              onTouchStart={(e) => changeVolumeStart(e, 'down')}
              onTouchEnd={(e) => changeVolumeEnd(e, 'down')}>
              &#9660;
            </button>
          </div>
          <div className='controls-levels-element controls-levels-element--back'>
            {/* <button
              className='controls-levels-button controls-levels-button--img'
              onTouchStart={() => backButtonTriggered()}>
              <img
                className='controls-levels-img controls-levels-img--no-button'
                src="/imgs/back-50.png"
                alt="icono">
              </img>
            </button> */}
          </div>
          {
            viewSt.selected === 'roku' &&
            <div className='controls-levels-element controls-levels-element--right'>
              <button
                className={`controls-levels-button`}
                onTouchStart={() => onOptionsShortClick('info')}>
                <img
                  className='controls-levels-img controls-levels-img--button'
                  src="/imgs/asterisk-24.png"
                  alt="icono">
                </img>
              </button>
            </div>
          }
          {
            viewSt.selected === 'cable' &&
            <div className='controls-levels-element controls-levels-element--right'>
              <button
                className={`controls-levels-button`}
                onTouchStart={() => onChannelShortClick('down')}>
                &#9660;
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Levels;
