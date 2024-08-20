/**
 * External dependencies.
 */
import { useDispatch, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScFormControl,
	ScIcon,
	ScMenuItem,
	ScMenuDivider,
	ScButton,
} from '@surecart/components-react';
import expand from '../../checkout-query';
import Customer from './Customer';
import Box from '../../../ui/Box';
import CreateCustomer from './CreateCustomer';
import ModelSelector from '../../../components/ModelSelector';

export default ({
	invoice,
	onUpdateInvoiceEntityRecord,
	checkout,
	setBusy,
	loading,
	onSuccess,
	liveMode,
	isDraftInvoice,
}) => {
	const [modal, setModal] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);

	const onCustomerUpdate = async (customerID = false) => {
		if (!isDraftInvoice) {
			return;
		}

		try {
			setBusy(true);

			// get the checkout endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			// Update the customer.
			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand,
				}),
				data: {
					customer_id: customerID, // update the customer.
					...(!customerID
						? {
								// remove the customer data also if no customer is selected.
								customer: null,
								email: null,
						  }
						: {}),
					...(data?.customer?.shipping_address
						? { shipping_address: data.customer.shipping_address }
						: {}),
				},
			});

			onUpdateInvoiceEntityRecord({
				...invoice,
				checkout: data,
			});

			onSuccess();
		} catch (e) {
			console.error(e);
			createErrorNotice(e);
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
			{!!checkout?.customer_id ? (
				<Customer
					id={checkout?.customer_id}
					onChange={onCustomerUpdate}
					isDraftInvoice={isDraftInvoice}
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
