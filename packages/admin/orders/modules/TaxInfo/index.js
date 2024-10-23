import { __, _n } from '@wordpress/i18n';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScLineItem,
	ScMenu,
	ScMenuItem,
	ScTag,
} from '@surecart/components-react';
import Box from '../../../ui/Box';
import { useState } from '@wordpress/element';
import EditTaxInfo from './EditTaxInfo';

export default ({ loading, checkout, onManuallyRefetchOrder }) => {
	const [isEditing, setIsEditing] = useState(false);
	const zones = {
		ca_gst: __('CA GST', 'surecart'),
		au_abn: __('AU ABN', 'surecart'),
		gb_vat: __('UK VAT', 'surecart'),
		eu_vat: __('EU VAT', 'surecart'),
		other: __('Other', 'surecart'),
	};
	return (
		<>
			<Box
				title={__('Tax Information', 'surecart')}
				loading={loading}
				header_action={
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
							<ScMenuItem onClick={() => setIsEditing(true)}>
								<ScIcon
									slot="prefix"
									name="edit"
									style={{
										opacity: 0.5,
									}}
								/>
								{__('Edit', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				}
			>
				<ScLineItem>
					<span slot="title">{__('Tax Number', 'surecart')}</span>
					<span slot="price">
						{checkout?.tax_identifier?.number || '-'}
					</span>
				</ScLineItem>
				<ScLineItem>
					<span slot="title">{__('Number Type', 'surecart')}</span>
					<span slot="price">
						{zones?.[checkout?.tax_identifier?.number_type] || '-'}
					</span>
				</ScLineItem>
				{checkout?.tax_identifier?.number_type === 'eu_vat' && (
					<ScLineItem>
						<span slot="title">{__('Validity', 'surecart')}</span>
						{checkout?.tax_identifier?.valid_eu_vat ? (
							<ScTag slot="price">
								{__('Valid', 'surecart')}
							</ScTag>
						) : checkout?.tax_identifier?.eu_vat_verified ? (
							<ScTag slot="price" type="danger">
								{__('Invalid', 'surecart')}
							</ScTag>
						) : (
							<ScTag slot="price" type="warning">
								{__('Unverified', 'surecart')}
							</ScTag>
						)}
					</ScLineItem>
				)}
			</Box>
			<EditTaxInfo
				open={isEditing}
				onRequestClose={() => setIsEditing(false)}
				checkout={checkout}
				onManuallyRefetchOrder={onManuallyRefetchOrder}
			/>
		</>
	);
};
