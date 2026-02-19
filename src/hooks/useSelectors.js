import { store } from '../store/store';

// 1. Selection Selectors (derived from selectionsSt)
export const useLeader = () => store(v => v.selectionsSt.find(el => el.table === 'leader')?.id);
export const usePlayState = () => store(v => v.selectionsSt.find(el => el.table === 'playState')?.id);
export const useYoutubeVideoSelectedId = () => store(v => v.selectionsSt.find(el => el.table === 'youtubeVideos')?.id);
export const useRokuAppSelectedId = () => store(v => v.selectionsSt.find(el => el.table === 'rokuApps')?.id);
export const usePlayPosition = () => store(v => v.selectionsSt.find(el => el.table === 'playPosition')?.id);
export const useHdmiSalaSelectedId = () => store(v => v.selectionsSt.find(el => el.table === 'hdmiSala')?.id);

// 2. Specialized Selectors
export const useSelectedScreenData = () => {
    const screenId = store(v => v.screenSelectedSt);
    return store(v => v.screensSt.find(s => s.id === screenId));
};

export const useSelectedYoutubeVideoData = () => {
    const videoId = useYoutubeVideoSelectedId();
    return store(v => v.youtubeVideosSt.find(vid => vid.id === videoId));
};

export const useSelectedRokuAppData = () => {
    const rokuId = useRokuAppSelectedId();
    return store(v => v.rokuAppsSt.find(app => app.rokuId === rokuId));
};
