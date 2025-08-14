import React, {useState} from 'react';
import './credentials.css';

function Credentials({setCredentialsParent}) {
  const [credentialValue, setCredentialValue] = useState('');
  const setGuestCredential = () => {
    setCredentialsParent('guest');
  }
  const setOwnerCredential = (e) => {
    setCredentialValue(e.target.value);
    setCredentialsParent(e.target.value);
  }
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
