import { __, _n } from '@wordpress/i18n';
import { Disabled } from '@wordpress/components';
import { CeAddress } from '@checkout-engine/components-react';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;

	return (
		<div>
			<Disabled>
				<CeAddress
					label={label}
					shippingAddress={{
						country: 'US',
						line_1: '1234 Sesame Street',
						city: 'Kings Park',
						postal_code: '11754',
						state: 'NY',
					}}
				></CeAddress>
			</Disabled>
		</div>
	);
};
