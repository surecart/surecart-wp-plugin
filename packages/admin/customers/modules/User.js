import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { CeAlert } from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';

export default ( { customer_id } ) => {
	const [ user, setUser ] = useState( false );
	const [ loading, setLoading ] = useState( false );
  const [error, setError] = useState( '' );

	useEffect( () => {
		  fetchUser( customer_id );
	}, [ customer_id ] );

	const fetchUser = async ( customer_id ) => {
		setLoading( true );
		try {
			const [ user ] = await apiFetch( {
				path: addQueryArgs( 'wp/v2/users', {
					ce_customer_id: customer_id,
				} ),
			} );
			setUser( user );
		} catch(e) {
      setError(e?.message || __('Something went wrong', 'checkout_engine'));
		} finally {
			setLoading( false );
		}
	};

  if ( loading) {
    return <ce-skeleton style={ {
      width: '80%',
    } }
  ></ce-skeleton>;
  }

  if ( error ) {
    return <CeAlert
				type="danger"
				open={ error }>
          <span slot="title">
					{ __(
						'Something went wrong.',
						'checkout_engine'
					) }
				</span>
				{ error }
      </CeAlert>;
  }

  return <div>{user?.name}</div>;
};
