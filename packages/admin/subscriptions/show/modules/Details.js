/** @jsx jsx */
import { formatTime } from '../../../util/time';
import { css, jsx } from '@emotion/core';
import {
	ScFlex,
	ScFormatDate,
	ScSkeleton,
	ScSubscriptionStatusBadge,
} from '@surecart/components-react';
import { __, sprintf } from '@wordpress/i18n';

export default ({ subscription, customer, product, loading }) => {
	const renderStartDate = () => {
		if (subscription?.status === 'canceled') return null;
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

	const renderRemainingPayments = () => {
		if (subscription?.remaining_period_count) {
			return (
				<div>
					<div>
						<strong>{__('Payments', 'surecart')}</strong>
					</div>
					{sprintf(
						__('%d Remaining', 'surecart'),
						subscription?.remaining_period_count
					)}
				</div>
			);
		}
	};

	if (loading) {
		return (
			<div>
				<ScFlex flexDirection="column" style={{ '--spacing': '1em' }}>
					<ScSkeleton style={{ width: '40%', height: '2em' }} />
					<ScSkeleton style={{ width: '50%' }} />
					<div></div>
					<ScSkeleton style={{ width: '5%' }} />
					<ScSkeleton style={{ width: '10%' }} />
				</ScFlex>
			</div>
		);
	}

	if (!subscription?.id) {
		return;
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
					{sprintf(
						__('Created on %s', 'surecart'),
						formatTime(subscription.created_at)
					)}
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
					gap: 2em;
					margin-bottom: 2em;
				`}
			>
				{renderStartDate()}
				{renderRemainingPayments()}
			</div>
		</div>
	);
};
