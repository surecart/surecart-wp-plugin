import AddressDisplay from '../../components/AddressDisplay';
import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScIcon,
	ScBlockUi,
	ScDialog,
	ScAddress,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';

export default ({
	address = {},
	label,
	loading,
	onAddressChange,
	busyCustomer,
	busy,
}) => {
	const [customerShippingAddress, setCustomerShippingAddress] =
		useState(false);
	const [open, setOpen] = useState(false);

	return (
		<>
			<Box
				title={label || __('Address', 'surecart')}
				loading={loading}
				header_action={
					<ScButton
						type="text"
						slot="trigger"
						circle
						onClick={() => {
							console.log(address);
							if (address && 0 !== address?.length) {
								setCustomerShippingAddress(address);
							}
							setOpen(true);
						}}
					>
						<ScIcon name="edit" />
					</ScButton>
				}
			>
				{address && 0 !== address?.length ? (
					<AddressDisplay address={address} />
				) : (
					<span
						style={{
							fontStyle: 'italic',
							color: 'var(--sc-color-gray-500)',
						}}
					>
						{__('Nothing to show here.', 'surecart')}
					</span>
				)}
				{(!!busy || !!busyCustomer) && <ScBlockUi spinner />}
			</Box>

			<ScDialog
				label={__('Edit Shipping & Tax Address', 'surecart')}
				open={open}
				style={{ '--dialog-body-overflow': 'visible' }}
				onScRequestClose={() => setOpen(false)}
			>
				<ScAddress
					required={false}
					address={customerShippingAddress}
					onScInputAddress={(e) =>
						setCustomerShippingAddress(e?.detail)
					}
				/>

				<ScButton
					type="text"
					onClick={() => setOpen(false)}
					slot="footer"
				>
					{__('Cancel', 'surecart')}
				</ScButton>

				<ScButton
					type="primary"
					onClick={() => {
						onAddressChange(customerShippingAddress);
						setOpen(false);
					}}
					slot="footer"
				>
					{__('Update', 'surecart')}
				</ScButton>

				{(!!busy || !!busyCustomer) && <ScBlockUi spinner />}
			</ScDialog>
		</>
	);
};
