import './notifications.css';

function Notifications({connectedToRoku, wifiSsid}) {
  return (
    <div className='notifications'>
      <div className='notifications-row'>
        <span>
          {wifiSsid === 'Noky'
            ? connectedToRoku
              ? 'Conectado a Noky y a Roku'
              : 'Conectado a Noky pero no a Roku'
            : 'Desconectado de Noky y Roku'}
        </span>
      </div>
    </div>
  );
}

export default Notifications;
