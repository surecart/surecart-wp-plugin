/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import {
	ScFormControl,
	ScIcon,
	ScMenuItem,
	ScBlockUi,
	ScMenuDivider,
} from '@surecart/components-react';
import Box from '../../../ui/Box';
import { useDispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import ModelSelector from '../../../components/ModelSelector';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useRef } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import expand from '../../query';
import Customer from './Customer';
import CreateCustomer from './CreateCustomer';

export default ({ checkout, busy, loading }) => {
	const name = useRef();
	const [busyCustomer, setBusyCustomer] = useState(false);
	const [modal, setModal] = useState(false);
	const [newCustomer, setNewCustomer] = useState(null);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);

	const onCustomerUpdate = async (customerID = false) => {
		try {
			setBusyCustomer(true);
			// get the checkout endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			// update the customer.
			let data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand,
				}),
				data: {
					customer_id: customerID, // update the customer.
				},
			});

			// maybe update the shipping address.
			if (data?.customer?.shipping_address) {
				data = await apiFetch({
					method: 'PATCH',
					path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
						expand,
					}),
					data: {
						customer_id: customerID, // update the customer.
						shipping_address: data?.customer?.shipping_address,
					},
				});
			}

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'draft-checkout',
				data,
				undefined,
				false,
				checkout
			);

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

	return (
		<Box title={__('Customer', 'surecart')} loading={loading}>
			{checkout?.customer_id ? (
				<Customer
					id={checkout?.customer_id}
					onChange={onCustomerUpdate}
				/>
			) : (
				<ScFormControl
					label={__('Select a Customer', 'surecart')}
					style={{ display: 'block' }}
				>
					<ModelSelector
						name="customer"
						placeholder={__('Select a customer', 'surecart')}
						requestQuery={{ live_mode: false }} // TODO: change to live.
						required
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
						onSelect={(customer) => onCustomerUpdate(customer)}
					/>
				</ScFormControl>
			)}

			<CreateCustomer
				open={modal}
				onRequestClose={() => setModal(false)}
				onCreate={onCustomerUpdate}
			/>

			{(!!busy || !!loading || !!busyCustomer) && <ScBlockUi spinner />}
		</Box>
	);
};
