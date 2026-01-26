/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { StrategyRadioGroup } from './StrategyRadioGroup';
import { ScFlex } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export const TargetStrategyRow = ({ target, item, editItem }) => {
	const { id, label, description, feeKey, discountKey } = target;

	return (
		<div
			css={css`
				padding-bottom: 24px;

				&:last-child {
					border-bottom: none;
				}
			`}
		>
			<h3
				css={css`
					margin-top: 0;
					margin-bottom: 4px;
					font-size: 16px;
				`}
			>
				{label}
			</h3>
			{description && (
				<p
					css={css`
						margin: 0 0 16px;
						font-size: 14px;
						color: var(--sc-color-gray-500);
					`}
				>
					{description}
				</p>
			)}

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
