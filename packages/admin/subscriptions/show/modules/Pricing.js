/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { addQueryArgs } from '@wordpress/url';
import { css, jsx } from '@emotion/core';
import { intervalString } from '../../../util/translations';

export default ({ product, price, subscription, loading }) => {
	return (
		<DataTable
			loading={loading}
			title={__('Product', 'surecart')}
			columns={{
				product: {
					label: __('Product', 'surecart'),
				},
				quantity: {
					label: __('Qty', 'surecart'),
					width: '75px',
				},
				total: {
					label: (
						<div
							css={css`
								display: flex;
								justify-content: flex-end;
							`}
						>
							{__('Total', 'surecart')}
						</div>
					),
				},
				actions: {
					width: '75px',
				},
			}}
			items={[
				{
					product: (
						<div>
							{product?.name}
							<div style={{ opacity: 0.5 }}>
								<sc-format-number
									type="currency"
									value={price?.amount}
									currency={price?.currency}
								/>
								{intervalString(price, {
									labels: { interval: '/' },
								})}
							</div>
						</div>
					),
					quantity: subscription?.quantity,
					total: (
						<div
							css={css`
								display: flex;
								justify-content: flex-end;
							`}
						>
							<sc-format-number
								type="currency"
								value={price?.amount * subscription?.quantity}
								currency={price?.currency}
							/>
							{intervalString(price, {
								labels: { interval: '/' },
							})}
						</div>
					),
					actions: !Object.keys(subscription?.pending_update || {})
						.length &&
						subscription?.current_period_end_at !== null && (
							<sc-button
								size="small"
								href={addQueryArgs('admin.php', {
									page: 'sc-subscriptions',
									action: 'edit',
									id: subscription?.id,
								})}
							>
								{__('Change', 'surecart')}
							</sc-button>
						),
				},
			]}
		/>
	);
};
