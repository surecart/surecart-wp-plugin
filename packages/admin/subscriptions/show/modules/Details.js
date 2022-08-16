/** @jsx jsx */
import { formatTime } from '../../../util/time';
import { css, jsx } from '@emotion/core';
import {
	ScFormatDate,
	ScSubscriptionStatusBadge,
} from '@surecart/components-react';
import { __, sprintf } from '@wordpress/i18n';

export default ({ subscription, customer, product, loading }) => {
	if (!subscription?.id) {
		return null;
	}

	const renderStartDate = () => {
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
					<ScFormatDate
						date={subscription.current_period_end_at}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					></ScFormatDate>
				</div>
			);
		}

		if (subscription?.ended_at) {
			return (
				<div>
					<div>
						<strong>{sprintf(__('Ended', 'surecart'))}</strong>
					</div>
					<ScFormatDate
						date={subscription.ended_at}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					></ScFormatDate>
				</div>
			);
		}

		if (subscription.status === 'trialing' && subscription.trial_end_at) {
			return (
				<div>
					<div>
						<strong>
							{sprintf(__('Trial ends on', 'surecart'))}
						</strong>
					</div>
					<ScFormatDate
						date={subscription?.current_period_end_at}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					></ScFormatDate>
				</div>
			);
		}
		if (
			['past_due', 'active'].includes(subscription?.status) &&
			subscription.current_period_end_at
		) {
			return (
				<div>
					<div>
						<strong>{sprintf(__('Renews on', 'surecart'))}</strong>
					</div>
					<ScFormatDate
						date={subscription.current_period_end_at}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					></ScFormatDate>
				</div>
			);
		}
	};

	if (loading) {
		return 'looding';
	}

	return (
		<div>
			<div
				css={css`
					display: flex;
					justify-content: space-between;
					align-items: center;
					gap: 2em;
					margin-bottom: 2em;
				`}
			>
				<div>
					<div
						css={css`
							display: flex;
							align-items: baseline;
							gap: 0.5em;
						`}
					>
						<h1>{customer?.email} </h1>
					</div>
					{__('Created on', 'surecart')}{' '}
					<ScFormatDate
						date={subscription.created_at}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					></ScFormatDate>
				</div>
				<div>
					<ScSubscriptionStatusBadge subscription={subscription} />
					{!subscription?.live_mode && (
						<sc-tag type="warning">
							{__('Test Mode', 'surecart')}{' '}
						</sc-tag>
					)}
				</div>
			</div>
			<div
				css={css`
					display: flex;
					justify-content: flex-start;
					align-items: center;
					gap: 1em;
					margin-bottom: 2em;
				`}
			>
				{renderStartDate()}
			</div>
		</div>
	);
};
