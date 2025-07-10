
import React from 'react';
import './arrows.css';
import { Http } from '@capacitor-community/http';

async function sendRokuCommand(command = 'Home') {
  try {
    const options = {
      url: `http://192.168.86.28:8060/keypress/${command}`,
      method: 'POST'
    };
    const response = await Http.request(options);
    console.log('Comando enviado, respuesta:', response);
  } catch (error) {
    console.error('Error al enviar comando:', error);
  }
}

function Arrows({devicesState, screenSelected, triggerControlParent}) {
  const triggerControl = (value) => {
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    const device = [{device: 'rokuSala', ifttt: 'rokuSala'}];
    triggerControlParent(device, ['command'], [value], false);

    // fetch('http://192.168.86.28:8060/keypress/Home', {
    //   method: 'POST'
    // })
    // .then(response => {
    //   if (response.ok) {
    //     console.log('Comando enviado correctamente');
    //   } else {
    //     console.error('Error en la respuesta de Roku');
    //   }
    // })
    // .catch(error => {
    //   console.error('Error al conectar con Roku:', error);
    // });
    // fetch('http://192.168.86.28:8060/keypress/Home');
    // window.AndroidRoku.sendCommand('Home');
    // fetch('https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?apikey=6e5f8a4d6ec6498c82c07956432ca3ab&deviceId=70244299129742a19649fd03cbb6a1ef&text=Home');
  }

  return (
    <div className='controls-arrows'>
      <div className='controls-arrows-row controls-arrows-row--one'>
        <div className='controls-arrows-element'>
          <button
            className="controls-arrows-button"
            onTouchStart={() => sendRokuCommand('Home')}>
              &#9650;
          </button>
        </div>
      </div>
      <div className='controls-arrows-row'>
        <div className='controls-arrows-element controls-arrows-element--left'>
          <button
            className="controls-arrows-button control-arrows-button--left"
            onTouchStart={() => triggerControl('left')}>
              &#9664;
          </button>
        </div>
        <div className='controls-arrows-element'>
          <button
            className="controls-arrows-button controls-arrows-button--circle"
            onTouchStart={() => triggerControl('enter')}>
              ok
          </button>
        </div>
        <div className='controls-arrows-element controls-arrows-element--right'>
          <button
            className="controls-arrows-button"
            onTouchStart={() => triggerControl('right')}>
              &#9654;
          </button>
        </div>
      </div>
      <div className='controls-arrows-row  controls-arrows-row--one'>
        <div className='controls-arrows-element'>
          <button
            className="controls-arrows-button"
            onTouchStart={() => triggerControl('down')}>
              &#9660;
          </button>
        </div>
      </div>
    </div>
  )
}

export default Arrows;
