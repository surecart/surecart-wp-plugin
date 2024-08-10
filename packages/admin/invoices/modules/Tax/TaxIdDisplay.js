import { ScTag } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

const labels = {
	ca_gst: __('GST Number', 'surecart'),
	au_abn: __('ABN Number', 'surecart'),
	gb_vat: __('VAT Number', 'surecart'),
	eu_vat: __('VAT Number', 'surecart'),
};
export default ({ taxId }) => {
	const { number, number_type = 'other', valid_eu_vat } = taxId || {};
	return (
		<div>
			{labels?.[number_type] && (
				<div>
					<strong>{labels[number_type]}</strong>
				</div>
			)}

			<div>
				{number}{' '}
				{number_type === 'eu_vat' && !valid_eu_vat && (
					<ScTag type="danger" size="small">
						{__('Invalid', 'surecart')}
					</ScTag>
				)}
			</div>
		</div>
	);
};
