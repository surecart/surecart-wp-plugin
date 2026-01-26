/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput, ScPriceInput, ScSelect } from '@surecart/components-react';
import Box from '../../ui/Box';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { getCurrencyCode } from '../utils/helper';

const Details = ({ autoFee, onUpdate, loading }) => {
	const { name, amount_adjustment, percent_adjustment, discount, metadata } =
		autoFee;

	const [adjustmentType, setAdjustmentType] = useState(
		amount_adjustment ? 'fixed' : 'percentage'
	);

	useEffect(() => {
		// Handle adjustment type changes - clear conflicting values
		if (adjustmentType === 'percentage' && amount_adjustment) {
			onUpdate({ amount_adjustment: null });
			return;
		}

		if (adjustmentType === 'fixed' && percent_adjustment) {
			onUpdate({ percent_adjustment: null });
			return;
		}
	}, [adjustmentType, amount_adjustment, percent_adjustment, onUpdate]);

	const handleDisplayNameChange = useCallback(
		(e) => {
			onUpdate({ name: e.target.value });
		},
		[onUpdate]
	);

	const handleNameChange = useCallback(
		(e) => {
			onUpdate({
				metadata: {
					...(metadata || {}),
					internal_name: e.target.value,
				},
			});
		},
		[onUpdate]
	);

	const handlePriceTypeChange = useCallback(
		(e) => {
			onUpdate({ discount: e.target.value === 'discount' });
		},
		[onUpdate]
	);

	const handleAdjustmentTypeChange = useCallback((e) => {
		setAdjustmentType(e.target.value);
	}, []);

	const handlePercentChange = useCallback(
		(e) => {
			onUpdate({ percent_adjustment: e.target.value });
		},
		[onUpdate]
	);

	const handleAmountChange = useCallback(
		(e) => {
			onUpdate({ amount_adjustment: e.target.value });
		},
		[onUpdate]
	);

	return (
		<Box title={__('Details', 'surecart')} loading={loading}>
			<ScInput
				label={__('Name', 'surecart')}
				help={__(
					'This is the internal name for your dynamic price. This is not visible to the customer.',
					'surecart'
				)}
				value={metadata?.internal_name}
				required
				onScInput={handleNameChange}
			/>
			<ScInput
				label={__('Display Name', 'surecart')}
				help={__(
					'A friendly name for your dynamic price. This will be displayed to the customer.',
					'surecart'
				)}
				value={name}
				required
				onScInput={handleDisplayNameChange}
			/>
			<ScSelect
				label={__('Price Type', 'surecart')}
				help={__(
					'Select whether you want to give a discount or charge a fee.',
					'surecart'
				)}
				unselect={false}
				value={discount ? 'discount' : 'fee'}
				onScChange={handlePriceTypeChange}
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
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
					grid-template-columns: 1fr 1fr;
				`}
			>
				<ScSelect
					label={__('Apply As', 'surecart')}
					help={__(
						'Choose between a percentage or a fixed amount.',
						'surecart'
					)}
					unselect={false}
					value={adjustmentType}
					onScChange={handleAdjustmentTypeChange}
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
						min="0"
						max="100"
						step="0.01"
						attribute="percent_adjustment"
						label={__('Percent', 'surecart')}
						value={percent_adjustment}
						onScInput={handlePercentChange}
						required
					>
						<span slot="suffix">%</span>
					</ScInput>
				) : (
					<ScPriceInput
						currencyCode={getCurrencyCode(autoFee)}
						attribute="amount_adjustment"
						label={__('Amount', 'surecart')}
						value={amount_adjustment || null}
						required
						onScInput={handleAmountChange}
					/>
				)}
			</div>
		</Box>
	);
};

export default Details;
