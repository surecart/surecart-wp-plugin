/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScFormatNumber, ScLineItem } from '@surecart/components-react';
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
						{dispute?.reason
							? `${__('Reason: ', 'surecart')} "${dispute?.reason}"`
							: __('no reason provided', 'surecart')}{' '}
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
				<ScFormatNumber
					slot="price"
					style={{
						'font-weight': 'var(--sc-font-weight-semibold)',
						color: 'var(--sc-color-gray-800)',
					}}
					type="currency"
					currency={dispute?.currency}
					value={-dispute?.amount}
				></ScFormatNumber>
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