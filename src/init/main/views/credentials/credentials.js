import React from 'react';
import { useCredentials } from './useCredentials';
import './credentials.css';

function Credentials() {
  const {
    userValue,
    deviceValue,
    credentialValue,
    setGuestCredential,
    setOwnerUser,
    setOwnerDevice,
    setOwnerCredential
  } = useCredentials();

  return (
    <div className="credentials">
      <div>
        <div className='credentials-input'>
          <input
            type="text"
            placeholder='Usuario'
            onChange={setOwnerUser}
            value={userValue}>
          </input>
        </div>
        <div className='credentials-input'>
          <select
            onChange={setOwnerDevice}
            value={deviceValue}>
            <option value="">Seleccione un dispositivo</option>
            <option value="celular">Celular</option>
            <option value="tablet">Tableta</option>
            <option value="pc">PC</option>
          </select>
        </div>
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
