import { css } from '@emotion/core';
import {
	ScRadioGroup,
	ScRadio,
	ScBlockUi,
	ScFormatNumber,
	ScDivider,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import expand from '../query';
import { useDispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

export default ({ checkout, busy, loading }) => {
	const [busyShipping, setBusyShipping] = useState(false);
	const [shippingId, setShippingId] = useState(
		checkout?.selected_shipping_choice
	);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { receiveEntityRecords, invalidateResolutionForStore } =
		useDispatch(coreStore);

	useEffect(() => {
		if (shippingId && shippingId !== checkout?.selected_shipping_choice) {
			onShippingChange(shippingId);
		}
	}, [shippingId]);

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
			await invalidateResolutionForStore();
			createSuccessNotice(__('Shipping updated.', 'surecart'), {
				type: 'snackbar',
			});
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

	if (
		!checkout?.selected_shipping_choice_required ||
		!checkout?.shipping_choices?.data?.length
	) {
		return null;
	}

	return (
		<Box title={__('Shipping', 'surecart')} loading={loading}>
			<ScRadioGroup onScChange={(e) => setShippingId(e.target.value)}>
				{(checkout?.shipping_choices?.data || []).map(
					({ id, amount, currency, shipping_method }, index) => {
						const isLastElement =
							index !==
							checkout?.shipping_choices?.data?.length - 1;
						return (
							<>
								<ScRadio
									key={id}
									value={id}
									checked={
										shippingId
											? shippingId === id
											: checkout?.selected_shipping_choice ===
											  id
									}
									style={{
										padding: '14px',
										borderBottom: isLastElement
											? '1px solid #eaeaea'
											: '',
									}}
								>
									<div
										style={{
											display: 'flex',
											gap: '6em',
										}}
									>
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												gap: '0.6em',
											}}
										>
											<div>{shipping_method?.name}</div>
											<div>
												{shipping_method?.description}
											</div>
										</div>
										<div>
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
									</div>
								</ScRadio>
							</>
						);
					}
				)}
			</ScRadioGroup>
			{(!!busy || !!loading || !!busyShipping) && <ScBlockUi spinner />}
		</Box>
	);
};
