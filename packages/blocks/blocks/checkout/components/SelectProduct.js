/** @jsx jsx */

import apiFetch from '@wordpress/api-fetch';
import { dispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { Button, Modal } from '@wordpress/components';
import { css, jsx } from '@emotion/core';

import dotProp from 'dot-prop-immutable';

import throttle from 'lodash/throttle';

import { CeFormRow, CeButton, CeSelect } from '@checkout-engine/react';

export default ( { onRequestClose, attributes, setAttributes } ) => {
	const { products } = attributes;
	const [ product, setProduct ] = useState( {} );
	const [ productsData, setProductsData ] = useState( [] );
	const [ query, setQuery ] = useState( '' );
	const [ loading, setLoading ] = useState( false );

	const addProduct = () => {
		setAttributes( {
			products: {
				...products,
				[ product.id ]: {
					id: product.id,
					type: 'any',
					prices: product.prices.reduce( ( add, curr ) => {
						add[ curr.id ] = {
							quantity: 1,
							enabled: true,
						};
						return add;
					}, {} ),
				},
			},
		} );
		onRequestClose();
	};

	useEffect( () => {
		fetchProducts();
	}, [ query ] );

	const findProduct = throttle(
		( value ) => {
			setQuery( value );
		},
		750,
		{ leading: false }
	);

	const fetchProducts = async () => {
		let response;
		try {
			setLoading( true );
			response = await apiFetch( {
				path: addQueryArgs( 'checkout-engine/v1/products', {
					query,
					archived: false,
				} ),
			} );
			setProductsData( response );
		} finally {
			setLoading( false );
		}
	};

	return (
		<Modal
			css={ css`
				overflow: visible !important;
			` }
			shouldCloseOnClickOutside={ false }
			title={ __( 'Add Product', 'checkout_engine' ) }
			onRequestClose={ onRequestClose }
		>
			<div
				css={ css`
					display: flex;
					flex-direction: column;
					gap: 1em;
				` }
			>
				<CeSelect
					value={ product?.id }
					onCeChange={ ( e ) => {
						const productData = productsData.find(
							( product ) => product.id === e.target.value
						);
						setProduct( productData );
					} }
					loading={ loading }
					placeholder={ __( 'Choose a product', 'checkout_engine' ) }
					searchPlaceholder={ __(
						'Search for a product...',
						'checkout_engine'
					) }
					search
					onCeSearch={ ( e ) => findProduct( e.detail ) }
					choices={ ( productsData || [] ).map( ( product ) => {
						return {
							value: product.id,
							label: `${ product.name } ${
								product.prices.length > 1
									? `(${ product.prices.length } Prices)`
									: ''
							}`,
						};
					} ) }
				/>

				<div
					css={ css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					` }
				>
					<Button isPrimary onClick={ addProduct }>
						{ __( 'Add Product', 'checkout_engine' ) }
					</Button>
					<Button onClick={ onRequestClose }>
						{ __( 'Cancel', 'checkout_engine' ) }
					</Button>
				</div>
			</div>
		</Modal>
	);
};
