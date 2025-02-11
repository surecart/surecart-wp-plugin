/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScSelect, ScInput, ScFormControl } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import DrawerSection from '../../../../ui/DrawerSection';
import SingleAmount from './SingleAmount';
import ScratchAmount from './ScratchAmount';

const PaymentType = ({ type, setType, price, updatePrice }) => {
	const renderRecurringOptions = () => {
		if (type === 'once') {
			return null;
		}

		return (
			<div
				css={css`
					display: flex;
					gap: 1em;
					flex: 1 1 100%;
					& > * {
						flex: 1 1 calc(50% - 0.5em);
					}
				`}
			>
				<ScFormControl
					required
					disabled={price?.id}
					label={__('Repeat payment every', 'surecart')}
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
							max={
								price?.recurring_interval === 'year' ? 10 : null
							}
							required
						/>
						<ScSelect
							value={price?.recurring_interval}
							disabled={price?.id}
							unselect={false}
							css={css`
								min-width: 95px;
								max-width: 150px;
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

				{type === 'multiple' && (
					<ScInput
						label={__('Number of Payments', 'surecart')}
						className="sc-payment-number"
						required
						type="number"
						disabled={price?.id}
						min={1}
						value={price?.recurring_period_count}
						onScInput={(e) =>
							updatePrice({
								recurring_period_count: parseInt(
									e.target.value
								),
							})
						}
					>
						<span slot="suffix">{__('Payments', 'surecart')}</span>
					</ScInput>
				)}
			</div>
		);
	};

	return (
		<>
			{!price?.id && (
				<ScSelect
					label={__('Payment type', 'surecart')}
					required
					unselect={false}
					value={type}
					onScChange={(e) => setType(e.target.value)}
					choices={[
						{
							value: 'once',
							label: __('One Time', 'surecart'),
						},
						{
							value: 'multiple',
							label: __('Installment', 'surecart'),
						},
						{
							value: 'subscription',
							label: __('Subscription', 'surecart'),
						},
					]}
				/>
			)}

			<DrawerSection title={__('Pricing', 'surecart')}>
				<div
					css={css`
						display: flex;
						gap: 1em;
						flex-wrap: wrap;
						& > * {
							flex: 1 1 calc(50% - 0.5em);
							min-width: 200px;
						}
					`}
				>
					<SingleAmount price={price} updatePrice={updatePrice} />

					<ScratchAmount price={price} updatePrice={updatePrice} />

					{renderRecurringOptions()}
				</div>
			</DrawerSection>
		</>
	);
};

export default PaymentType;
