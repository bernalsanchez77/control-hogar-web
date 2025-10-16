import SupabaseTimeout from './supabaseTimeout/supabaseTimeout.js';

function Views({supabaseTimeout, restartParent}) {
  const restart = (params) => {
    restartParent(params);
  }

  return (
    <div className="views">
        {supabaseTimeout &&
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