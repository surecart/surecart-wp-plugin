/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScRadio, ScRadioGroup } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ upsell, onUpdate }) => {
	return (
		<ScRadioGroup label={__('Visibility', 'surecart')} required>
			<div
				css={css`
					display: grid;
					gap: 1em;
					margin-top: 1em;
				`}
			>
				<ScRadio
					checked={upsell?.duplicate_purchase_behavior === 'allow'}
					value="allow"
					onClick={() =>
						onUpdate({
							duplicate_purchase_behavior: 'allow',
						})
					}
				>
					{__('Always show', 'surecart')}
					<span slot="description">
						{__('Show regardless of past purchases.', 'surecart')}
					</span>
				</ScRadio>
				<ScRadio
					checked={
						upsell?.duplicate_purchase_behavior ===
						'block_within_checkout'
					}
					value="block_within_checkout"
					onClick={() =>
						onUpdate({
							duplicate_purchase_behavior:
								'block_within_checkout',
						})
					}
				>
					{__('Skip if in order', 'surecart')}
					<span slot="description">
						{__(
							"Don't show if already being purchased in the current order.",
							'surecart'
						)}
					</span>
				</ScRadio>
				<ScRadio
					checked={upsell?.duplicate_purchase_behavior === 'block'}
					value="block"
					onClick={() =>
						onUpdate({
							duplicate_purchase_behavior: 'block',
						})
					}
				>
					{__('Skip if purchased', 'surecart')}
					<span slot="description">
						{__(
							"Don't show if ever purchased, including the current order.",
							'surecart'
						)}
					</span>
				</ScRadio>
			</div>
		</ScRadioGroup>
	);
};
