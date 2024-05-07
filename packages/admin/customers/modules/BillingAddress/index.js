import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import AddressDisplay from '../../../components/AddressDisplay';
import {
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';

export default ({
	billingAddress,
	loading,
	onEditAddress,
	onDeleteAddress,
}) => {
	return (
		<Box
			title={__('Billing Address', 'surecart')}
			header_action={
				!!billingAddress?.id && (
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
				!billingAddress?.id && (
					<ScButton onClick={onEditAddress}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Address', 'surecart')}
					</ScButton>
				)
			}
			loading={loading}
		>
			{!!billingAddress?.id ? (
				<ScFlex>
					<AddressDisplay address={billingAddress} />
				</ScFlex>
			) : null}
		</Box>
	);
};
