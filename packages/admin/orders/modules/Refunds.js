/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import {
	ScFormatDate,
	ScFormatNumber,
	ScTag,
	ScText,
	ScTooltip,
} from '@surecart/components-react';
import DataTable from '../../components/DataTable';
import { refundReasons } from '../../util/refunds';
import ProductLineItem from '../../ui/ProductLineItem';

export default ({ refunds, loading }) => {
	const anchor = useRef();
	const [isVisible, setIsVisible] = useState(false);

	const renderRefundStatusBadge = (status) => {
		switch (status) {
			case 'pending':
				return (
					<ScTag type="warning">{__('Pending', 'surecart')}</ScTag>
				);
			case 'succeeded':
				return (
					<ScTag type="success">{__('Succeeded', 'surecart')}</ScTag>
				);
			case 'failed':
				return <ScTag type="danger">{__('Failed', 'surecart')}</ScTag>;
			case 'canceled':
				return (
					<ScTag type="danger">{__('Canceled', 'surecart')}</ScTag>
				);
		}
		return <ScTag>{status || __('Unknown', 'surecart')}</ScTag>;
	};

	// don't render anything if loading.
	if (loading || !refunds?.length) {
		return null;
	}

	return (
		<>
			<DataTable
				title={__('Refunds', 'surecart')}
				loading={loading}
				columns={{
					product: {
						label: __('Product', 'surecart'),
					},
					date: {
						label: __('Date', 'surecart'),
					},
					amount: {
						label: __('Amount Refunded', 'surecart'),
					},
					refund_reason: {
						label: __('Reason', 'surecart'),
					},
					status: {
						label: __('Status', 'surecart'),
						width: '100px',
					},
				}}
				items={refunds?.map((refund) => {
					return {
						product: refund?.refund_items?.data?.[0]?.line_item
							?.price?.product?.id ? (
							<>
								<ProductLineItem
									lineItem={
										refund?.refund_items?.data?.[0]
											?.line_item
									}
								/>

								{/* if more than 1 items, show only there names */}
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
												refund.refund_items.data
													.length - 1
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
														?.map((item, index) => (
															<div
																key={index}
																css={css`
																	padding: 0.5em
																		0px;
																	border-bottom: ${index !==
																	refund
																		.refund_items
																		.data
																		.length -
																		2
																		? '1px solid var(--sc-color-gray-200)'
																		: 'none'};
																`}
															>
																<ProductLineItem
																	lineItem={
																		item.line_item
																	}
																/>
															</div>
														))}
												</div>
											</Popover>
										)}
									</div>
								)}
							</>
						) : (
							<ScText
								css={css`
									color: var(--sc-color-gray-500);
								`}
							>
								{__('No product', 'surecart')}
							</ScText>
						),
						amount: (
							<sc-text
								style={{
									'--font-weight':
										'var(--sc-font-weight-bold)',
								}}
							>
								-
								<ScFormatNumber
									type="currency"
									currency={refund?.currency || 'usd'}
									value={refund?.amount}
								/>
							</sc-text>
						),
						date: (
							<ScFormatDate
								date={refund?.updated_at}
								month="long"
								day="numeric"
								year="numeric"
								hour="numeric"
								minute="numeric"
								type="timestamp"
							/>
						),
						refund_reason: (
							<ScText
								css={css`
									color: var(--sc-color-gray-500);
								`}
							>
								{refundReasons?.[refund?.reason] ||
									__('Unknown', 'surecart')}
							</ScText>
						),
						status: (
							<>
								<ScTooltip
									type="danger"
									text={
										refund?.failure_reason ===
										'insufficient_funds'
											? __(
													'Insufficient Funds',
													'surecart'
											  )
											: null
									}
								>
									{renderRefundStatusBadge(refund?.status)}
								</ScTooltip>
							</>
						),
					};
				})}
			/>
		</>
	);
};
