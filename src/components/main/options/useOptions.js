import { useState, useRef, useCallback } from 'react';
import { store } from "../../../store/store";

export function useOptions() {
    // 1. Store / Global State
    const themeSt = store(v => v.themeSt);
    const setThemeSt = store(v => v.setThemeSt);

    // 2. React State
    const [optionView, setOptionView] = useState('default');

    // 3. Refs
    const setTimeOutRef = useRef(null);

    // 4. Callbacks / Functions
    const changeOptionView = useCallback((option) => {
        setOptionView(option);
        if (setTimeOutRef.current) clearTimeout(setTimeOutRef.current);
        setTimeOutRef.current = setTimeout(() => {
            setOptionView('default');
        }, 10000);
    }, []);

    const changeTheme = useCallback((e) => {
        const theme = e.target.value;
        setThemeSt(theme);
        localStorage.setItem('theme', theme);

        if (setTimeOutRef.current) clearTimeout(setTimeOutRef.current);
        setTimeOutRef.current = setTimeout(() => {
            setOptionView('default');
        }, 10000);
    }, [setThemeSt]);

    return {
        themeSt,
        optionView,
        changeOptionView,
        changeTheme
    };
}
