import { __, _n } from '@wordpress/i18n';
import { ScLineItem, ScTag } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ taxIdentifier, loading }) => {
	const zones = {
		ca_gst: __('CA GST', 'surecart'),
		au_abn: __('AU ABN', 'surecart'),
		gb_vat: __('UK VAT', 'surecart'),
		eu_vat: __('EU VAT', 'surecart'),
		other: __('Other', 'surecart'),
	};
	return (
		<Box title={__('Tax Information', 'surecart')} loading={loading}>
			<ScLineItem>
				<span slot="title">{__('Tax Number', 'surecart')}</span>
				<span slot="price">{taxIdentifier?.number}</span>
			</ScLineItem>
			<ScLineItem>
				<span slot="title">{__('Number Type', 'surecart')}</span>
				<span slot="price">
					{zones?.[taxIdentifier?.number_type] ||
						__('Other', 'surecart')}
				</span>
			</ScLineItem>
			{taxIdentifier?.number_type === 'eu_vat' && (
				<ScLineItem>
					<span slot="title">{__('Validity', 'surecart')}</span>
					{taxIdentifier?.valid_eu_vat ? (
						<ScTag slot="price">{__('Valid', 'surecart')}</ScTag>
					) : taxIdentifier?.eu_vat_verified ? (
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
	);
};
