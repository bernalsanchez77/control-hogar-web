import { useRef } from 'react';

/**
 * Project-wide hook for handling touch interactions.
 * 
 * @param {Function} onShortPress - Callback for a short press (e, ...args).
 * @param {Function} onLongPress - Callback for a long press (e, ...args).
 * @param {number} longPressDelay - Delay for long press in ms.
 * @param {number} moveThreshold - Pixels move to cancel action.
 */
export function useTouch(onShortPress, onLongPress, longPressDelay = 500, moveThreshold = 10) {
    const touchStartY = useRef(0);
    const touchMoved = useRef(false);
    const isLongPress = useRef(false);
    const timeoutRef = useRef(null);

    const onTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
        touchMoved.current = false;
        isLongPress.current = false;

        timeoutRef.current = setTimeout(() => {
            isLongPress.current = true;
        }, longPressDelay);
    };

    const onTouchMove = (e) => {
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
        if (deltaY > moveThreshold) {
            touchMoved.current = true;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    };

    const onTouchEnd = (e, ...args) => {
        if (e.cancelable) {
            e.preventDefault();
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (!touchMoved.current) {
            if (isLongPress.current) {
                if (onLongPress) onLongPress(e, ...args);
            } else {
                if (onShortPress) onShortPress(e, ...args);
            }
        }

        isLongPress.current = false;
        touchMoved.current = false;
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
