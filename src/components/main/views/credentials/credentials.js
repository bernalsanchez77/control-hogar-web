import {useState} from 'react';
import './credentials.css';

function Credentials({restartParent}) {
  const [credentialValue, setCredentialValue] = useState('');
  const setGuestCredential = () => {
    restartParent('setCredentials', 'guest');
  };
  const setOwnerCredential = (e) => {
    setCredentialValue(e.target.value);
    restartParent('setCredentials', e.target.value);
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
