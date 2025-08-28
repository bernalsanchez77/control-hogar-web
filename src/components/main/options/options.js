import {useState, useRef} from 'react';
import './options.css';

function Options({changeThemeParent, theme}) {
  const [optionView, setOptionView] = useState('default');
  const setTimeOutRef = useRef(null);
  const removeStorage = () => {
    removeStorage();
  }

  const changeOptionView = (option) => {
    setOptionView(option);
    setTimeOutRef.current = setTimeout(() => {
      setOptionView('default');
    }, 10000);
  }

  const changeTheme = (e) => {
    changeThemeParent(e.target.value);
    clearInterval(setTimeOutRef.current);
    setTimeOutRef.current = setTimeout(() => {
      setOptionView('default');
      clearInterval(setTimeOutRef.current);
    }, 10000);
  };

  return (
    <div className='options'>
      <div className='options-row'>
        {optionView === 'default' &&
        <div className='options-element options-element--options'>
            <button
                className={`options-button`}
                onTouchStart={() => changeOptionView('theme')}>
                <img
                className='options-img options-img--button'
                src="/imgs/options.png"
                alt="icono">
                </img>
            </button>
        </div>
        }
        {optionView === 'theme' &&
        <div className='options-element options-element--select'>
          <select value={theme} onChange={changeTheme}>
            <option value="dark">Oscuro</option>
            <option value="light">Claro</option>
            <option value="blue">Mar</option>
            <option value="red">Atardecer</option>
            <option value="green">Naturaleza</option>
          </select>
        </div>
}
      </div>
    </div>
  )
}

export default Options;
