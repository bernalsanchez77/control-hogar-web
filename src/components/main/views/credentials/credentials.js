import { useState, useRef } from 'react';
import './credentials.css';
import { store } from '../../../../store/store';
import connection from '../../../../global/connection';
import requests from '../../../../global/requests';
function Credentials() {

  const [userValue, setUserValue] = useState('');
  const [credentialValue, setCredentialValue] = useState('');
  const credentialValueRef = useRef('');
  const userValueRef = useRef('');
  const setUserTypeSt = store(v => v.setUserTypeSt);
  const setUserNameSt = store(v => v.setUserNameSt);
  const setSendEnabledSt = store(v => v.setSendEnabledSt);
  const setCredentials = async (userType) => {
    if (userValueRef.current.length === 0 || credentialValueRef.current.length === 0) {
      return;
    }
    const isConnectedToInternet = await connection.getIsConnectedToInternet();
    if (isConnectedToInternet) {
      if (userType === 'guest') {
        const users = await requests.getTable('users');
        if (users.data.find(user => user.id === userValueRef.current)) {
          localStorage.setItem('user-type', userType);
          localStorage.setItem('user-name', userValueRef.current);
          setUserNameSt(userValueRef.current);
          setUserTypeSt(userType);
        }
      } else {
        const data = await requests.validateUserType(userType);
        if (data) {
          const users = await requests.getTable('users');
          if (users.data.find(user => user.id === userValueRef.current)) {
            if (data.dev) {
              localStorage.setItem('user-type', data.dev);
              setSendEnabledSt(false);
            } else {
              localStorage.setItem('user-type', 'owner');
            }
            localStorage.setItem('user-name', userValueRef.current);
            setUserNameSt(userValueRef.current);
            setUserTypeSt(data.dev || 'owner');
          }
        }
      }
    }
  }
  const setGuestCredential = () => {
    setCredentials('guest');
  };
  const setOwnerCredential = (e) => {
    setCredentialValue(e.target.value);
    credentialValueRef.current = e.target.value;
    setCredentials(e.target.value);
  };
  const setOwnerUser = (e) => {
    setUserValue(e.target.value);
    userValueRef.current = e.target.value;
    setCredentials(credentialValueRef.current);
  };
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
