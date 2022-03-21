import { CeFormatDate } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ subscription }) => {
	if (subscription?.current_period_end_at == null) {
		return (
			<div>
				<div>
					<strong>{sprintf(__('Lifetime', 'surecart'))}</strong>
				</div>
				{__('Lifetime Subscription', 'surecart')}
			</div>
		);
	}

	if (
		subscription?.cancel_at_period_end &&
		subscription.current_period_end_at
	) {
		return (
			<div>
				<div>
					<strong>{sprintf(__('Cancels on', 'surecart'))}</strong>
				</div>
				<CeFormatDate
					date={subscription.current_period_end_at}
					type="timestamp"
					month="long"
					day="numeric"
					year="numeric"
				></CeFormatDate>
			</div>
		);
	}

	if (subscription?.ended_at) {
		return (
			<div>
				<div>
					<strong>{sprintf(__('Ended', 'surecart'))}</strong>
				</div>
				<CeFormatDate
					date={subscription.ended_at}
					type="timestamp"
					month="long"
					day="numeric"
					year="numeric"
				></CeFormatDate>
			</div>
		);
	}

	if (subscription.status === 'trialing' && subscription.trial_end_at) {
		return (
			<div>
				<div>
					<strong>{sprintf(__('Trial ends on', 'surecart'))}</strong>
				</div>
				<CeFormatDate
					date={subscription?.current_period_end_at}
					type="timestamp"
					month="long"
					day="numeric"
					year="numeric"
				></CeFormatDate>
			</div>
		);
	}
	if (
		subscription.status === 'active' &&
		subscription.current_period_end_at
	) {
		return (
			<div>
				<div>
					<strong>{sprintf(__('Renews on', 'surecart'))}</strong>
				</div>
				<CeFormatDate
					date={subscription.current_period_end_at}
					type="timestamp"
					month="long"
					day="numeric"
					year="numeric"
				></CeFormatDate>
			</div>
		);
	}
};
