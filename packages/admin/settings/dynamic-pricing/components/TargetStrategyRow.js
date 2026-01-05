/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { StrategyRadioGroup } from './StrategyRadioGroup';
import { ScFlex } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export const TargetStrategyRow = ({ target, item, editItem }) => {
	const { id, label, feeKey, discountKey } = target;

	return (
		<div
			css={css`
				padding-bottom: 24px;
				border-bottom: 1px solid var(--sc-color-gray-200);

				&:last-child {
					border-bottom: none;
				}
			`}
		>
			<h3
				css={css`
					margin-bottom: 16px;
					font-size: 16px;
				`}
			>
				{label}
			</h3>

			<ScFlex
				style={{
					'--sc-flex-column-gap': '2.5em',
					'--sc-flex-space-between': 'flex-start',
				}}
			>
				{/* Fees */}
				<StrategyRadioGroup
					label={__('Fees', 'surecart')}
					value={item?.[feeKey]}
					type="fee"
					target={id}
					onChange={(value) => editItem({ [feeKey]: value })}
				/>

				{/* Discounts */}
				<StrategyRadioGroup
					label={__('Discounts', 'surecart')}
					value={item?.[discountKey]}
					type="discount"
					target={id}
					onChange={(value) => editItem({ [discountKey]: value })}
				/>
			</ScFlex>
		</div>
	);
};
