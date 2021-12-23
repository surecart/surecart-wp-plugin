import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { CeSelect, CeDivider, CeMenuItem } from '@checkout-engine/react';
import throttle from 'lodash/throttle';
import { translateInterval } from '../../../resources/scripts/admin/util/translations';
import { formatNumber } from '../../../resources/scripts/admin/util';

export default ( {
	open,
	required,
	products,
	onSelect,
	value,
	className,
	onQuery,
	onFetch,
	onNew,
	ad_hoc = true,
	loading,
} ) => {
	const selectRef = useRef();
	const findProduct = throttle(
		( value ) => {
			onQuery( value );
		},
		750,
		{ leading: false }
	);

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
			' /',
			''
		) }`;
	};

	const choices = ( products || [] )
		.filter( ( product ) => !! product?.prices?.data?.length )
		.map( ( product ) => {
			return {
				label: product?.name,
				id: product.id,
				disabled: false,
				choices: ( product?.prices?.data || [] )
					.filter( ( price ) => {
						if ( ! ad_hoc && price.ad_hoc ) {
							return false;
						}
						return true;
					} )
					.map( ( price ) => {
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
			required={ required }
			ref={ selectRef }
			value={ value }
			className={ className }
			open={ open }
			loading={ loading }
			placeholder={ __( 'Select a product', 'checkout_engine' ) }
			searchPlaceholder={ __(
				'Search for a product...',
				'checkout_engine'
			) }
			search
			onCeOpen={ onFetch }
			onCeSearch={ ( e ) => findProduct( e.detail ) }
			onCeChange={ ( e ) => {
				onSelect( e.target.value );
			} }
			choices={ choices }
		>
			{ onNew && (
				<span slot="prefix">
					<CeMenuItem onClick={ onNew }>
						<span slot="prefix">+</span>
						{ __( 'Add New Product', 'checkout_engine' ) }
					</CeMenuItem>
					<CeDivider
						style={ { '--spacing': 'var(--ce-spacing-x-small)' } }
					></CeDivider>
				</span>
			) }
		</CeSelect>
	);
};
