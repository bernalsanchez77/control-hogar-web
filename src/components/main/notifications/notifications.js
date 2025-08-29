import './notifications.css';

function Notifications({connectedToRoku}) {
  return (
    <div className='notifications'>
        <div className={`notifications-row ${connectedToRoku ? '' : 'notifications-row--disconnected'}`}>
          <span>
            No hay conexion con Roku
          </span>
        </div>
    </div>
  )
}

export default Notifications;
