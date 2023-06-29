import AddressDisplay from '../../components/AddressDisplay';
import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
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
	ScDialog,
	ScAddress
} from '@surecart/components-react';
import { useState, useEffect } from '@wordpress/element';

export default ({ address = {}, label, loading, onAddressChange, busyCustomer, busy }) => {
	if (!loading && !address?.id) {
		return null;
	}

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
			<AddressDisplay address={address} />
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
