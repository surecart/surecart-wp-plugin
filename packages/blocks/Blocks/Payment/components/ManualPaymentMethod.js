import {
	ScCard,
	ScPaymentMethodChoice,
	ScPaymentSelected,
} from '@surecart/components-react';
import { sprintf, __ } from '@wordpress/i18n';

export default ({ attributes: { disabled_methods }, method }) => {
	if ((disabled_methods || []).includes(method?.id)) {
		return null;
	}
	return (
		<ScPaymentMethodChoice processor-id={method?.id} isManual>
			<span slot="summary" class="sc-payment-toggle-summary">
				{method?.name}
			</span>
			<ScCard>
				<ScPaymentSelected
					label={sprintf(
						__('%s selected for check out.', 'surecart'),
						method?.name
					)}
				>
					{method?.description}
				</ScPaymentSelected>
			</ScCard>
		</ScPaymentMethodChoice>
	);
};
