import { useEffect } from 'react';
import events from '../../../global/events';

export function useAppEvents(isAppSt) {
    useEffect(() => {
        if (isAppSt) {
            document.addEventListener("backbutton", events.onNavigationBack);
            document.addEventListener("volumeupbutton", events.onVolumeUp);
            document.addEventListener("volumedownbutton", events.onVolumeDown);
        } else {
            window.addEventListener("popstate", events.onNavigationBack);
        }

        return () => {
            if (isAppSt) {
                document.removeEventListener("backbutton", events.onNavigationBack);
                document.removeEventListener("volumeupbutton", events.onVolumeUp);
                document.removeEventListener("volumedownbutton", events.onVolumeDown);
            } else {
                window.removeEventListener("popstate", events.onNavigationBack);
            }
        };
    }, [isAppSt]);
}
