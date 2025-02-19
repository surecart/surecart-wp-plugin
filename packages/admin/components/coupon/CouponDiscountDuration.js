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
	ScButton,
	ScDropdown,
	ScFormControl,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScText,
} from '@surecart/components-react';

export default function ({ coupon, updateCoupon }) {
	const translateDuration = (amount) => {
		switch (amount) {
			case 'forever':
				return __('Forever', 'surecart');
			case 'repeating':
				return __('Multiple months', 'surecart');
			default:
				return __('Once', 'surecart');
		}
	};

	return (
		<div>
			<div
				css={css`
					display: flex;
					gap: var(--sc-spacing-medium);
                    margin-bottom: var(--sc-spacing-small);
				`}
			>
				<ScFormControl label={__('Discount Duration', 'surecart')}>
					<div>
						<ScDropdown
							slot="suffix"
							class="sc-discount-duration-dropdown"
							position="bottom-left"
						>
							<ScButton
								slot="trigger"
								class="sc-discount-duration-trigger"
								caret
							>
								{translateDuration(coupon?.duration)}
							</ScButton>
							<ScMenu>
								<ScMenuItem
									onClick={() =>
										updateCoupon({
											duration: 'forever',
										})
									}
								>
									{__('Forever', 'surecart')}
								</ScMenuItem>
								<ScMenuItem
									onClick={() =>
										updateCoupon({
											duration: 'once',
										})
									}
								>
									{__('Once', 'surecart')}
								</ScMenuItem>
								<ScMenuItem
									className="sc-discount-menu-repeating"
									onClick={() =>
										updateCoupon({
											duration: 'repeating',
										})
									}
								>
									{__('Multiple months', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
					</div>
				</ScFormControl>

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
						<span slot="suffix">{__('months', 'surecart')}</span>
					</ScInput>
				)}
			</div>

			<div>
				<ScText
					css={css`
						color: var(--sc-input-help-text-color);
						font-size: var(--sc-font-size-small);
					`}
				>
					{__(
						'For subscriptions and customers, this determines how long this coupon will apply once redeemed.',
						'surecart'
					)}{' '}
					<ScButton
						href="https://surecart.com/docs/create-coupons/#discount-duration"
						target="_blank"
						rel="noopener noreferrer"
						type="link"
					>
						{__('Learn more', 'surecart')}
						<ScIcon name="external-link" slot="suffix" />
					</ScButton>
				</ScText>
			</div>
		</div>
	);
}
