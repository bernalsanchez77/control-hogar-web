
import React from 'react';
import './arrows.css';

async function sendRokuCommand(command) {
    // Roku IP Address defined directly within the function
    const ROKU_IP_ADDRESS = '192.168.86.28';

    // The URL for the Roku ECP command
    const url = `http://${ROKU_IP_ADDRESS}:8060/keypress/${command}`;

    // Log the action to the console
    console.log(`[RokuCommand] Attempting to send '${command}' command to ${url}`);

    try {
        // Check if running in a native Capacitor environment (using the correct function check)
        if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) {
            console.log('[RokuCommand] Running in native Capacitor environment. Using native HTTP.');

            // *** CRITICAL CHANGE: Access CapacitorHttp directly from window.Capacitor ***
            // We removed the 'await import('@capacitor/core');' line
            const nativeHttp = window.Capacitor.CapacitorHttp; // Directly access it from the global object

            // Make the native HTTP POST request using the directly accessed object
            const res = await nativeHttp.post({ url: url });

            // Log the native response
            if (res.status >= 200 && res.status < 300) {
                console.log(`[RokuCommand Success] Command '${command}' sent successfully! Status: ${res.status} ${res.statusText}`);
            } else {
                console.error(`[RokuCommand Failed] Command '${command}' failed. Status: ${res.status} ${res.statusText}. Response Data:`, res.data);
            }
        } else {
            // Log a warning if not in the native app environment
            console.warn('[RokuCommand] Not in native app environment. Cannot send command to Roku directly from web browser.');
            console.log('[RokuCommand] To test, please build and run the Android APK on your phone.');
        }
    } catch (error) {
        // Log any network or other errors during the process
        console.error(`[RokuCommand Error] Network error for command '${command}':`, error.message);
        console.error('[RokuCommand Error] Make sure Roku is on, its IP is correct, and it is on the same local network as your phone.');
        console.error('Full error object:', error);
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
