import { __ } from '@wordpress/i18n';
import { CeSelect } from '@checkout-engine/react';
import { useState, useEffect } from '@wordpress/element';
import throttle from 'lodash/throttle';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

export default ( { onSelect } ) => {
	const [ products, setProducts ] = useState( [] );
	const [ query, setQuery ] = useState( '' );
	const [ busy, setBusy ] = useState( false );

	const findProduct = throttle(
		( value ) => {
			setQuery( value );
		},
		750,
		{ leading: false }
	);

	useEffect( () => {
		if ( ! query ) return;
		fetchProducts();
	}, [ query ] );

	const fetchProducts = async () => {
		setBusy( true );
		try {
			const response = await apiFetch( {
				path: addQueryArgs( `checkout-engine/v1/products`, {
					query,
					archived: false,
				} ),
			} );
			setProducts( response );
		} catch ( error ) {
			console.log( error );
		} finally {
			setBusy( false );
		}
	};

	return (
		<CeSelect
			onCeChange={ ( e ) => {
				onSelect( e.target.value );
			} }
			loading={ busy }
			placeholder={ __( 'Select a product', 'checkout_engine' ) }
			searchPlaceholder={ __(
				'Search for a product...',
				'checkout_engine'
			) }
			search
			onCeSearch={ ( e ) => findProduct( e.detail ) }
			choices={ products.map( ( product ) => {
				return {
					value: product.id,
					label: `${ product?.name } ${
						product?.metrics?.prices_count > 1
							? `(${ product?.metrics?.prices_count } Prices)`
							: ''
					}`,
				};
			} ) }
		/>
	);
};
