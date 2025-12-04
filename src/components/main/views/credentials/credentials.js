import {useState} from 'react';
import './credentials.css';

function Credentials({onSetUserCredentialParent}) {
  const [credentialValue, setCredentialValue] = useState('');
  const setGuestCredential = () => {
    onSetUserCredentialParent('guest');
  };
  const setOwnerCredential = (e) => {
    setCredentialValue(e.target.value);
    onSetUserCredentialParent(e.target.value);
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
