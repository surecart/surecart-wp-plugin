import { __ } from '@wordpress/i18n';
import { ScSwitch } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ customer, updateCustomer, loading }) => {
	if (!customer) return '';

	return (
		<Box title={__('Notifications', 'surecart')} loading={loading}>
			<ScSwitch
				checked={!customer?.unsubscribed}
				onScChange={(e) =>
					updateCustomer({ unsubscribed: !e.target.checked })
				}
			>
				{__('Subscribed to emails', 'surecart')}
			</ScSwitch>
		</Box>
	);
};
