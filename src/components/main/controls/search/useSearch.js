import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { store } from '../../../../store/store';
import requests from '../../../../global/requests';
import viewRouter from '../../../../global/view-router';
import utils from '../../../../global/utils';
import { useTouch } from '../../../../hooks/useTouch';

export function useSearch() {
    // 1. Store / Global State
    const rokuSearchModeSt = store(v => v.rokuSearchModeSt);
    const viewSt = store(v => v.viewSt);
    const selectionsSt = store(v => v.selectionsSt);
    const setYoutubeSearchVideosSt = store(v => v.setYoutubeSearchVideosSt);
    const rokuAppsSt = store(v => v.rokuAppsSt);

    // 2. Local State
    const [searchText, setSearchText] = useState('');

    // 3. Refs
    const inputRef = useRef(null);

    // 4. Derived Values / Memoized Selections
    const rokuAppsSelectedLabel = useMemo(() => {
        const selectedRokuId = selectionsSt.find(el => el.table === 'rokuApps')?.id;
        return rokuAppsSt.find(el => el.rokuId === selectedRokuId)?.label;
    }, [selectionsSt, rokuAppsSt]);

    const placeholder = useMemo(() => {
        if (viewSt.selected === 'cable') return 'Buscar Canal';

        if (viewSt.selected === 'roku') {
            if (viewSt.roku.apps.selected === 'youtube') {
                const mode = viewSt.roku.apps.youtube.mode;
                if (mode === 'channel') return 'Buscar en Youtube';
                return 'Buscar en el telefono';
            }
            return rokuAppsSelectedLabel ? `Buscar en ${rokuAppsSelectedLabel}` : 'Buscar en Roku';
        }

        return '';
    }, [viewSt, rokuAppsSelectedLabel]);

    // 5. Callbacks / Functions
    const searchQuery = useCallback(async () => {
        if (!searchText) return;

        if (viewSt.selected === 'roku') {
            if (rokuSearchModeSt === 'app') {
                const youtubeState = viewSt.roku.apps.youtube;
                if (viewSt.roku.apps.selected === 'youtube' && (youtubeState.mode === '' || youtubeState.mode === 'search')) {
                    await viewRouter.navigateToYoutubeSearch();
                    const videos = await requests.searchYoutube(searchText);
                    if (videos) {
                        setYoutubeSearchVideosSt(videos);
                    }
                }
            }
        }

        // Logic for other modes would go here (cable, etc)

        const active = document.activeElement;
        if (active && active.blur) {
            active.blur();
        }
    }, [searchText, viewSt, rokuSearchModeSt, setYoutubeSearchVideosSt]);

    const handleShortPress = useCallback(() => {
        searchQuery();
    }, [searchQuery]);

    const handleLongPress = useCallback(() => {
        // No long press action defined yet
    }, []);

    const onSubmit = useCallback((e) => {
        utils.triggerVibrate();
        e.preventDefault();
        searchQuery();
        if (inputRef.current) {
            inputRef.current.blur();
        }
    }, [searchQuery]);

    const onKeyDown = useCallback((e) => {
        if (rokuSearchModeSt === 'roku') {
            if (e.key === "Backspace") {
                requests.fetchRoku({ key: 'keypress', value: 'Backspace' });
            }
        }
    }, [rokuSearchModeSt]);

    const onChange = useCallback((e) => {
        const newValue = e.target.value;
        const oldValue = searchText;

        if (rokuSearchModeSt === 'roku') {
            if (newValue.length > oldValue.length) {
                // Characters were added
                const addedText = newValue.slice(oldValue.length);
                for (const char of addedText) {
                    const value = char === ' ' ? 'Lit_%20' : `Lit_${encodeURIComponent(char)}`;
                    requests.fetchRoku({ key: 'keypress', value });
                }
            } else if (newValue.length < oldValue.length) {
                // Characters were deleted
                const numDeleted = oldValue.length - newValue.length;
                for (let i = 0; i < numDeleted; i++) {
                    requests.fetchRoku({ key: 'keypress', value: 'Backspace' });
                }
            }
        }
        setSearchText(e.target.value);
    }, [searchText, rokuSearchModeSt]);

    // 6. Hook Integrations
    const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(handleShortPress, handleLongPress);

    // 7. Effects
    useEffect(() => {
        setSearchText('');
    }, [rokuSearchModeSt]);

    // 8. Return statement
    return {
        rokuSearchModeSt,
        searchText,
        inputRef,
        placeholder,
        onSubmit,
        onChange,
        onKeyDown,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
