/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import {
	ScButton,
	ScCard,
	ScDropdown,
	ScFlex,
	ScFormControl,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScBlockUi
} from '@surecart/components-react';
import Box from '../../ui/Box';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import ModelSelector from '../../components/ModelSelector';
import useAvatar from '../../hooks/useAvatar';
import { store as uiStore } from '../../store/ui';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import expand from '../query';

export default ( {checkout, busy} ) => {
	const [busyCustomer, setBusyCustomer] = useState(false);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { receiveEntityRecords, invalidateResolutionForStore } = useDispatch(coreStore);
	const customer = checkout?.customer_id ? checkout?.customer : {};
	const avatarUrl = useAvatar({ email: customer?.email });

	const onCustomerUpdate = async (customerID = false) => {

		try {
			setBusyCustomer(true);
			// get the checkout endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'checkout'
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
					customer_id: customerID, // update the customer.
				},
			});
			const checkoutData = await apiFetch({
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
					customer_id: customerID,
					shipping_address: {
						...data?.customer?.shipping_address
					}, // update the shipping address for checkout.
				},
			});
			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'checkout',
				checkoutData,
				undefined,
				false,
				checkout
			);
			await invalidateResolutionForStore();
			createSuccessNotice(__('Customer updated.', 'surecart'), {
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
			setBusyCustomer(false);
		}
	};

	return (
		<Box title={__('Customer', 'surecart')}>
			<ScFormControl
				label={__('Select a Customer', 'surecart')}
				style={{ display: 'block' }}
			>
				{customer?.id ? (
					<ScCard>
						<ScFlex
							alignItems="center"
							justifyContent="space-between"
						>
							<ScFlex
								alignItems="center"
								justifyContent="flex-start"
							>
								<div>
									<img
										src={avatarUrl || ''}
										css={css`
											width: 36px;
											height: 36px;
											border-radius: var(
												--sc-border-radius-medium
											);
										`}
									/>
								</div>
								<div>
									<div>{customer?.name}</div>
									<div>{customer?.email}</div>
								</div>
							</ScFlex>

							<ScDropdown placement="bottom-end">
								<ScButton type="text" slot="trigger" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem
										onClick={() => { onCustomerUpdate()}}
									>
										<ScIcon
											slot="prefix"
											name="trash"
											style={{
												opacity: 0.5,
											}}
										/>
										{__('Remove', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						</ScFlex>
					</ScCard>
				) : (
					<ModelSelector
						name="customer"
						placeholder={__('Any Customer', 'surecart')}
						display={(item) =>
							`${!!item?.name ? `${item?.name} - ` : ''}${
								item.email
							}`
						}
						value={customer?.id || customer}
						onSelect={(customer) => {
							onCustomerUpdate(customer);
						}}
					/>
				)}
			</ScFormControl>

			{(!!busy || !!busyCustomer ) && (
				<ScBlockUi spinner />
			)}
		</Box>
	);
};
