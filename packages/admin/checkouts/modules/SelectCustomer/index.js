import {
	ScFormControl,
	ScIcon,
	ScMenuItem,
	ScMenuDivider,
	ScButton,
} from '@surecart/components-react';
import Box from '../../../ui/Box';
import { useDispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import ModelSelector from '../../../components/ModelSelector';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import expand from '../../query';
import Customer from './Customer';
import CreateCustomer from './CreateCustomer';

export default ({ checkout, setBusy, loading, onSuccess, liveMode }) => {
	const [modal, setModal] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);

	const onCustomerUpdate = async (customerID = false) => {
		try {
			setBusy(true);

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

			onSuccess();
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
			(e?.additional_errors || []).map((e) => {
				if (e?.message) {
					createErrorNotice(e.message, {
						type: 'snackbar',
					});
				}
			});
		} finally {
			setBusy(false);
		}
	};

	return (
		<Box
			title={__('Customer', 'surecart')}
			loading={loading}
			footer={
				!!checkout?.customer_id && (
					<ScButton
						size="small"
						target="_blank"
						href={addQueryArgs('admin.php', {
							page: 'sc-customers',
							action: 'edit',
							id: checkout?.customer_id,
						})}
					>
						{__('View Customer', 'surecart')}
					</ScButton>
				)
			}
		>
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
						requestQuery={{ live_mode: liveMode }}
						required
						prefix={
							<div slot="prefix">
								<ScMenuItem onClick={() => setModal(true)}>
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

			{modal && (
				<CreateCustomer
					onRequestClose={() => setModal(false)}
					onCreate={onCustomerUpdate}
					liveMode={liveMode}
				/>
			)}
		</Box>
	);
};
