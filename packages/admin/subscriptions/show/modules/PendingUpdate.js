/** @jsx jsx */
import DataTable from '../../../components/DataTable';
import useEntity from '../../../hooks/useEntity';
import { intervalString } from '../../../util/translations';
import { css, jsx } from '@emotion/core';
import { ScFormatDate } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';

export default ({ subscription }) => {
	const { pending_update } = subscription || {};
	const { price: price_id } = pending_update || {};

	const { price, hasLoadedPrice } = useEntity(
		'price',
		price_id || subscription?.price,
		{
			expand: ['product'],
		}
	);

	return (
		<DataTable
			loading={!hasLoadedPrice}
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
							{price?.product?.name}
							<div
								css={css`
									opacity: 0.5;
								`}
							>
								<sc-format-number
									type="currency"
									value={
										pending_update?.ad_hoc_amount ||
										price?.amount
									}
									currency={price?.currency}
								/>
								{intervalString(price, {
									labels: { interval: '/' },
								})}
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
								<ScFormatDate
									date={subscription?.current_period_end_at}
									type="timestamp"
									month="long"
									day="numeric"
									year="numeric"
								></ScFormatDate>
							</div>
						</div>
					),
				},
			]}
		/>
	);
};
