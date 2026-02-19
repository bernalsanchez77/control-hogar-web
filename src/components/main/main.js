import React from 'react';
import { useMain } from './useMain';
import Internet from './views/internet/internet.js';
import Restricted from './views/restricted/restricted.js';
import Credentials from './views/credentials/credentials.js';
import Load from './load/load';
import './main.css';

function Main() {
  const {
    isReadySt,
    themeSt,
    isConnectedToInternetSt,
    userTypeSt,
    wifiNameSt
  } = useMain();

  return (
    <div>
      {isReadySt &&
        <div className={`main fade-in main-${themeSt}`}>
          {isConnectedToInternetSt && userTypeSt && (userTypeSt !== 'guest' || (userTypeSt === 'guest' && wifiNameSt === 'Noky')) ?
            <div className='main-components'><Load></Load></div> :
            <div>
              {!isConnectedToInternetSt && <div><Internet></Internet></div>}
              {isConnectedToInternetSt && (wifiNameSt !== 'Noky' && userTypeSt === 'guest') && <div><Restricted></Restricted></div>}
              {isConnectedToInternetSt && !(wifiNameSt !== 'Noky' && userTypeSt === 'guest') && !userTypeSt && <div><Credentials></Credentials></div>}
            </div>
          }
        </div>
      }
    </div>
  );
}

export default Main;
