
import React from 'react';
import './arrows.css';

async function sendRokuCommand(command) {
    // Hardcoded Roku IP address as requested
    const ROKU_IP_ADDRESS = '192.168.86.28';

    // Assuming 'responseDisplay' is an element defined elsewhere in your HTML
    // (e.g., const responseDisplay = document.getElementById('response');)

    const url = `http://${ROKU_IP_ADDRESS}:8060/keypress/${command}`;

    try {
        const res = await fetch(url, {
            method: 'POST',
        });

        if (res.ok) {
            console.log('success');
            console.log(`Command "${command}" sent successfully! Status: ${res.status} ${res.statusText}`);
        } else {
            console.log('error');
            console.log(`Failed to send command "${command}". Status: ${res.status} ${res.statusText}\n${await res.text()}`);
        }
    } catch (error) {
        console.log('error');
        console.log(`Network error sending "${command}":\n${error.message}\nEnsure Roku is on and on the same local network as your phone (${ROKU_IP_ADDRESS}).`);
        console.error('Fetch error:', error);
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
