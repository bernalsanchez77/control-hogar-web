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
            <option value="black">Negro</option>
            <option value="grey">Gris</option>
            <option value="purple">Purpura</option>
            <option value="cyan">Cyan</option>
            <option value="blue">Azul</option>
          </select>
        </div>
}
      </div>
    </div>
  )
}

export default Options;
