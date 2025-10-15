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
	ScSelect,
	ScTag,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import { useState, useEffect } from '@wordpress/element';

export default ({ autoFee, onUpdate, loading }) => {
	const {
		name,
		amount_adjustment,
		percent_adjustment,
		discount,
		fee_target,
	} = autoFee;

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
	}, [adjustmentType, amount_adjustment, percent_adjustment]);

	return (
		<Box
			title={__('Details', 'surecart')}
			loading={loading}
			header_action={
				fee_target && (
					<ScTag type="info" size="medium">
						{`Target: ${fee_target
							.replace('_', ' ')
							.toUpperCase()}`}
					</ScTag>
				)
			}
		>
			<ScInput
				label={__('Name', 'surecart')}
				help={__("Your Dynamic Price's name.", 'surecart')}
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
					'Whether this dynamic price is a discount or a fee.',
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
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
					grid-template-columns: 1fr 1fr;
				`}
			>
				<ScSelect
					label={__('Adjustment Type', 'surecart')}
					help={__(
						'Whether this dynamic price is a percentage or fixed amount adjustment.',
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
						currencyCode={
							autoFee?.currency || scData?.currency_code
						}
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
			</div>
		</Box>
	);
};
