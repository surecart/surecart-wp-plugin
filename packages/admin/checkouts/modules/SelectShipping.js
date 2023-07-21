import { css } from '@emotion/core';
import {
	ScRadioGroup,
	ScRadio,
	ScBlockUi,
	ScFormatNumber,
	ScDivider,
	ScAlert,
	ScChoices,
	ScChoice,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import expand from '../query';
import { useDispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

export default ({ checkout, busy, loading }) => {
	const [busyShipping, setBusyShipping] = useState(false);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { receiveEntityRecords, invalidateResolutionForStore } =
		useDispatch(coreStore);

	const onShippingChange = async (shippingId) => {
		try {
			setBusyShipping(true);

			// get the checkout endpoint.
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

			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setBusyShipping(false);
		}
	};

	if (!checkout?.selected_shipping_choice_required) {
		return null;
	}

	if (!checkout?.shipping_choices?.data?.length) {
		return (
			<Box title={__('Shipping', 'surecart')} loading={loading}>
				<ScAlert type="warning" open>
					{__(
						'This order has products that are not shippable to this address.',
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
					({ id, amount, currency, shipping_method }, index) => {
						return (
							<>
								<ScChoice
									key={id}
									value={id}
									checked={
										checkout?.selected_shipping_choice ===
										id
									}
								>
									{shipping_method?.name}

									<div slot="description">
										{shipping_method?.description}
									</div>

									<div slot="price">
										{0 === amount ? (
											__('Free', 'surecart')
										) : (
											<ScFormatNumber
												type="currency"
												currency={currency}
												value={amount}
											/>
										)}
									</div>
								</ScChoice>
							</>
						);
					}
				)}
			</ScChoices>

			{(!!busy || !!loading || !!busyShipping) && <ScBlockUi spinner />}
		</Box>
	);
};
