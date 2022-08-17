/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import Box from '../../ui/Box';
import { ScButton } from '@surecart/components-react';
import Definition from '../../ui/Definition';

import useSubscriptionItemsData from '../hooks/useSubscriptionItemsData';
import useSubscriptionData from '../hooks/useSubscriptionData';
import { intervalString } from '../../../util/translations';

export default () => {
	const { subscription, loading } = useSubscriptionData();
	const { items } = useSubscriptionItemsData();

	const renderLoading = () => {
		return <sc-skeleton></sc-skeleton>;
	};

	const renderRefund = (
		<Fragment>
			<div>
				<ScButton>Refund</ScButton>
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
							<sc-product-line-item
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
										: item.subtotal_amount
								}
								currency={item?.price?.currency}
								trialDurationDays={
									item?.price?.trial_duration_days
								}
								interval={intervalString(item?.price)}
							></sc-product-line-item>
						);
					})}

					<hr />

					<Definition title={__('Subtotal', 'order')}>
						<sc-format-number
							style={{
								'font-weight': 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={subscription?.currency}
							value={subscription?.subtotal_amount}
						></sc-format-number>
					</Definition>
					<Definition title={__('Discounts', 'order')}>
						<sc-format-number
							style={{
								'font-weight': 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={subscription?.currency}
							value={subscription?.discount_amount}
						></sc-format-number>
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
							<sc-format-number
								style={{
									fontSize: 'var(--sc-font-size-x-large)',
									fontWeight:
										'var(--sc-font-weight-semibold)',
									color: 'var(--sc-color-gray-800)',
								}}
								type="currency"
								currency={subscription?.currency}
								value={subscription?.total_amount}
							></sc-format-number>
						</div>
					</Definition>
				</Fragment>
			)}
		</Box>
	);
};
