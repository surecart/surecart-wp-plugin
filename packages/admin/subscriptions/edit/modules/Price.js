/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { translateInterval } from '@scripts/admin/util/translations';
import { css, jsx } from '@emotion/core';
import { ScInput } from '@surecart/components-react';
import PriceSelector from '@admin/components/PriceSelector';

export default ({
	subscription,
	updateSubscription,
	product,
	price,
	loading,
}) => {
	return (
		<DataTable
			loading={loading}
			title={__('Product', 'surecart')}
			columns={{
				product: {
					label: __('Price', 'surecart'),
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
			}}
			items={[
				{
					product: subscription?.price ? (
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 1em;
							`}
						>
							<div>
								{product?.name}
								<div style={{ opacity: 0.5 }}>
									<sc-format-number
										type="currency"
										value={price?.amount}
										currency={price?.currency}
									/>
									{translateInterval(
										price?.recurring_interval_count,
										price?.recurring_interval,
										' /',
										''
									)}
								</div>
							</div>
							<sc-button
								size="small"
								onClick={() =>
									updateSubscription({ price: null })
								}
							>
								Change
							</sc-button>
						</div>
					) : (
						<PriceSelector
							open
							ad_hoc={false}
							value={price?.id}
							onSelect={(price) => {
								updateSubscription({ price });
							}}
							requestQuery={{
								archived: false,
								recurring: true,
							}}
						/>
					),
					quantity: (
						<ScInput
							type="number"
							value={subscription?.quantity}
							onScChange={(e) => {
								updateSubscription({
									quantity: e.target.value,
								});
							}}
							required
						></ScInput>
					),
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
							{translateInterval(
								price?.recurring_interval_count,
								price?.recurring_interval,
								' /',
								''
							)}
						</div>
					),
				},
			]}
		/>
	);
};
