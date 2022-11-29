/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;

import Box from '../../ui/Box';

import {
	ScInput,
	ScPriceInput,
	ScRadioGroup,
	ScRadio,
	ScDropdown,
	ScFormControl,
	ScButton,
	ScMenuItem,
	ScMenu,
} from '@surecart/components-react';

export default ({ coupon, loading, updateCoupon }) => {
	const [type, setType] = useState('percentage');

	useEffect(() => {
		if (coupon?.amount_off) {
			setType('fixed');
		}
	}, [coupon?.amount_off]);

	const translateDuration = (amount) => {
		switch (amount) {
			case 'once':
				return __('Once', 'surecart');
			case 'repeating':
				return __('Repeating', 'surecart');
			default:
				return __('Forever', 'surecart');
		}
	};

	return (
		<Box title={__('Amount', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing-large);
				`}
			>
				<ScRadioGroup
					label={__('Choose a type', 'surecart')}
					onScChange={(e) => setType(e.target.value)}
				>
					<ScRadio value="percentage" checked={type === 'percentage'}>
						{__('Percentage Discount', 'surecart')}
					</ScRadio>
					<ScRadio value="fixed" checked={type === 'fixed'}>
						{__('Fixed Discount', 'surecart')}
					</ScRadio>
				</ScRadioGroup>

				{type === 'percentage' ? (
					<ScInput
						className="sc-percent-off"
						type="number"
						min="0"
						disabled={type !== 'percentage'}
						max="100"
						attribute="percent_off"
						label={__('Percent Off', 'surecart')}
						value={coupon?.percent_off || null}
						onScInput={(e) =>
							updateCoupon({
								amount_off: null,
								percent_off: e.target.value,
							})
						}
						required={type === 'percentage'}
					>
						<span slot="suffix">%</span>
					</ScInput>
				) : (
					<ScPriceInput
						className="sc-amount-off"
						currencyCode={coupon?.currency}
						disabled={type === 'percentage'}
						attribute="amount_off"
						label={__('Amount Off', 'surecart')}
						value={coupon?.amount_off || null}
						required={type === 'fixed'}
						onScInput={(e) => {
							updateCoupon({
								percent_off: null,
								amount_off: e.target.value,
							});
						}}
					/>
				)}

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
										updateCoupon({ duration: 'forever' })
									}
								>
									{__('Forever', 'surecart')}
								</ScMenuItem>
								<ScMenuItem
									onClick={() =>
										updateCoupon({ duration: 'once' })
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
									{__('Repeating', 'surecart')}
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
						required={coupon?.duration === 'repeating'}
					/>
				)}
			</div>
		</Box>
	);
};
