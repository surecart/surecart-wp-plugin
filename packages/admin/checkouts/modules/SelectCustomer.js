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
	ScBlockUi,
	ScMenuDivider,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import { useDispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import ModelSelector from '../../components/ModelSelector';
import useAvatar from '../../hooks/useAvatar';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useRef } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { Modal } from '@wordpress/components';
import expand from '../query';

export default ({ checkout, busy, loading }) => {
	const name = useRef();
	const [busyCustomer, setBusyCustomer] = useState(false);
	const [modal, setModal] = useState(false);
	const [newCustomer, setNewCustomer] = useState(null);
	const updateNewCustomer = (data) =>
		setNewCustomer({
			...(newCustomer || {}),
			...data,
		});
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { receiveEntityRecords, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const customer = checkout?.customer_id ? checkout?.customer : {};
	const avatarUrl = useAvatar({ email: customer?.email });
	const { saveEntityRecord } = useDispatch(coreStore);

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
						...data?.customer?.shipping_address,
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
			setModal(false);
			setBusyCustomer(false);
		}
	};

	const onSubmit = async () => {
		try {
			setBusyCustomer(true);
			const customer = await saveEntityRecord(
				'surecart',
				'customer',
				newCustomer,
				{
					throwOnError: true,
				}
			);
			onCustomerUpdate(customer?.id);
			createSuccessNotice(__('Customer created.', 'surecart'), {
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
		}
	};

	return (
		<Box title={__('Customer', 'surecart')} loading={loading}>
			{customer?.id ? (
				<ScCard>
					<ScFlex alignItems="center" justifyContent="space-between">
						<ScFlex alignItems="center" justifyContent="flex-start">
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
									onClick={() => {
										onCustomerUpdate();
									}}
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
				<ScFormControl
					label={__('Select a Customer', 'surecart')}
					style={{ display: 'block' }}
				>
					<ModelSelector
						name="customer"
						placeholder={__('Any Customer', 'surecart')}
						requestQuery={{ live_mode: false }} // TODO: change to live.
						prefix={
							<div slot="prefix">
								<ScMenuItem
									onClick={() => {
										setModal(true);
										setTimeout(() => {
											name.current.triggerFocus();
										}, 50);
									}}
								>
									<ScIcon slot="prefix" name="plus" />
									{__('Add New', 'surecart')}
								</ScMenuItem>
								<ScMenuDivider />
							</div>
						}
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
				</ScFormControl>
			)}
			{!!modal && (
				<Modal
					title={__('Add Customer', 'surecart')}
					css={css`
						max-width: 500px !important;
					`}
					onRequestClose={() => setModal(false)}
					shouldCloseOnClickOutside={false}
				>
					<ScForm
						onScFormSubmit={onSubmit}
						css={css`
							--sc-form-row-spacing: var(--sc-spacing-large);
						`}
					>
						<ScInput
							ref={name}
							label={__('First Name', 'surecart')}
							type="text"
							onScInput={(e) =>
								updateNewCustomer({
									first_name: e.target.value,
								})
							}
							tabIndex="0"
							autofocus
						/>

						<ScInput
							label={__('Last Name', 'surecart')}
							onScInput={(e) =>
								updateNewCustomer({ last_name: e.target.value })
							}
							tabIndex="0"
							type="text"
						/>

						<ScInput
							label={__('Email', 'surecart')}
							type="email"
							onScInput={(e) =>
								updateNewCustomer({ email: e.target.value })
							}
							tabIndex="0"
							required
						/>

						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<ScButton type="primary" busy={busyCustomer} submit>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								type="text"
								onClick={() => setModal(false)}
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
					</ScForm>
				</Modal>
			)}
			{(!!busy || !!loading || !!busyCustomer) && <ScBlockUi spinner />}
		</Box>
	);
};
