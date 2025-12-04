import { store } from "../../../store/store";
import Internet from './internet/internet.js';
import Restricted from './restricted/restricted.js';
import SupabaseTimeout from './supabaseTimeout/supabaseTimeout.js';
import Credentials from './credentials/credentials.js';
import Loading from './loading/loading.js';

function Views({supabaseTimeout, wifiNameSt, isConnectedToInternetSt, userCredentialSt, restartParent, onSetUserCredentialParent}) {
  const isLoadingSt = store(v => v.isLoadingSt);
  const isRestricted = wifiNameSt !== 'Noky' && userCredentialSt === 'guest';
  const restart = (fn, params) => {
    restartParent(fn, params);
  }

  const onSetUserCredential = (credential) => {
    onSetUserCredentialParent(credential);
  }

  return (
    <div className="views">
        {isLoadingSt &&
        <div className='views-element'>
          <Loading>
          </Loading>
        </div>
        }
        {!isLoadingSt && !isConnectedToInternetSt && 
        <div className='views-element'>
          <Internet
            restartParent={restart}>
          </Internet>
        </div>
        }
        {!isLoadingSt && isConnectedToInternetSt && isRestricted &&
        <div className='views-element'>
          <Restricted
            restartParent={restart}>
          </Restricted>
        </div>
        }
        {!isLoadingSt && isConnectedToInternetSt && !isRestricted && !userCredentialSt &&
        <div className='views-element'>
          <Credentials
            onSetUserCredentialParent={onSetUserCredential}>
          </Credentials>
        </div>
        }
        {!isLoadingSt && isConnectedToInternetSt && !isRestricted && userCredentialSt && supabaseTimeout &&
        <div className='views-element'>
          <SupabaseTimeout
            restartParent={restart}>
          </SupabaseTimeout>
        </div>
        }
    </div>
  );
}

export default Views