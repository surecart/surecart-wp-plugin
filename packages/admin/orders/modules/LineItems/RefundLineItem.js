/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScFormatNumber } from '@surecart/components-react';
import { refundReasons } from '../../../util/refunds';

export default ({ label, refund }) => {
	const totalItems = refund?.refund_items?.data?.reduce(
		(acc, item) => acc + item.quantity,
		0
	);

	return (
		<sc-line-item
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
						flex: 1;
					`}
				>
					{label}
				</span>
				<span
					css={css`
						flex: 2;
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
						: __('no reason provided', 'surecart')}
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
		</sc-line-item>
	);
};
