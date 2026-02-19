import { useCallback } from 'react';
import utils from '../../../../global/utils';

export function useSupabaseTimeoutView(onSupabaseTimeoutParent) {
    // 1. Callbacks / Functions
    const onRestart = useCallback(() => {
        utils.triggerVibrate();
        if (onSupabaseTimeoutParent) {
            onSupabaseTimeoutParent();
        }
    }, [onSupabaseTimeoutParent]);

    // 2. Return
    return {
        onRestart
    };
}
