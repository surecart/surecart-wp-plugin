/** @jsx jsx */

import { __, sprintf } from '@wordpress/i18n';

import { css, jsx } from '@emotion/core';
import { formatTime } from '../../util/time';

export default ({ order, checkout, loading }) => {
	console.log({ order });
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
							gap: 0.5em;
						`}
					>
						<sc-skeleton style={{ flex: 1 }}></sc-skeleton>
					</div>
					<sc-skeleton></sc-skeleton>
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
						gap: 0.5em;
					`}
				>
					<h1>
						<sc-format-number
							type="currency"
							currency={checkout?.currency}
							value={checkout?.amount_due}
						></sc-format-number>
					</h1>
					<sc-order-status-badge
						status={order?.status || checkout?.status}
					></sc-order-status-badge>
				</div>
				{sprintf(
					__('Created on %s', 'surecart'),
					formatTime(order.updated_at)
				)}
			</div>
			<div>
				{!checkout?.live_mode && (
					<sc-tag type="warning">
						{__('Test Mode', 'surecart')}
					</sc-tag>
				)}
			</div>
		</div>
	);
};
