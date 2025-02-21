/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { ExternalLink } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScFormControl,
	ScInput,
	ScSelect,
	ScText,
} from '@surecart/components-react';

export default function ({ coupon, updateCoupon }) {
	const durations = {
		once: __('Once', 'surecart'),
		forever: __('Forever', 'surecart'),
		repeating: __('Multiple months', 'surecart'),
	};

	const durationChoices = Object.keys(durations).map((key) => ({
		label: durations[key],
		value: key,
	}));

	return (
		<div>
			<div
				css={css`
					display: flex;
					gap: var(--sc-spacing-medium);
					margin-bottom: var(--sc-spacing-small);
				`}
			>
				<ScFormControl
					label={__('Discount Duration', 'surecart')}
					css={css`
						flex: 1;
					`}
				>
					<ScSelect
						choices={durationChoices}
						onScChange={(e) =>
							updateCoupon({
								duration: e.target.value,
							})
						}
					>
						{durations?.[coupon?.duration]}
					</ScSelect>
				</ScFormControl>

				<div
					css={css`
						flex: 1;
					`}
				>
					{coupon?.duration === 'repeating' && (
						<ScInput
							label={__('Number of months', 'surecart')}
							className="sc-duration-in-months"
							value={coupon?.duration_in_months || null}
							onScInput={(e) => {
								updateCoupon({
									duration_in_months: e.target.value,
								});
							}}
							min="1"
							type="number"
							required
						>
							<span slot="suffix">
								{__('months', 'surecart')}
							</span>
						</ScInput>
					)}
				</div>
			</div>

			<div>
				<ScText
					css={css`
						color: var(--sc-input-help-text-color);
						font-size: var(--sc-font-size-small);
					`}
				>
					{__(
						'This determines how long this coupon will continue to apply once redeemed.',
						'surecart'
					)}{' '}
					<ExternalLink href="https://surecart.com/docs/create-coupons/#discount-duration">
						{__('Learn more', 'surecart')}
					</ExternalLink>
				</ScText>
			</div>
		</div>
	);
}
