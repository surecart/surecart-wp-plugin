/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;

import Box from '../../ui/Box';

import {
	CeInput,
	CePriceInput,
	CeRadioGroup,
	CeRadio,
	CeDropdown,
	CeFormControl,
	CeButton,
	CeMenuItem,
	CeMenu,
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
					gap: var(--ce-form-row-spacing-large);
				`}
			>
				<CeRadioGroup
					label={__('Choose a type', 'surecart')}
					onCeChange={(e) => setType(e.target.value)}
				>
					<CeRadio value="percentage" checked={type === 'percentage'}>
						{__('Percentage Discount', 'surecart')}
					</CeRadio>
					<CeRadio value="fixed" checked={type === 'fixed'}>
						{__('Fixed Discount', 'surecart')}
					</CeRadio>
				</CeRadioGroup>

				{type === 'percentage' ? (
					<CeInput
						className="ce-percent-off"
						type="number"
						min="0"
						disabled={type !== 'percentage'}
						max="100"
						attribute="percent_off"
						label={__('Percent Off', 'surecart')}
						value={coupon?.percent_off || null}
						onCeChange={(e) =>
							updateCoupon({
								amount_off: null,
								percent_off: e.target.value,
							})
						}
						required={type === 'percentage'}
					>
						<span slot="suffix">%</span>
					</CeInput>
				) : (
					<CePriceInput
						className="ce-amount-off"
						currencyCode={coupon?.currency}
						disabled={type === 'percentage'}
						attribute="amount_off"
						label={__('Amount Off', 'surecart')}
						value={coupon?.amount_off || null}
						required={type === 'fixed'}
						onCeChange={(e) => {
							updateCoupon({
								percent_off: null,
								amount_off: e.target.value,
							});
						}}
					/>
				)}

				<CeFormControl label={__('Discount Duration', 'surecart')}>
					<div>
						<CeDropdown
							slot="suffix"
							class="ce-discount-duration-dropdown"
							position="bottom-left"
						>
							<CeButton
								slot="trigger"
								class="ce-discount-duration-trigger"
								caret
							>
								{translateDuration(coupon?.duration)}
							</CeButton>
							<CeMenu>
								<CeMenuItem
									onClick={() =>
										updateCoupon({ duration: 'forever' })
									}
								>
									{__('Forever', 'surecart')}
								</CeMenuItem>
								<CeMenuItem
									onClick={() =>
										updateCoupon({ duration: 'once' })
									}
								>
									{__('Once', 'surecart')}
								</CeMenuItem>
								<CeMenuItem
									className="ce-discount-menu-repeating"
									onClick={() =>
										updateCoupon({
											duration: 'repeating',
										})
									}
								>
									{__('Repeating', 'surecart')}
								</CeMenuItem>
							</CeMenu>
						</CeDropdown>
					</div>
				</CeFormControl>

				{coupon?.duration === 'repeating' && (
					<CeInput
						label={__('Number of months', 'surecart')}
						className="ce-duration-in-months"
						value={coupon?.duration_in_months || null}
						onCeChange={(e) => {
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
