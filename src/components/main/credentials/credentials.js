import React, {useState} from 'react';
import './credentials.css';

function Credentials({credential, guestCredential, setCredentialsParent}) {
  const [credentialValue, setCredentialValue] = useState('');
  const setGuestCredential = () => {
    setCredentialsParent(guestCredential);
  }
  const setOwnerCredential = (e) => {
    setCredentialValue(e.target.value);
    setCredentialsParent(e.target.value);
  }
  return (
    <div className="credentials">
      {credential ?
      <div>
      </div> :
      <div>
        <div>
          <input
            type="text"
            placeholder='Clave'
            onChange={setOwnerCredential}
            value={credentialValue}>
          </input>
        </div>
        <div>o</div>
        <div>
          <button onClick={setGuestCredential}>Invitado</button>
        </div>
      </div>
      }
    </div>
  );
}

export default Credentials;
