/** @jsx jsx */

import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { Button, Modal } from '@wordpress/components';
import { css, jsx } from '@emotion/core';

import throttle from 'lodash/throttle';

import { CeSelect } from '@checkout-engine/components-react';
import { convertPricesToChoices } from '../../../utils/prices';
import { useSelect, dispatch, select } from '@wordpress/data';
import { BLOCKS_STORE_KEY } from '../store';
import SelectProduct from '../../../components/SelectProduct';

export default ({ onRequestClose, onChoose }) => {
	const [product, setProduct] = useState({});
	const [query, setQuery] = useState('');
	const [busy, setBusy] = useState(false);

	const { products, querying } = useSelect(
		(select) => {
			const { isResolving, searchProducts } = select(BLOCKS_STORE_KEY);
			return {
				products: searchProducts(query),
				querying: isResolving('searchProducts', [query]),
			};
		},
		[query]
	);

	/**
	 * Does the product have all loaded prices?
	 */
	const productHasAllPrices = (product) => {
		// get all loaded prices by product id.
		const prices = select(BLOCKS_STORE_KEY).selectPricesByProductId(
			product.id
		);
		// do the unarchived prices we have loaded match the prices_count metric?
		return (
			Object.keys(prices || {}).filter((key) => !prices[key].archived)
				.length === product.metrics.prices_count
		);
	};

	// add the product to the choices.
	const addProduct = async () => {
		// product needs to fetch the additional prices that were not included in the embedded collection.
		if (!productHasAllPrices(product)) {
			setBusy(true);
			try {
				// fetch product's prices.
				const pricesResponse = await apiFetch({
					path: addQueryArgs('checkout-engine/v1/prices', {
						product_ids: [product.id],
						archived: false,
					}),
				});
				dispatch(BLOCKS_STORE_KEY).setPrices(pricesResponse);
			} finally {
				setBusy(false);
			}
		}

		// get prices from redux store.
		const prices = select(BLOCKS_STORE_KEY).selectPricesByProductId(
			product.id
		);

		onChoose(convertPricesToChoices(prices));

		onRequestClose();
	};

	const findProduct = throttle(
		(value) => {
			setQuery(value);
		},
		750,
		{ leading: false }
	);

	return (
		<Modal
			css={css`
				overflow: visible !important;
			`}
			shouldCloseOnClickOutside={false}
			title={__('Add Product', 'checkout_engine')}
			onRequestClose={onRequestClose}
		>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 1em;
				`}
			>
				<SelectProduct onSelect={(product) => setProduct(product)} />
				{/* <CeSelect
					value={ product?.id }
					onCeChange={ ( e ) => {
						setProduct( products?.[ e.target.value ] );
					} }
					loading={ querying }
					placeholder={ __( 'Choose a product', 'checkout_engine' ) }
					searchPlaceholder={ __(
						'Search for a product...',
						'checkout_engine'
					) }
					search
					onCeSearch={ ( e ) => findProduct( e.detail ) }
					choices={ ( Object.keys( products ) || {} ).map(
						( key ) => {
							const product = products[ key ];
							return {
								value: key,
								label: `${ product?.name } ${
									product?.metrics?.prices_count > 1
										? `(${ product?.metrics?.prices_count } Prices)`
										: ''
								}`,
							};
						}
					) }
				/> */}

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<Button isPrimary isBusy={busy} onClick={addProduct}>
						{__('Add Product', 'checkout_engine')}
					</Button>
					<Button variant="link" onClick={onRequestClose}>
						{__('Cancel', 'checkout_engine')}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
