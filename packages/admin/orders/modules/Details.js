/** @jsx jsx */

import { __, sprintf } from '@wordpress/i18n';

import { css, jsx } from '@emotion/core';
import { formatTime } from '../../util/time';
import {
	ScOrderStatusBadge,
	ScSkeleton,
	ScTag,
} from '@surecart/components-react';

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
				<ScSkeleton style={{ width: '45%' }}></ScSkeleton>
				<ScSkeleton style={{ width: '65%' }}></ScSkeleton>
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
						<ScTag type="warning">
							{__('Test Mode', 'surecart')}
						</ScTag>
					)}
				</div>
				{sprintf(
					__('Created on %s', 'surecart'),
					formatTime(order.updated_at)
				)}
			</div>
			<div>
				<ScOrderStatusBadge
					status={order?.status || checkout?.status}
				></ScOrderStatusBadge>
			</div>
		</div>
	);
};
