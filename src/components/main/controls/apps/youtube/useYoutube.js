import { useState } from 'react';
import { store } from "../../../../../store/store";

export function useYoutube() {
    // 1. Store / Global State
    const viewSt = store(v => v.viewSt);

    // 2. Local State
    const [videoToSave, setVideoToSave] = useState(null);

    return {
        viewSt,
        videoToSave,
        setVideoToSave
    };
}
