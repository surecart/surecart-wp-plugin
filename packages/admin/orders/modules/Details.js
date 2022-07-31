/** @jsx jsx */

import { __, sprintf } from '@wordpress/i18n';

import { css, jsx } from '@emotion/core';
import { formatTime } from '../../util/time';

export default ({ order, checkout, loading }) => {
	if (loading) {
		return (
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 1.5em;
					margin-bottom: 2em;
				`}
			>
				<sc-skeleton style={{ width: '45%' }}></sc-skeleton>
				<sc-skeleton style={{ width: '65%' }}></sc-skeleton>
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
					<h1>#{order?.number}</h1>
					{!checkout?.live_mode && (
						<sc-tag type="warning">
							{__('Test Mode', 'surecart')}
						</sc-tag>
					)}
				</div>
				{sprintf(
					__('Created on %s', 'surecart'),
					formatTime(order.updated_at)
				)}
			</div>
			<div>
				<sc-order-status-badge
					status={order?.status || checkout?.status}
				></sc-order-status-badge>
			</div>
		</div>
	);
};
