import React from 'react';
import './credentials.css';

function Credentials({credential, credentialValue, setCredentialsParent}) {
  const setCredentials = (e) => {
    setCredentialsParent(e.target.value);
  }
  return (
    <div className="credentials">
      {credential ?
      <div>
        <span>Bienvenido</span>
      </div> :
      <div>
        <label>Credential: </label>
        <input
          type="text"
          onChange={setCredentials}
          placeholder="Escribe tu nombre">
        </input>
      </div>}
    </div>
  );
}

export default Credentials;
