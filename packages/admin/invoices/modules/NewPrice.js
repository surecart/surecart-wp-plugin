/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import PriceSelector from '@admin/components/PriceSelector';
import { ScButton, ScIcon } from '@surecart/components-react';
import { checkoutExpands } from '../Invoice';
import { useInvoice } from '../hooks/useInvoice';

export default () => {
	const { invoice, checkout, setBusy, receiveInvoice } = useInvoice();
	const [price, setPrice] = useState(false);
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

			const { checkout: checkoutUpdated } = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${id}`, {
					expand: checkoutExpands,
				}),
				data,
			});

			receiveInvoice({
				...invoice,
				checkout: checkoutUpdated,
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(e);
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
			const { checkout: checkoutUpdated } = await apiFetch({
				method: 'POST',
				path: addQueryArgs(baseURL, {
					expand: checkoutExpands,
				}),
				data,
			});

			receiveInvoice({
				...invoice,
				checkout: checkoutUpdated,
			});
			setPrice(false);
		} catch (e) {
			console.error(e);
			createErrorNotice(e);
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
