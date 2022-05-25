/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import {
	ScPriceInput,
	ScSelect,
	ScFormControl,
	ScInput,
} from '@surecart/components-react';

export default ({ price, updatePrice }) => {
	return (
		<sc-flex style={{ flexWrap: 'wrap' }}>
			<ScPriceInput
				css={css`
					flex: 1 1 50%;
				`}
				label={__('Price', 'surecart')}
				className="sc-price-amount"
				currencyCode={scData.currency_code}
				value={price?.amount}
				name="price"
				onScChange={(e) => {
					updatePrice({ amount: e.target.value });
				}}
				required
			/>
			<ScFormControl
				css={css`
					flex: 1 1 50%;
				`}
				required
				disabled={price?.id}
				label={__('Repeat Payment Every', 'surecart')}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						gap: 0.5em;
					`}
				>
					<ScInput
						disabled={price?.id}
						value={price?.recurring_interval_count}
						onScChange={(e) =>
							updatePrice({
								recurring_interval_count: e.target.value,
							})
						}
						css={css`
							width: 100px;
							flex: 1;
						`}
						type="number"
						max={price?.recurring_interval === 'year' ? 1 : null}
						required
					/>
					<ScSelect
						value={price?.recurring_interval}
						disabled={price?.id}
						css={css`
							min-width: 95px;
							flex: 1;
						`}
						onScChange={(e) =>
							updatePrice({
								recurring_interval: e.target.value,
							})
						}
						choices={[
							{
								value: 'day',
								label: __('Day', 'surecart'),
							},
							{
								value: 'week',
								label: __('Week', 'surecart'),
							},
							{
								value: 'month',
								label: __('Month', 'surecart'),
							},
							{
								value: 'year',
								label: __('Year', 'surecart'),
							},
						]}
					/>
				</div>
			</ScFormControl>
		</sc-flex>
	);
};
