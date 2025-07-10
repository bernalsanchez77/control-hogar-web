
import React from 'react';
import './arrows.css';

async function sendRokuCommand(command = "Home") {
  const url = 'http://192.168.86.28:8060/keypress/' + command;

  const isMobileApp = !!window.Capacitor;

  if (!isMobileApp) {
    // Web: usar fetch
    try {
      await fetch(url, { method: 'POST' });
      console.log('Comando enviado vía fetch');
    } catch (err) {
      console.error('Error con fetch:', err);
    }
  } else {
    // App móvil: usar Capacitor HTTP sin importar estáticamente
    try {
      // Requiere acceso desde window o globalThis
      const Http = window.Capacitor.Plugins.Http || (await import('@capacitor-community/http')).Http;

      await Http.request({
        url: url,
        method: 'POST',
      });
      console.log('Comando enviado vía Capacitor HTTP');
    } catch (err) {
      console.error('Error con plugin HTTP:', err);
    }
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
