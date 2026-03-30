import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { Button, Modal } from '@wordpress/components';

import { convertPricesToChoices } from '../../../utils/prices';
import { dispatch, select } from '@wordpress/data';
import { BLOCKS_STORE_KEY } from '../store';
import SelectProduct from '../../../components/SelectProduct';

export default ({ onRequestClose, onChoose }) => {
	const [product, setProduct] = useState({});
	const [busy, setBusy] = useState(false);

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
					path: addQueryArgs('surecart/v1/prices', {
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

	return (
		<Modal
			style={{
				overflow: 'visible',
			}}
			shouldCloseOnClickOutside={false}
			title={__('Add Product', 'surecart')}
			onRequestClose={onRequestClose}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1em',
				}}
			>
				<SelectProduct onSelect={(product) => setProduct(product)} />

				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '0.5em',
					}}
				>
					<Button
						variant="primary"
						isBusy={busy}
						onClick={addProduct}
					>
						{__('Add Product', 'surecart')}
					</Button>
					<Button variant="link" onClick={onRequestClose}>
						{__('Cancel', 'surecart')}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
