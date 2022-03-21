/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { addQueryArgs } from '@wordpress/url';
import { translateInterval } from '@scripts/admin/util/translations';
import { css, jsx } from '@emotion/core';
import { useEffect } from 'react';
import useEntity from '../../../mixins/useEntity';
import Box from '../../../ui/Box';
import { CeFormatDate } from '@surecart/components-react';

export default ({ subscription }) => {
	const { pending_update } = subscription || {};
	const { price: price_id } = pending_update || {};

	const { price, fetchPrice, getRelation, isLoading } = useEntity(
		'price',
		price_id || null
	);
	const product = getRelation('product');

	useEffect(() => {
		if (price_id) {
			fetchPrice({
				query: {
					expand: ['product'],
				},
			});
		}
	}, [price_id]);

	return (
		<DataTable
			loading={isLoading}
			title={__('Pending Update', 'surecart')}
			columns={{
				product: {
					label: __('Product', 'surecart'),
				},
				quantity: {
					label: __('Qty', 'surecart'),
					width: '75px',
				},
				schedule: {
					label: (
						<div
							css={css`
								display: flex;
								justify-content: flex-end;
							`}
						>
							{__('Scheduled', 'surecart')}
						</div>
					),
				},
			}}
			items={[
				{
					product: (
						<div>
							{product?.name}
							<div
								css={css`
									opacity: 0.5;
								`}
							>
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
					quantity:
						pending_update?.quantity || subscription?.quantity,
					schedule: (
						<div>
							{sprintf(__('Scheduled', 'surecart'))}
							<div
								css={css`
									opacity: 0.5;
								`}
							>
								<CeFormatDate
									date={subscription?.current_period_end_at}
									type="timestamp"
									month="long"
									day="numeric"
									year="numeric"
								></CeFormatDate>
							</div>
						</div>
					),
				},
			]}
		/>
	);
};
