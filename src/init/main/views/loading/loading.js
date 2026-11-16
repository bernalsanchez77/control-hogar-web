import { useLoadingView } from './useLoadingView';
import './loading.css';

function Loading() {
  useLoadingView();

  return (
    <div className="views-loading-container">
      <span className="views-loading-text">Cargando</span>
      <div className="views-loading-dots">
        <span className="views-loading-dot">.</span>
        <span className="views-loading-dot">.</span>
        <span className="views-loading-dot">.</span>
      </div>
    </div>
  );
}

export default Loading;
