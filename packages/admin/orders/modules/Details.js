/** @jsx jsx */

import { __, sprintf } from '@wordpress/i18n';

import { css, jsx } from '@emotion/core';
import useOrderData from '../hooks/useOrderData';
import { formatTime } from '../../util/time';

export default () => {
	const { order, loading } = useOrderData();

	if (!order?.id) {
		return null;
	}

	const renderBadge = (status) => {
		switch (status) {
			case 'paid':
				return (
					<ce-tag type="success">
						{__('Paid', 'checkout_engine')}
					</ce-tag>
				);
			case 'finalized':
				return (
					<ce-tag type="warning">
						{__('Pending Payment', 'checkout_engine')}
					</ce-tag>
				);
			default:
				return <ce-tag>{status}</ce-tag>;
		}
	};
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
						<ce-format-number
							type="currency"
							currency={order?.currency}
							value={order?.total_amount}
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
