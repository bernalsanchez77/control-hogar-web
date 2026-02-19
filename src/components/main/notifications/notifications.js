import { useNotifications } from './useNotifications';
import './notifications.css';

function Notifications() {
  const { wifiNameSt } = useNotifications();

  return (
    <div className='notifications'>
      <div className='notifications-row'>
        <span>
          {wifiNameSt === 'Noky'
            ? 'Conectado a Noky y Roku'
            : 'Desconectado de Noky y Roku'}
        </span>
      </div>
    </div>
  );
}

export default Notifications;
