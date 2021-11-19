/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { useState, useRef, useEffect, Fragment } from '@wordpress/element';
import SelectPrice from '../../../components/SelectPrice';
import {
	CeInput,
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/react';
import { Icon, trash, moreHorizontalMobile } from '@wordpress/icons';
import { useSelect, dispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { translateInterval } from '../../../../../resources/scripts/admin/util/translations';

export default ( { choice, onUpdate, onSelect, onRemove } ) => {
	const [ query, setQuery ] = useState( null );
	const priceSelector = useRef();

	const { products, loading } = useSelect(
		( select ) => {
			const queryArgs = [
				'root',
				'product',
				{ query, expand: [ 'prices' ] },
			];
			return {
				products: select( coreStore ).getEntityRecords( ...queryArgs ),
				loading: select( coreStore ).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[ query ]
	);

	// set prices when products are loaded.
	useEffect( () => {
		const prices = ( products || [] )
			.map( ( product ) => product?.prices?.data )
			.flat();

		if ( prices ) {
			dispatch( coreStore ).receiveEntityRecords(
				'root',
				'price',
				prices,
				{ expand: [ 'product' ] }
			);
		}
	}, [ products ] );

	const price = useSelect(
		( select ) => {
			if ( ! choice?.id ) return;
			return select( coreStore ).getEntityRecord(
				'root',
				'price',
				choice?.id
			);
		},
		[ choice?.id ]
	);

	const product = useSelect(
		( select ) => {
			if ( ! price?.product ) return;
			return select( coreStore ).getEntityRecord(
				'root',
				'product',
				price.product
			);
		},
		[ price ]
	);

	const renderPrice = ( withQuantity = false ) => {
		if ( ! price?.id ) return '—';
		if ( price?.ad_hoc ) return __( 'Custom', 'checkout_engine' );
		return (
			<Fragment>
				<ce-format-number
					type="currency"
					value={
						price?.amount *
						( withQuantity ? choice?.quantity || 1 : 1 )
					}
					currency={ price?.currency }
				/>
				{ translateInterval(
					price?.recurring_interval_count,
					price?.recurring_interval,
					' /',
					''
				) }
			</Fragment>
		);
	};

	const renderDropDown = () => {
		return (
			<CeDropdown slot="suffix" position="bottom-right">
				<CeButton type="text" slot="trigger" circle>
					<Icon icon={ moreHorizontalMobile } />
				</CeButton>
				<CeMenu>
					<CeMenuItem onClick={ onRemove }>
						<Icon
							slot="prefix"
							style={ {
								opacity: 0.5,
							} }
							icon={ trash }
							size={ 20 }
						/>
						{ __( 'Remove', 'checkout_engine' ) }
					</CeMenuItem>
				</CeMenu>
			</CeDropdown>
		);
	};
	return (
		<tr>
			<td
				css={ css`
					width: 50%;
					max-width: 50%;
				` }
			>
				{ ! choice?.id ? (
					<SelectPrice
						required
						ref={ priceSelector }
						css={ css`
							flex: 0 1 50%;
						` }
						open={ true }
						products={ products }
						onQuery={ setQuery }
						onFetch={ () => setQuery( '' ) }
						loading={ loading }
						onSelect={ onSelect }
					/>
				) : (
					<div>
						<div>{ `${ product?.name } – ${ price?.name }` }</div>
						<div
							css={ css`
								color: var( --ce-color-gray-500 );
							` }
						>
							{ renderPrice() }
						</div>
					</div>
				) }
			</td>
			<td
				css={ css`
					max-width: 70px;
					width: 70px;
				` }
			>
				<CeInput
					type="number"
					value={ choice?.quantity }
					onCeChange={ ( e ) =>
						onUpdate( { quantity: e.target.value } )
					}
				/>
			</td>
			<td
				css={ css`
					text-align: right;
				` }
			>
				{ renderPrice( true ) }
			</td>
			<td>{ renderDropDown() }</td>
		</tr>
	);
};
