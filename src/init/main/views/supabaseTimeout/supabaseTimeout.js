import { useSupabaseTimeoutView } from './useSupabaseTimeoutView';
import './supabaseTimeout.css';

function SupabaseTimeout({ onSupabaseTimeoutParent }) {
  const { onRestart } = useSupabaseTimeoutView(onSupabaseTimeoutParent);

  return (
    <div className="views-supabasetimeout">
      <div className='views-supabasetimeout-text'>
        <p className='views-supabasetimeout-text-title'>Error en la aplicacion, por favor reinicie la aplicacion.</p>
        <p className='views-supabasetimeout-text-description'>La aplicacion tardo demasiado tiempo en subscribirse a la base de datos.</p>
      </div>
      <div className='views-supabasetimeout-button'>
        <button
          onTouchStart={onRestart}>
          Reiniciar
        </button>
      </div>
    </div>
  );
}

export default SupabaseTimeout;
