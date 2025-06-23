/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScInput,
	ScPriceInput,
	ScSwitch,
	ScSelect,
	ScFormControl,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import SaveButton from '../../templates/SaveButton';
import { useState, useEffect } from '@wordpress/element';
import DateTimePicker from './DateTimePicker';

export default ({ autoFee, onUpdate, loading, saving, deleting, ...props }) => {
	const {
		name,
		amount_adjustment,
		percent_adjustment,
		discount,
		start_at,
		end_at,
		rule_string,
	} = autoFee;

	const [adjustmentType, setAdjustmentType] = useState(
		amount_adjustment ? 'fixed' : 'percentage'
	);

	const [endDateToggle, setEndDateToggle] = useState(false);

	useEffect(() => {
		if (!endDateToggle && end_at) {
			onUpdate({
				end_at: null,
			});
		}
	}, [endDateToggle]);

	useEffect(() => {
		if (adjustmentType === 'percentage' && amount_adjustment) {
			onUpdate({
				amount_adjustment: null,
			});
		}
		if (adjustmentType === 'fixed' && percent_adjustment) {
			onUpdate({
				percent_adjustment: null,
			});
		}
	}, [adjustmentType]);

	useEffect(() => {
		if (amount_adjustment && adjustmentType !== 'fixed') {
			setAdjustmentType('fixed');
		} else if (percent_adjustment && adjustmentType !== 'percent') {
			setAdjustmentType('percent');
		}
	}, [amount_adjustment, percent_adjustment]);

	return (
		<Box
			title={__('Auto Fee Details', 'surecart')}
			loading={loading}
			{...props}
		>
			<ScInput
				label={__('Name', 'surecart')}
				help={__(
					"Your Auto Fee's name. This will not be visible to customers.",
					'surecart'
				)}
				value={name}
				required
				onScInput={(e) =>
					onUpdate({
						name: e.target.value,
					})
				}
			/>
			<ScSelect
				label={__('Type', 'surecart')}
				help={__(
					'Whether this auto fee is a discount (subtracted from total) or a fee (added to total).',
					'surecart'
				)}
				unselect={false}
				value={discount ? 'discount' : 'fee'}
				css={css`
					min-width: 125px;
				`}
				onScChange={(e) => {
					onUpdate({
						discount: 'discount' === e.target.value ? true : false,
					});
				}}
				choices={[
					{
						label: __('Discount', 'surecart'),
						value: 'discount',
					},
					{
						label: __('Fee', 'surecart'),
						value: 'fee',
					},
				]}
			/>
			<ScSelect
				label={__('Adjustment Type', 'surecart')}
				help={__(
					'Whether this auto fee is a percentage or fixed amount adjustment.',
					'surecart'
				)}
				unselect={false}
				value={adjustmentType}
				css={css`
					min-width: 125px;
				`}
				onScChange={(e) => setAdjustmentType(e.target.value)}
				choices={[
					{
						label: __('Percentage', 'surecart'),
						value: 'percentage',
					},
					{
						label: __('Fixed Amount', 'surecart'),
						value: 'fixed',
					},
				]}
			/>

			{adjustmentType === 'percentage' ? (
				<ScInput
					type="number"
					disabled={adjustmentType !== 'percentage'}
					min="0"
					max="100"
					step="0.01"
					attribute="percent_adjustment"
					label={__('Percent', 'surecart')}
					value={percent_adjustment}
					onScInput={(e) =>
						onUpdate({
							percent_adjustment: e.target.value,
						})
					}
					required={adjustmentType === 'percentage'}
				>
					<span slot="suffix">%</span>
				</ScInput>
			) : (
				<ScPriceInput
					currencyCode={autoFee?.currency || scData?.currency_code}
					disabled={adjustmentType === 'percentage'}
					attribute="amount_adjustment"
					label={__('Amount', 'surecart')}
					value={amount_adjustment || null}
					required={adjustmentType === 'fixed'}
					onScInput={(e) => {
						onUpdate({
							amount_adjustment: e.target.value,
						});
					}}
				/>
			)}
			<ScFormControl
				help={__(
					'Time at which the auto fee becomes active & start being applied to the checkout.',
					'surecart'
				)}
			>
				<DateTimePicker
					label={__('Start Date', 'surecart')}
					currentDate={start_at}
					setDate={(date) =>
						onUpdate({
							start_at: date,
						})
					}
					required
				/>
			</ScFormControl>
			<ScSwitch
				checked={!!endDateToggle}
				onScChange={(e) => {
					setEndDateToggle(e.target.checked);
				}}
			>
				{__('Set End Date?', 'surecart')}
				<span slot="description">
					{__(
						'Limit the end date when auto fee becomes inactive.',
						'surecart'
					)}
				</span>
			</ScSwitch>
			{endDateToggle && (
				<ScFormControl
					help={__(
						'Time at which the auto fee becomes inactive.',
						'surecart'
					)}
				>
					<DateTimePicker
						label={__('End Date', 'surecart')}
						currentDate={end_at}
						setDate={(date) =>
							onUpdate({
								end_at: date,
							})
						}
					/>
				</ScFormControl>
			)}
		</Box>
	);
};
