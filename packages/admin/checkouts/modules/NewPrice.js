import { ScButton, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch, select } from '@wordpress/data';
import expand from '../query';
import PriceSelector from '@admin/components/PriceSelector';

export default ({ checkout, setBusy }) => {
	const [price, setPrice] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createErrorNotice } = useDispatch(noticesStore);

	useEffect(() => {
		const { priceId, variantId } = price;
		if (priceId) {
			onSubmit(priceId, variantId ?? null);
		}
	}, [price]);

	const updateQuantity = async (id, data) => {
		try {
			setBusy(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'line_item'
			);

			const { checkout } = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${id}`, {
					expand: [
						// expand the checkout and the checkout's required expands.
						...(expand || []).map((item) => {
							return item.includes('.')
								? item
								: `checkout.${item}`;
						}),
						'checkout',
					],
				}),
				data,
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'draft-checkout',
				checkout,
				undefined,
				false,
				checkout
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setBusy(false);
		}
	};

	const onSubmit = async (priceId, variantId = null) => {
		try {
			setBusy(true);

			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'line_item'
			);

			// add the line item.
			const { checkout: data } = await apiFetch({
				method: 'POST',
				path: addQueryArgs(baseURL, {
					expand: [
						// expand the checkout and the checkout's required expands.
						...(expand || []).map((item) => {
							return item.includes('.')
								? item
								: `checkout.${item}`;
						}),
						'checkout',
					],
				}),
				data: {
					checkout: checkout?.id,
					price: priceId,
					quantity: 1,
					variant: variantId,
				},
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'draft-checkout',
				data,
				undefined,
				false,
				checkout
			);
			setPrice(false);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<PriceSelector
			value={price?.priceId}
			ad_hoc={true}
			onSelect={({ price_id, variant_id }) => {
				const variantExists = checkout?.line_items?.data?.find(
					(item) =>
						item?.variant === variant_id &&
						item?.price?.id === price_id
				);
				if (variantExists) {
					updateQuantity(variantExists?.id, {
						quantity: variantExists?.quantity + 1,
					});
					return;
				}
				setPrice({
					priceId: price_id,
					variantId: variant_id,
				});
			}}
			requestQuery={{
				archived: false,
			}}
		>
			<ScButton
				slot="trigger"
				type={
					checkout?.line_items?.data?.length ? 'default' : 'primary'
				}
			>
				<ScIcon name="plus" slot="prefix" />
				{__('Add Product', 'surecart')}
			</ScButton>
		</PriceSelector>
	);
};
