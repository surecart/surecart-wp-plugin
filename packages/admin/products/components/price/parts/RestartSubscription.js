import { ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ price, updatePrice }) => {
	if (!price?.recurring_period_count) {
		return null;
	}

	return (
		<div>
			<ScSwitch
				checked={price?.restart_subscription_on_completed}
				onScChange={(e) =>
					updatePrice({
						restart_subscription_on_completed: e?.target?.checked,
					})
				}
			>
				{__('Restart plan when completed', 'surecart')}
				<span slot="description">
					{__(
						'Automatically restart the plan after all installment payments are completed.',
						'surecart'
					)}
				</span>
			</ScSwitch>
		</div>
	);
};
