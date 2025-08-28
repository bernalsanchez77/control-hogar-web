import {useState} from 'react';
import './credentials.css';

function Credentials({setCredentialsParent, changeThemeParent, theme}) {
  const [credentialValue, setCredentialValue] = useState('');
  const setGuestCredential = () => {
    setCredentialsParent('guest');
  };
  const setOwnerCredential = (e) => {
    setCredentialValue(e.target.value);
    setCredentialsParent(e.target.value);
  };
  const changeTheme = (e) => {
    changeThemeParent(e.target.value);
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
      <div className='credentials-theme'>
        <div className='credentials-theme-label'>
          <span>Escoja el tema:</span>
        </div>
          <select value={theme} onChange={changeTheme}>
            <option value="black">Negro</option>
            <option value="grey">Gris</option>
            <option value="purple">Purpura</option>
            <option value="cyan">Cyan</option>
            <option value="blue">Azul</option>
          </select>
      </div>
    </div>
  );
}

export default Credentials;
