import { __ } from '@wordpress/i18n';
import { ScSwitch } from '@surecart/components-react';

export default ({ customer, updateCustomer }) => {
	if (!customer) return '';

	return (
		<div>
			<ScSwitch
				checked={!customer?.unsubscribed}
				onScChange={(e) => {
					console.log(e.target.checked);
					updateCustomer({ unsubscribed: !e.target.checked });
				}}
			>
				{__('Subscribed to emails', 'surecart')}
			</ScSwitch>
		</div>
	);
};
