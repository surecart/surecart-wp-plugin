/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScFormatNumber, ScLineItem } from '@surecart/components-react';
import { refundReasons } from '../../../util/refunds';

export default ({ label, refund }) => {
	const anchor = useRef();
	const [isVisible, setIsVisible] = useState(false);
	const firstRefundedItem = refund?.refund_items?.data[0];

	return (
		<ScLineItem>
			<div
				slot="description"
				css={css`
					display: flex;
					justify-content: space-between;
					width: 100%;
				`}
			>
				<span
					css={css`
						flex: 1;
						min-width: 100px;
					`}
				>
					{label}
				</span>
				<span
					css={css`
						flex: 2;
					`}
				>
					{!!firstRefundedItem && (
						<span>
							{firstRefundedItem?.quantity} x{' '}
							{firstRefundedItem?.line_item?.price?.product?.name}
						</span>
					)}
					{refund?.refund_items?.data?.length > 1 && (
						<div
							onMouseEnter={() => setIsVisible(true)}
							onMouseLeave={() => setIsVisible(false)}
							css={css`
								cursor: pointer;
							`}
						>
							{__('and', 'surecart')}
							<span
								style={{
									textDecoration: 'underline',
								}}
								ref={anchor}
							>
								{sprintf(
									__(' %d more', 'surecart'),
									refund.refund_items.data.length - 1
								)}
							</span>

							{isVisible && (
								<Popover
									anchor={anchor.current}
									placement="top-start"
								>
									<div
										css={css`
											padding: 1em;
											width: 200px;
											max-height: 200px;
											overflow-y: auto;
										`}
									>
										{refund.refund_items.data
											?.slice(1)
											.map((item, index) => (
												<div
													key={index}
													css={css`
														padding: 0.5em 0px;
														border-bottom: ${index !==
														refund.refund_items.data.slice(
															1
														).length -
															1
															? '1px solid var(--sc-color-gray-200)'
															: 'none'};
													`}
												>
													{`${item?.quantity} x ${item?.line_item?.price?.product?.name}`}
												</div>
											))}
									</div>
								</Popover>
							)}
						</div>
					)}{' '}
					{refund?.reason
						? __('Reason: ', 'surecart') +
						  `"${refundReasons[refund?.reason]}"`
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
		</ScLineItem>
	);
};
