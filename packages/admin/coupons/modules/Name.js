/** @jsx jsx */
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { ScInput } from '@surecart/components-react';
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
				<sc-skeleton
					style={{
						'--border-radius':
							'var(--sc-input-border-radius-medium)',
						height: 'var( --sc-input-height-medium )',
						width: '100%',
					}}
				></sc-skeleton>
				<sc-skeleton
					style={{
						width: '80%',
					}}
				></sc-skeleton>
			</div>
		);
	};

	return (
		<Box title={__('Coupon Name', 'surecart')}>
			{loading ? (
				renderLoading()
			) : (
				<ScInput
					className="sc-coupon-name"
					help={__(
						'This is an internal name for your coupon. This is not visible to customers.',
						'surecart'
					)}
					attribute="name"
					required
					value={coupon?.name}
					onScChange={(e) => updateCoupon({ name: e.target.value })}
				/>
			)}
		</Box>
	);
};
