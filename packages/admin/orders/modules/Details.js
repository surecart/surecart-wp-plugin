/** @jsx jsx */

import { __, sprintf } from '@wordpress/i18n';

import { css, jsx } from '@emotion/core';
import {
	ScOrderStatusBadge,
	ScSkeleton,
	ScTag,
	ScOrderFulfillmentBadge,
	ScOrderReturnBadge,
} from '@surecart/components-react';

export default ({ order, checkout, loading, returnRequests }) => {
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

	// if any return request with status 'open' then make the status as 'open'
	const returnRequestStatus = returnRequests?.some(
		(returnRequest) => returnRequest?.status === 'open'
	)
		? 'open'
		: 'completed';

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
					<ScOrderStatusBadge status={order?.status} pill />
					<ScOrderFulfillmentBadge
						status={order?.fulfillment_status}
						pill
					/>

					{!!returnRequests?.length && (
						<ScOrderReturnBadge status={returnRequestStatus} pill />
					)}
				</div>
				{sprintf(
					__('Created on %s', 'surecart'),
					order?.created_at_date_time
				)}
			</div>

			{!checkout?.live_mode && (
				<ScTag type="warning">{__('Test Mode', 'surecart')}</ScTag>
			)}
		</div>
	);
};
