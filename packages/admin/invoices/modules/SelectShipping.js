/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScFormatNumber,
	ScAlert,
	ScChoices,
	ScChoice,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import expand from '../checkout-query';

export default ({
	invoice,
	checkout,
	setBusy,
	loading,
	onUpdateInvoiceEntityRecord,
}) => {
	const { createErrorNotice } = useDispatch(noticesStore);

	const onShippingChange = async (shippingId) => {
		try {
			setBusy(true);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand,
				}),
				data: {
					selected_shipping_choice: shippingId, // update the shipping choice.
					customer_id: checkout?.customer_id,
				},
			});

			onUpdateInvoiceEntityRecord({
				...invoice,
				checkout: data,
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(e);
		} finally {
			setBusy(false);
		}
	};

	if (!checkout?.selected_shipping_choice_required) {
		return null;
	}

	if (!checkout?.shipping_choices?.data?.length) {
		if (!checkout?.shipping_address?.country) {
			return (
				<Box title={__('Shipping', 'surecart')} loading={loading}>
					<ScAlert type="warning" open>
						{__(
							'Shipping is required. Please enter a shipping address.',
							'surecart'
						)}
					</ScAlert>
				</Box>
			);
		}
		return (
			<Box title={__('Shipping', 'surecart')} loading={loading}>
				<ScAlert type="warning" open>
					{__(
						'The products in this invoice cannot be shipped to the provided address.',
						'surecart'
					)}
				</ScAlert>
			</Box>
		);
	}

	if (invoice?.status !== 'draft') {
		return null;
	}

	return (
		<Box title={__('Shipping', 'surecart')} loading={loading}>
			<ScChoices onScChange={(e) => onShippingChange(e.target.value)}>
				{(checkout?.shipping_choices?.data || []).map(
					({ id, amount, currency, shipping_method }) => {
						return (
							<ScChoice
								key={id}
								value={id}
								checked={
									checkout?.selected_shipping_choice === id
								}
							>
								{shipping_method?.name ||
									__('Shipping', 'surecart')}

								{!!shipping_method?.description && (
									<div slot="description">
										{shipping_method?.description}
									</div>
								)}

								<div slot="price">
									{!!amount ? (
										<ScFormatNumber
											type="currency"
											currency={currency}
											value={amount}
										/>
									) : (
										__('Free', 'surecart')
									)}
								</div>
							</ScChoice>
						);
					}
				)}
			</ScChoices>
		</Box>
	);
};
