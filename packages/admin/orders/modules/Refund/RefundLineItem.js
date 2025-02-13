/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScFormatNumber, ScLineItem } from '@surecart/components-react';
import { refundReasons } from '../../../util/refunds';
import RefundHistory from './RefundHistory';

export default ({ order, label, refund }) => {
	const [modal, setModal] = useState(false);
	const totalItems = refund?.refund_items?.data?.reduce(
		(acc, item) => acc + item.quantity,
		0
	);

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
						{totalItems > 0 && (
							<>
								{sprintf(
									_n(
										'%d item',
										'%d items',
										totalItems,
										'surecart'
									),
									totalItems
								)}
								,{' '}
							</>
						)}
						{refund?.reason
							? `${__('Reason: ', 'surecart')} ”${
									refundReasons[refund?.reason]
							  }”`
							: __('no reason provided', 'surecart')}{' '}
						<span>
							(
							<a
								href="javascript:void(0)"
								onClick={(e) => {
									e.preventDefault();
									setModal('refund_history');
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
					currency={refund?.currency}
					value={-refund?.amount}
				></ScFormatNumber>
			</ScLineItem>

			{modal === 'refund_history' && (
				<RefundHistory
					refundId={refund?.id}
					chargeId={order?.checkout?.charge?.id}
					onRequestClose={() => setModal(false)}
				/>
			)}
		</>
	);
};
