/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import Box from '../../ui/Box';
import { translateInterval } from '../../util/translations';
import { CeButton } from '@surecart/components-react';
import Definition from '../../ui/Definition';

import useSubscriptionItemsData from '../hooks/useSubscriptionItemsData';
import useSubscriptionData from '../hooks/useSubscriptionData';

export default () => {
	const { subscription, loading } = useSubscriptionData();
	const { items } = useSubscriptionItemsData();

	const renderLoading = () => {
		return <ce-skeleton></ce-skeleton>;
	};

	const renderRefund = (
		<Fragment>
			<div>
				<CeButton>Refund</CeButton>
			</div>
			<div>
				{/* { [ 'finalized', 'paid' ].includes( subscription?.status ) &&
					__(
						'This subscription is no longer editable',
						'surecart'
					) } */}
			</div>
		</Fragment>
	);

	return (
		<Box
			title={__('Subscription Details', 'surecart')}
			footer={renderRefund}
		>
			{loading ? (
				renderLoading()
			) : (
				<Fragment>
					{(items || []).map((item, index) => {
						return (
							<ce-product-line-item
								key={item.id}
								imageUrl={
									item?.price?.metadata?.wp_attachment_src
								}
								name={`${item?.price?.product?.name} \u2013 ${item?.price?.name}`}
								editable={false}
								removable={false}
								quantity={item.quantity}
								amount={
									item.ad_hoc_amount !== null
										? item.ad_hoc_amount
										: item.price.amount
								}
								currency={item?.price?.currency}
								trialDurationDays={
									item?.price?.trial_duration_days
								}
								interval={translateInterval(
									item?.price?.recurring_interval_count,
									item?.price?.recurring_interval
								)}
							></ce-product-line-item>
						);
					})}

					<hr />

					<Definition title={__('Subtotal', 'order')}>
						<ce-format-number
							style={{
								'font-weight': 'var(--ce-font-weight-semibold)',
								color: 'var(--ce-color-gray-800)',
							}}
							type="currency"
							currency={subscription?.currency}
							value={subscription?.subtotal_amount}
						></ce-format-number>
					</Definition>
					<Definition title={__('Discounts', 'order')}>
						<ce-format-number
							style={{
								'font-weight': 'var(--ce-font-weight-semibold)',
								color: 'var(--ce-color-gray-800)',
							}}
							type="currency"
							currency={subscription?.currency}
							value={subscription?.discount_amount}
						></ce-format-number>
					</Definition>

					<hr />

					<Definition title={__('Total', 'order')}>
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 1em;
							`}
						>
							<div
								css={css`
									text-transform: uppercase;
								`}
							>
								{subscription?.currency}
							</div>
							<ce-format-number
								style={{
									fontSize: 'var(--ce-font-size-x-large)',
									fontWeight:
										'var(--ce-font-weight-semibold)',
									color: 'var(--ce-color-gray-800)',
								}}
								type="currency"
								currency={subscription?.currency}
								value={subscription?.total_amount}
							></ce-format-number>
						</div>
					</Definition>
				</Fragment>
			)}
		</Box>
	);
};
