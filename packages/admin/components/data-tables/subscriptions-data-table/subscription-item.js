import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import {
	ScButton,
	ScDropdown,
	ScFormatDate,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScSubscriptionStatusBadge,
} from '@surecart/components-react';
import Cancel from './Cancel';
import UnCancel from './UnCancel';
import StartPlan from './StartPlan';

export default (subscription) => {
	const product = subscription?.price?.product;

	const renderPlan = (subscription) => {
		if (
			subscription?.cancel_at_period_end &&
			subscription.current_period_end_at
		) {
			return (
				<span>
					{__('Cancels', 'surecart')}{' '}
					<sc-format-date
						type="timestamp"
						date={subscription?.current_period_end_at}
						month="short"
						day="numeric"
						year="numeric"
					></sc-format-date>
				</span>
			);
		}

		if (subscription?.status === 'trialing' && subscription?.trial_end_at) {
			return (
				<span>
					{__('Begins', 'surecart')}{' '}
					<sc-format-date
						type="timestamp"
						date={subscription?.trial_end_at}
						month="short"
						day="numeric"
						year="numeric"
					></sc-format-date>
				</span>
			);
		}

		if (
			subscription?.status === 'active' &&
			subscription?.current_period_end_at
		) {
			return (
				<span>
					{__('Renews', 'surecart')}{' '}
					<sc-format-date
						type="timestamp"
						date={subscription?.current_period_end_at}
						month="short"
						day="numeric"
						year="numeric"
					></sc-format-date>
				</span>
			);
		}

		if (subscription?.status === 'canceled' && subscription?.ended_at) {
			return (
				<span>
					{__('Ended', 'surecart')}{' '}
					<sc-format-date
						type="timestamp"
						date={subscription?.ended_at}
						month="short"
						day="numeric"
						year="numeric"
					></sc-format-date>
				</span>
			);
		}
	};

	const renderCancelButton = () => {
		if (!['active', 'trialing'].includes(subscription?.status)) {
			return null;
		}

		if (subscription?.cancel_at_period_end) {
			return <UnCancel subscription={subscription} />;
		}

		return <Cancel subscription={subscription} />;
	};

	const renderActionButtons = () => {
		return (
			<ScDropdown position="bottom-right">
				<ScButton type="text" slot="trigger" circle>
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					{subscription?.status === 'trialing' && (
						<StartPlan subscription={subscription}>
							<ScMenuItem>
								{__('Start Plan', 'surecart')}
							</ScMenuItem>
						</StartPlan>
					)}

					{subscription?.cancel_at_period_end && (
						<UnCancel subscription={subscription}>
							<ScMenuItem>
								{__("Don't Cancel", 'surecart')}
							</ScMenuItem>
						</UnCancel>
					)}

					{!subscription?.cancel_at_period_end && (
						<Cancel subscription={subscription}>
							<ScMenuItem>{__('Cancel', 'surecart')}</ScMenuItem>
						</Cancel>
					)}
				</ScMenu>
			</ScDropdown>
		);
	};

	return {
		status: (
			<ScSubscriptionStatusBadge
				subscription={subscription}
			></ScSubscriptionStatusBadge>
		),
		product: (
			<a
				href={addQueryArgs('admin.php', {
					page: 'sc-products',
					action: 'edit',
					id: product?.id,
				})}
			>
				{product?.name}
			</a>
		),
		created: (
			<ScFormatDate
				date={subscription?.created_at}
				month="short"
				day="numeric"
				year="numeric"
				type="timestamp"
			></ScFormatDate>
		),
		plan: renderPlan(subscription),
		cancel: renderCancelButton(subscription),
		actions:
			subscription?.status === 'trialing'
				? renderActionButtons(subscription)
				: renderCancelButton(subscription),
		view: (
			<sc-button
				href={addQueryArgs('admin.php', {
					page: 'sc-subscriptions',
					action: 'show',
					id: subscription?.id,
				})}
				size="small"
			>
				{__('View', 'surecart')}
			</sc-button>
		),
	};
};
