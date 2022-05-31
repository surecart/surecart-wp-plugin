/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { ScSelect, ScFormControl, ScInput } from '@surecart/components-react';
import SingleAmount from './SingleAmount';
import { translateInterval } from '../../../../util/translations';

export default ({ price, updatePrice, locked }) => {
	if (locked) {
		return (
			<SingleAmount
				css={css`
					flex: 1;
				`}
				price={price}
				updatePrice={updatePrice}
				suffix={
					<span style={{ opacity: '0.5' }}>
						{translateInterval(
							price?.recurring_interval_count,
							price?.recurring_interval,
							'every',
							''
						)}
						{!!price?.recurring_period_count &&
							!!price?.recurring_interval &&
							translateInterval(
								price?.recurring_period_count,
								price?.recurring_interval,
								' for',
								'',
								true
							)}
					</span>
				}
			/>
		);
	}

	return (
		<sc-flex style={{ flexWrap: 'wrap' }}>
			<SingleAmount
				css={css`
					flex: 1 1 50%;
				`}
				price={price}
				updatePrice={updatePrice}
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
						unselect={false}
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
