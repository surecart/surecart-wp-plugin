/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

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
import Customer from './Customer';
import Box from '../../../ui/Box';
import CreateCustomer from './CreateCustomer';
import ModelSelector from '../../../components/ModelSelector';
import { useInvoice } from '../../hooks/useInvoice';

export default () => {
	const [modal, setModal] = useState(false);
	const { invoice, checkout, loading, live_mode, updateCheckout } =
		useInvoice();

	const onCustomerUpdate = async (customerID = false) => {
		let data = await updateCheckout({
			customer_id: customerID,
			...(!customerID
				? {
						// remove the customer data also if no customer is selected.
						customer: null,
						email: null,
				  }
				: {}),
		});

		if (data?.customer?.shipping_address) {
			data = await updateCheckout({
				customer_id: customerID,
				shipping_address: data?.customer?.shipping_address,
			});
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
					isDraftInvoice={invoice?.status === 'draft'}
				/>
			) : (
				<ScFormControl
					label={__('Select a Customer', 'surecart')}
					style={{ display: 'block' }}
				>
					<ModelSelector
						name="customer"
						placeholder={__('Select a customer', 'surecart')}
						requestQuery={{ live_mode }}
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
					liveMode={live_mode}
				/>
			)}
		</Box>
	);
};
