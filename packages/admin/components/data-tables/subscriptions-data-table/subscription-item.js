import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import {
	CeButton,
	CeDropdown,
	CeFormatDate,
	CeIcon,
	CeMenu,
	CeMenuItem,
	CeSubscriptionStatusBadge,
} from '@checkout-engine/components-react';
import Cancel from './Cancel';
import UnCancel from './UnCancel';
import { select } from '@wordpress/data';
import { store } from '../../../store/data';
import { Fragment } from 'react';
import StartPlan from './StartPlan';

export default (subscription) => {
	const product = select(store).selectRelation(
		'subscription',
		subscription?.id,
		'price.product'
	);

	const renderPlan = (subscription) => {
		if (
			subscription?.cancel_at_period_end &&
			subscription.current_period_end_at
		) {
			return (
				<span>
					{__('Cancels', 'checkout_engine')}{' '}
					<ce-format-date
						type="timestamp"
						date={subscription.current_period_end_at}
						month="long"
						day="numeric"
						year="numeric"
					></ce-format-date>
				</span>
			);
		}

		if (subscription.status === 'trialing' && subscription.trial_end_at) {
			return (
				<span>
					{__('Begins', 'checkout_engine')}{' '}
					<ce-format-date
						type="timestamp"
						date={subscription.trial_end_at}
						month="long"
						day="numeric"
						year="numeric"
					></ce-format-date>
				</span>
			);
		}

		if (
			subscription.status === 'active' &&
			subscription.current_period_end_at
		) {
			return (
				<span>
					{__('Renews', 'checkout_engine')}{' '}
					<ce-format-date
						type="timestamp"
						date={subscription.current_period_end_at}
						month="long"
						day="numeric"
						year="numeric"
					></ce-format-date>
				</span>
			);
		}

		if (subscription?.status === 'canceled' && subscription?.ended_at) {
			return (
				<span>
					{__('Ended', 'checkout_engine')}{' '}
					<ce-format-date
						type="timestamp"
						date={subscription?.ended_at}
						month="long"
						day="numeric"
						year="numeric"
					></ce-format-date>
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
			<CeDropdown position="bottom-right">
				<CeButton type="text" slot="trigger" circle>
					<CeIcon name="more-horizontal" />
				</CeButton>
				<CeMenu>
					{subscription?.status === 'trialing' && (
						<StartPlan subscription={subscription}>
							<CeMenuItem>
								{__('Start Plan', 'checkout_engine')}
							</CeMenuItem>
						</StartPlan>
					)}

					{subscription?.cancel_at_period_end && (
						<UnCancel subscription={subscription}>
							<CeMenuItem>
								{__("Don't Cancel", 'checkout_engine')}
							</CeMenuItem>
						</UnCancel>
					)}

					{!subscription?.cancel_at_period_end && (
						<Cancel subscription={subscription}>
							<CeMenuItem>
								{__('Cancel', 'checkout_engine')}
							</CeMenuItem>
						</Cancel>
					)}
				</CeMenu>
			</CeDropdown>
		);
	};

	return {
		status: (
			<CeSubscriptionStatusBadge
				subscription={subscription}
			></CeSubscriptionStatusBadge>
		),
		product: (
			<a
				href={addQueryArgs('admin.php', {
					page: 'ce-products',
					action: 'edit',
					id: product?.id,
				})}
			>
				{product?.name}
			</a>
		),
		created: (
			<CeFormatDate
				date={subscription?.created_at}
				month="long"
				day="numeric"
				year="numeric"
				type="timestamp"
			></CeFormatDate>
		),
		plan: renderPlan(subscription),
		cancel: renderCancelButton(subscription),
		actions:
			subscription?.status === 'trialing'
				? renderActionButtons(subscription)
				: renderCancelButton(subscription),
		view: (
			<ce-button
				href={addQueryArgs('admin.php', {
					page: 'ce-subscriptions',
					action: 'edit',
					id: subscription?.id,
				})}
				size="small"
			>
				{__('View', 'checkout_engine')}
			</ce-button>
		),
	};
};
