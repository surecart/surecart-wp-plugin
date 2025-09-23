/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScLineItem } from '@surecart/components-react';
import DisputeHistory from './DisputeHistory';

export default ({ order, label, dispute }) => {
	const [modal, setModal] = useState(false);

	return (
		<>
			<ScLineItem
				style={{
					'--line-item-grid-template-columns': 'auto 3fr 1fr',
				}}
			>
				<div
					slot="description"
					css={css`
						display: flex;
						justify-content: space-between;
					`}
				>
					<span
						css={css`
							flex: 1 1 175px;
						`}
					>
						{label}
					</span>
					<span
						css={css`
							flex: 1 1 100%;
						`}
					>
						{dispute?.created_at_date_time}{' '}
						<span>
							(
							<a
								href="javascript:void(0)"
								onClick={(e) => {
									e.preventDefault();
									setModal('dispute_history');
								}}
							>
								{__('View Details', 'surecart')}
							</a>
							)
						</span>
					</span>
				</div>
				<span slot="price" css={css` var(--sc-color-gray-800);`}>
					-{dispute?.display_amount}
				</span>
			</ScLineItem>

			{modal === 'dispute_history' && (
				<DisputeHistory
					disputeId={dispute?.id}
					chargeId={order?.checkout?.charge?.id}
					onRequestClose={() => setModal(false)}
				/>
			)}
		</>
	);
};
