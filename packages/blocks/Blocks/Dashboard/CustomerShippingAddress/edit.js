import { __, _n } from '@wordpress/i18n';
import { Disabled } from '@wordpress/components';
import { ScAddress } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;

	return (
		<div>
			<Disabled>
				<ScAddress
					label={label}
					shippingAddress={{
						country: 'US',
						line_1: '1234 Sesame Street',
						city: 'Kings Park',
						postal_code: '11754',
						state: 'NY',
					}}
				></ScAddress>
			</Disabled>
		</div>
	);
};
