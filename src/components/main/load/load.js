import React from 'react';
import Screens from '../screens/screens';
import Devices from '../devices/devices';
import Options from '../options/options';
import Controls from '../controls/controls';
import Loading from '../views/loading/loading';
import SupabaseTimeout from '../views/supabaseTimeout/supabaseTimeout';
import Dev from '../dev/dev';
import { useLoad } from './useLoad';
import './load.css';

function Load() {
    const {
        viewSt,
        isLoadingSt,
        userTypeSt,
        wifiNameSt,
        isConnectedToInternetSt,
        supabaseTimeoutSt,
        screensSt,
        devicesSt,
        onSupabaseTimeout
    } = useLoad();

    return (
        <div className='load'>
            {viewSt && !isLoadingSt && (userTypeSt !== 'guest' || (userTypeSt === 'guest' && wifiNameSt === 'Noky')) && !supabaseTimeoutSt ?
                <div className='load-components'>
                    {/* <Notifications></Notifications> */}
                    {screensSt.length > 0 &&
                        <Screens></Screens>
                    }
                    <Controls></Controls>
                    {devicesSt.length > 0 && !viewSt.roku.apps.selected && !viewSt.devices.device &&
                        <Devices></Devices>
                    }
                    {!viewSt.roku.apps.selected && !viewSt.devices.device &&
                        <Options></Options>
                    }
                    {userTypeSt === 'dev' &&
                        <Dev></Dev>
                    }
                </div> :
                <div>
                    {isLoadingSt &&
                        <div><Loading></Loading></div>
                    }
                    {!isLoadingSt && isConnectedToInternetSt && !(wifiNameSt !== 'Noky' && userTypeSt === 'guest') && userTypeSt && supabaseTimeoutSt &&
                        <div><SupabaseTimeout onSupabaseTimeoutParent={onSupabaseTimeout}></SupabaseTimeout></div>
                    }
                </div>
            }
        </div>
    );
}

export default Load;
