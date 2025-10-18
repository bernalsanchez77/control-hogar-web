import Internet from './internet/internet.js';
import Restricted from './restricted/restricted.js';
import SupabaseTimeout from './supabaseTimeout/supabaseTimeout.js';
import Credentials from './credentials/credentials.js';
import Loading from './loading/loading.js';

function Views({supabaseTimeout, restricted, loading, internet, credential, restartParent}) {
  const restart = (fn, params) => {
    restartParent(fn, params);
  }

  return (
    <div className="views">
        {loading &&
        <div className='views-element'>
          <Loading>
          </Loading>
        </div>
        }
        {!loading && !internet && 
        <div className='views-element'>
          <Internet
            restartParent={restart}>
          </Internet>
        </div>
        }
        {!loading && internet && restricted &&
        <div className='views-element'>
          <Restricted
            restartParent={restart}>
          </Restricted>
        </div>
        }
        {!loading && internet && !restricted && !credential &&
        <div className='views-element'>
          <Credentials
            restartParent={restart}>
          </Credentials>
        </div>
        }
        {!loading && internet && !restricted && credential && supabaseTimeout &&
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