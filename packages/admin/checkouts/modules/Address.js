import AddressDisplay from '../../components/AddressDisplay';
import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScIcon,
	ScBlockUi,
	ScDialog,
	ScAddress
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { Notice } from '@wordpress/components';

export default ({ address = {}, label, loading, onAddressChange, busyCustomer, busy }) => {
	
	const [customerShippingAddress, setCustomerShippingAddress] = useState(false);
	const [open, setOpen] = useState(false);

	return (
		<>
		<Box 
			title={label || __('Address', 'surecart')} 
			loading={loading}
			header_action={
				<ScButton type="text" slot="trigger" circle onClick={() => setOpen(true)}>
					<ScIcon name="edit" />
				</ScButton>
			}
		>
			{
				0 !== address?.length ? (
					<AddressDisplay address={address} />
				) : (
					<div>
						<Notice status="warning" isDismissible={false}>
							{__('Update shipping address for creating a order.', 'surecart')}
						</Notice>
					</div>
				)
			}
			
			{(!!busy || !!busyCustomer ) && (
				<ScBlockUi spinner />
			)}
		</Box>
		<ScDialog
			label={__('Edit Shipping & Tax Address', 'surecart')}
			open={open}
			style={{ '--dialog-body-overflow': 'visible' }}
			onScRequestClose={() => setOpen(false)}
		>
			<ScAddress
				required={false}
				onScInputAddress={(e) => setCustomerShippingAddress(e?.detail)}
			/>
			{(!!busy || !!busyCustomer ) && (
				<ScBlockUi spinner />
			)}

			<ScButton
				type="primary"
				onClick={() => {
					onAddressChange(customerShippingAddress)
					setOpen(false)
				}}
				style={{
					marginTop: '17.5px'
				}}
			>
				{__('Update', 'surecart')}
			</ScButton>
		</ScDialog>
		</>
	);
};
