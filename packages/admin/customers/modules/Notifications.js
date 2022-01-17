import { __ } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import { CeSwitch } from '@checkout-engine/components-react';

export default () => {
	const { customer, updateCustomer } = useCustomerData();
	if (!customer) return '';

	return (
		<div>
			<CeSwitch
				checked={!customer?.unsubscribed}
				onCeChange={(e) =>
					updateCustomer({ unsubscribed: !e.target.checked })
				}
			>
				{__('Subscribed to emails', 'checkout_engine')}
			</CeSwitch>
		</div>
	);
};
