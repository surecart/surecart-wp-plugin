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
	ScText,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import expand from '../checkout-query';

export default ({ checkout, setBusy, loading, isDraftInvoice }) => {
	const { createErrorNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);

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

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'draft-checkout',
				data,
				undefined,
				false,
				checkout
			);
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

	if (!isDraftInvoice) {
		if (
			!checkout?.shipping_choices?.data?.length ||
			!checkout?.selected_shipping_choice
		) {
			return null;
		}

		const selectedShippingMethod = checkout?.shipping_choices?.data?.find(
			({ id }) => id === checkout?.selected_shipping_choice
		);

		return (
			<Box title={__('Shipping', 'surecart')} loading={loading}>
				<div
					css={css`
						display: flex;
						justify-content: space-between;
					`}
				>
					<div>
						<ScText tag="strong">
							{selectedShippingMethod?.shipping_method?.name ||
								__('Shipping', 'surecart')}
						</ScText>

						{!!selectedShippingMethod?.shipping_method
							?.description && (
							<ScText
								css={css`
									font-size: 0.9em;
									color: var(--sc-color-gray-600);
								`}
							>
								{
									selectedShippingMethod?.shipping_method
										?.description
								}
							</ScText>
						)}
					</div>

					<div>
						<ScFormatNumber
							type="currency"
							currency={
								checkout?.shipping_choices?.data?.find(
									({ id }) =>
										id ===
										checkout?.selected_shipping_choice
								)?.currency
							}
							value={
								checkout?.shipping_choices?.data?.find(
									({ id }) =>
										id ===
										checkout?.selected_shipping_choice
								)?.amount
							}
						/>
					</div>
				</div>
			</Box>
		);
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
