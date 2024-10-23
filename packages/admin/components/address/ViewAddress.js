/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import AddressDisplay from '../AddressDisplay';

export default ({
	title,
	onEditAddress,
	onDeleteAddress,
	address,
	loading,
}) => {
	return (
		<Box
			title={title}
			loading={loading}
			header_action={
				!!address?.id && (
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
				!address?.id && (
					<ScButton onClick={onEditAddress}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Address', 'surecart')}
					</ScButton>
				)
			}
		>
			{!!address?.id ? (
				<ScFlex>
					<AddressDisplay address={address} />
				</ScFlex>
			) : null}
		</Box>
	);
};
