/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon, ScStackedListRow, ScTag } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ reason }) => {
	return (
		<ScStackedListRow
			style={{
				'--columns': '2',
			}}
		>
			<div>
				<div>
					<strong>{reason?.label}</strong>{' '}
					{reason?.coupon_enabled && (
						<ScTag type="info" size="small">
							{__('Offer Discount', 'surecart')}
						</ScTag>
					)}
				</div>
				<div>{reason?.description}</div>
			</div>

			<ScIcon
				name="menu"
				slot="prefix"
				css={css`
					color: var(--sc-color-gray-400);
					cursor: move;
				`}
			/>
			<ScIcon name="more-horizontal" slot="suffix" />
		</ScStackedListRow>
	);
};
