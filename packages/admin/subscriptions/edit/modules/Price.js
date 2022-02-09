/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
// import { store } from '../../store/data';
import useEntity from '../../../mixins/useEntity';
import { translateInterval } from '@scripts/admin/util/translations';
import Box from '../../../ui/Box';
import { css, jsx } from '@emotion/core';
import { CeInput } from '@checkout-engine/components-react';

export default ({ subscription, updateSubscription, isLoading }) => {
	const { price, getRelation } = useEntity('price', subscription?.price);
	const product = getRelation('product');

	return (
		<DataTable
			title={__('Product', 'checkout_engine')}
			columns={{
				product: {
					label: __('Product', 'checkout_engine'),
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
				actions: {
					width: '50px',
				},
			}}
			items={[
				{
					product: (
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
					actions: <ce-icon name="more-horizontal"></ce-icon>,
				},
			]}
		/>
	);

	return (
		<Box title={__('Pricing', 'checkout_engine')} loading={isLoading}>
			<ce-table>
				<ce-table-cell slot="head">
					{__('Product', 'checkout_engine')}
				</ce-table-cell>
				<ce-table-cell slot="head" style={{ width: '50px' }}>
					{__('QTY', 'checkout_engine')}
				</ce-table-cell>
				<ce-table-cell slot="head">
					{__('Total', 'checkout_engine')}
				</ce-table-cell>
				<ce-table-cell slot="head"></ce-table-cell>
				<ce-table-row>
					<ce-table-cell>{product?.name}</ce-table-cell>
					<ce-table-cell>
						<ce-input
							type="number"
							value={subscription?.quantity}
						></ce-input>
					</ce-table-cell>
					<ce-table-cell>
						<ce-format-number
							type="currency"
							value={price?.amount}
							currency={price?.currency}
						></ce-format-number>
					</ce-table-cell>
				</ce-table-row>
			</ce-table>
		</Box>
	);
};
