import { useState } from 'react';
import utils from '../../../global/utils';
import requests from '../../../global/requests';
import { store } from '../../../store/store';
import './credentials.css';

function Credentials() {
  const [credentialValue, setCredentialValue] = useState('');
  const setUserCredentialSt = store(v => v.setUserCredentialSt);
  const setSendEnabledSt = store(v => v.setSendEnabledSt);
  const setCredentials = async (userCredential) => {
    const isConnectedToInternet = await utils.getIsConnectedToInternet();
    if (isConnectedToInternet) {
      if (userCredential === 'guest') {
        localStorage.setItem('user', userCredential);
        setUserCredentialSt(userCredential);
      } else {
        const user = await requests.validateUserCredential(userCredential);
        if (user) {
          if (user === 'dev') {
            setSendEnabledSt(false);
          }
          // separate
          // await load();
          setUserCredentialSt(user);
        }
      }
    }
  }
  const setGuestCredential = () => {
    setCredentials('guest');
  };
  const setOwnerCredential = (e) => {
    setCredentialValue(e.target.value);
    setCredentials(e.target.value);
  };
  return (
    <div className="credentials">
      <div>
        <div className='credentials-input'>
          <input
            type="text"
            placeholder='Clave'
            onChange={setOwnerCredential}
            value={credentialValue}>
          </input>
        </div>
        <div>
          <button
            className='credentials-button'
            onClick={setGuestCredential}>
            Invitado
          </button>
        </div>
      </div>
    </div>
  );
}

export default Credentials;
