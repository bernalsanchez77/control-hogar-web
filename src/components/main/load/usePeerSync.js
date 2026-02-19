import { useEffect } from 'react';
import supabasePeers from '../../../global/supabase/supabase-peers';
import Roku from '../../../global/roku';
import requests from '../../../global/requests';

export function usePeerSync(userNameSt, userDeviceSt, leaderSt, peersSt, selectionsRef) {
    useEffect(() => {
        (async () => {
            if (userNameSt && userDeviceSt && leaderSt && userNameSt + '-' + userDeviceSt === leaderSt) {
                const playState = await Roku.getPlayState('state');
                if (playState && playState !== selectionsRef.current?.find(el => el.table === 'playState')?.id) {
                    requests.updateSelections({ table: 'playState', id: playState });
                }
            }
        })();
    }, [peersSt, leaderSt, userNameSt, userDeviceSt, selectionsRef]);

    useEffect(() => {
        if (leaderSt) {
            const initPeers = async () => {
                await supabasePeers.subscribeToPeersChannel();
            };
            initPeers();
        }
    }, [leaderSt]);
}
