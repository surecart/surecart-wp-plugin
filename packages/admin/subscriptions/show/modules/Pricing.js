/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
// import { store } from '../../store/data';
import { addQueryArgs } from '@wordpress/url';
import { translateInterval } from '@scripts/admin/util/translations';
import Box from '../../../ui/Box';
import { css, jsx } from '@emotion/core';
import { CeInput } from '@checkout-engine/components-react';

export default ({ product, price, subscription, loading }) => {
	return (
		<DataTable
			loading={loading}
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
					quantity: subscription?.quantity,
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
					actions: (
						<ce-button
							size="small"
							href={addQueryArgs('admin.php', {
								page: 'ce-subscriptions',
								action: 'edit',
								id: subscription?.id,
							})}
						>
							{__('Edit', 'checkout_engine')}
						</ce-button>
					),
				},
			]}
		/>
	);
};
