import { ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { help } from '@wordpress/icons';
import Box from '../../../ui/Box';

export default ({ subscription, updateSubscription, loading }) => {
	// Only show for installment payments (finite subscriptions).
	if (
		!subscription?.finite ||
		['completed', 'canceled'].includes(subscription?.status)
	) {
		return null;
	}

	return (
		<Box
			loading={loading}
			title={__('Subscription Settings', 'surecart')}
			header_action={
				<div
					style={{
						margin: '-10px',
						opacity: 0.5,
					}}
				>
					<Button
						href="https://surecart.com/docs/managing-subscriptions/#restarting-installments-automatically"
						size="compact"
						icon={help}
						target="_blank"
						rel="noopener noreferrer"
						showTooltip={true}
						label={__('Learn More', 'surecart')}
					/>
				</div>
			}
		>
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
