import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import {
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import AddressDisplay from '../../../components/AddressDisplay';

export default ({
	onEditAddress,
	onDeleteAddress,
	shippingAddress,
	loading,
}) => {
	return (
		<Box
			title={__('Shipping & Tax Address', 'surecart')}
			loading={loading}
			header_action={
				!!shippingAddress?.id && (
					<ScDropdown placement="bottom-end">
						<ScButton
							circle
							type="text"
							style={{
								'--button-color': 'var(--sc-color-gray-600)',
								margin: '-10px',
							}}
							slot="trigger"
						>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem onClick={onEditAddress}>
								<ScIcon
									slot="prefix"
									name="edit"
									style={{
										opacity: 0.5,
									}}
								/>
								{__('Edit', 'surecart')}
							</ScMenuItem>
							<ScMenuItem onClick={onDeleteAddress}>
								<ScIcon
									slot="prefix"
									name="trash"
									style={{
										opacity: 0.5,
									}}
								/>
								{__('Delete', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				)
			}
			footer={
				!loading &&
				!shippingAddress?.id && (
					<ScButton onClick={onEditAddress}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Address', 'surecart')}
					</ScButton>
				)
			}
		>
			{!!shippingAddress?.id ? (
				<ScFlex>
					<AddressDisplay address={shippingAddress} />
				</ScFlex>
			) : null}
		</Box>
	);
};
