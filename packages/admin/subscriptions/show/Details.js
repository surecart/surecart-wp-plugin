/** @jsx jsx */

import { __, sprintf } from '@wordpress/i18n';

import { css, jsx } from '@emotion/core';
import { formatTime } from '../../util/time';

export default ({ order, loading }) => {
	if (loading) {
		return (
			<div
				css={css`
					display: flex;
					justify-content: space-between;
					align-items: center;
					gap: 2em;
					margin-bottom: 2em;
				`}
			>
				<div>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 1.5em;
						`}
					>
						<ce-skeleton style={{ flex: 1 }}></ce-skeleton>
					</div>
					<ce-skeleton></ce-skeleton>
				</div>
			</div>
		);
	}

	if (!order?.id) {
		return null;
	}

	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 2em;
				margin-bottom: 2em;
			`}
		>
			<div>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1.5em;
					`}
				>
					<h1>
						<ce-format-number
							type="currency"
							currency={order?.currency}
							value={order?.amount_due}
						></ce-format-number>
					</h1>
					<ce-order-status-badge
						status={order?.status}
					></ce-order-status-badge>
				</div>
				{sprintf(
					__('Created on %s', 'checkout_engine'),
					formatTime(order.updated_at)
				)}
			</div>
			<div>
				{!order?.live_mode && (
					<ce-tag type="warning">
						{__('Test Mode', 'checkout_engine')}
					</ce-tag>
				)}
			</div>
		</div>
	);
};
