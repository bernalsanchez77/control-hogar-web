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
      <div className='credentials-theme'>
        <div>
          <label for="myDropdown">Escoja el tema:</label>
        </div>
          <select id="myDropdown" name="selectedOption">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
      </div>
    </div>
  );
}

export default Credentials;
