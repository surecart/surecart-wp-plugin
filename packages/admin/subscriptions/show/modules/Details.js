/** @jsx jsx */

import { __, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { formatTime } from '../../../util/time';
import {
	CeFormatDate,
	CeSubscriptionStatusBadge,
} from '@checkout-engine/components-react';

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
						<strong>
							{sprintf(__('Trial ends on', 'surecart'))}
						</strong>
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
						<p>
							{!!product &&
								sprintf(
									__('for %s', 'surecart'),
									product?.name
								)}
						</p>
					</div>
					{sprintf(
						__('Created on %s', 'surecart'),
						formatTime(subscription.created_at)
					)}
				</div>
				<div>
					<CeSubscriptionStatusBadge subscription={subscription} />
					{!subscription?.live_mode && (
						<ce-tag type="warning">
							{__('Test Mode', 'surecart')}{' '}
						</ce-tag>
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
				<div>
					<div>
						<strong>{__('Started', 'surecart')}</strong>
					</div>
					<CeFormatDate
						date={subscription.current_period_start_at}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					></CeFormatDate>
				</div>
				<div
					css={css`
						padding-left: 1em;
						border-left: 1px solid var(--ce-color-gray-500);
					`}
				>
					{renderStartDate()}
				</div>
			</div>
		</div>
	);
};
