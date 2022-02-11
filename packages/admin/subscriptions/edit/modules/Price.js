/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { translateInterval } from '@scripts/admin/util/translations';
import { css, jsx } from '@emotion/core';
import { CeInput } from '@checkout-engine/components-react';
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
			title={__('Product', 'checkout_engine')}
			columns={{
				product: {
					label: __('Price', 'checkout_engine'),
				},
				quantity: {
					label: __('Qty', 'checkout_engine'),
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
							{__('Total', 'checkout_engine')}
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
									<ce-format-number
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
							<ce-button
								size="small"
								onClick={() =>
									updateSubscription({ price: null })
								}
							>
								Change
							</ce-button>
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
						<CeInput
							type="number"
							value={subscription?.quantity}
							onCeChange={(e) => {
								updateSubscription({
									quantity: e.target.value,
								});
							}}
							required
						></CeInput>
					),
					total: (
						<div
							css={css`
								display: flex;
								justify-content: flex-end;
							`}
						>
							<ce-format-number
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
