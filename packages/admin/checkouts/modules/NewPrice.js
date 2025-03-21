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

	const updateLineItem = async (id, data) => {
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
					context: 'edit',
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

	const addLineItem = async (data) => {
		try {
			setBusy(true);

			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'line_item'
			);

			// add the line item.
			const { checkout } = await apiFetch({
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
					context: 'edit',
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

	const onSubmit = async (priceId, variantId = null) => {
		const priceExists = checkout?.line_items?.data?.find(
			(item) => item?.price?.id === priceId
		);
		const variantExists = checkout?.line_items?.data?.find(
			(item) => item?.variant === variantId && item?.price?.id === priceId
		);
		if (variantExists) {
			updateLineItem(variantExists?.id, {
				quantity: variantExists?.quantity + 1,
			});
			return;
		}
		if (priceExists) {
			updateLineItem(priceExists?.id, {
				quantity: priceExists?.quantity + 1,
			});
			return;
		}
		addLineItem({
			checkout: checkout?.id,
			price: priceId,
			quantity: 1,
			variant: variantId,
		});
	};

	return (
		<PriceSelector
			value={price?.priceId}
			ad_hoc={true}
			onSelect={({ price_id, variant_id }) => {
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
