import { ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';

export default ({ subscription, updateSubscription, loading }) => {
	// Only show for installment payments (finite subscriptions).
	if (!subscription?.finite) {
		return null;
	}

	return (
		<Box loading={loading} title={__('Subscription Settings', 'surecart')}>
			<ScSwitch
				checked={subscription?.restart_on_completed}
				onScChange={(e) =>
					updateSubscription({
						restart_on_completed: e?.target?.checked,
					})
				}
			>
				{__('Restart subscription when completed', 'surecart')}
				<span slot="description">
					{__(
						'Automatically restart the subscription after all installment payments are completed.',
						'surecart'
					)}
				</span>
			</ScSwitch>
		</Box>
	);
};
