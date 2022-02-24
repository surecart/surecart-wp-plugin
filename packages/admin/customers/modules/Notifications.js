import { __ } from '@wordpress/i18n';
import { CeSwitch } from '@checkout-engine/components-react';

export default ({ customer, updateCustomer }) => {
	if (!customer) return '';

	return (
		<div>
			<CeSwitch
				checked={!customer?.unsubscribed}
				onCeChange={(e) => {
					console.log(e.target.checked);
					updateCustomer({ unsubscribed: !e.target.checked });
				}}
			>
				{__('Subscribed to emails', 'checkout_engine')}
			</CeSwitch>
		</div>
	);
};
