import { __ } from '@wordpress/i18n';
import { CeSelect, CeDivider, CeMenuItem } from '@checkout-engine/components-react';
import { useState, useEffect } from '@wordpress/element';
import throttle from 'lodash/throttle';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { translateInterval } from '../../../resources/scripts/admin/util/translations';
import { formatNumber } from '../../../resources/scripts/admin/util';

export default ( { onSelect, className } ) => {
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
					expand: [ 'prices' ],
				} ),
			} );
			setProducts( response );
		} catch ( error ) {
			console.log( error );
		} finally {
			setBusy( false );
		}
	};

	const displayPriceAmount = ( price ) => {
		if ( price?.ad_hoc ) {
			return __( 'Custom', 'checkout_engine' );
		}
		return `${ formatNumber(
			price.amount,
			price.currency
		) }${ translateInterval(
			price?.recurring_interval_count,
			price?.recurring_interval,
			'/',
			''
		) }`;
	};

	const choices = products.map( ( product ) => {
		return {
			label: product?.name,
			id: product.id,
			disabled: false,
			choices: ( product?.prices?.data || [] ).map( ( price ) => {
				return {
					value: price.id,
					label: price.name,
					suffix: displayPriceAmount( price ),
				};
			} ),
		};
	} );

	return (
		<CeSelect
			className={ className }
			loading={ busy }
			placeholder={ __( 'Select a product', 'checkout_engine' ) }
			searchPlaceholder={ __(
				'Search for a product...',
				'checkout_engine'
			) }
			search
			onCeOpen={ fetchProducts }
			onCeSearch={ ( e ) => findProduct( e.detail ) }
			onCeChange={ ( e ) => {
				onSelect( e.target.value );
			} }
			choices={ choices }
		>
			<span slot="prefix">
				<CeMenuItem onClick={ () => console.log( 'new' ) }>
					<span slot="prefix">+</span>
					{ __( 'Add New Product' ) }
				</CeMenuItem>
				<CeDivider
					style={ { '--spacing': 'var(--ce-spacing-x-small)' } }
				></CeDivider>
			</span>
		</CeSelect>
	);
};
