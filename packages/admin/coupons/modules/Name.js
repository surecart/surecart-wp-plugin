/** @jsx jsx */
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { CeInput } from '@checkout-engine/components-react';
import { css, jsx } from '@emotion/core';

export default ({ coupon, updateCoupon, loading }) => {
	const renderLoading = () => {
		return (
			<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				<ce-skeleton
					style={{
						'--border-radius':
							'var(--ce-input-border-radius-medium)',
						height: 'var( --ce-input-height-medium )',
						width: '100%',
					}}
				></ce-skeleton>
				<ce-skeleton
					style={{
						width: '80%',
					}}
				></ce-skeleton>
			</div>
		);
	};

	return (
		<Box title={__('Coupon Name', 'checkout_engine')}>
			{loading ? (
				renderLoading()
			) : (
				<CeInput
					className="ce-coupon-name"
					help={__(
						'This is an internal name for your coupon. This is not visible to customers.',
						'checkout_engine'
					)}
					attribute="name"
					required
					value={coupon?.name}
					onCeChange={(e) => updateCoupon({ name: e.target.value })}
				/>
			)}
		</Box>
	);
};
