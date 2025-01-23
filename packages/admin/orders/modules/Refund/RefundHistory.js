/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { Popover, ProgressBar } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import {
	ScDrawer,
	ScEmpty,
	ScFormatNumber,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScTag,
	ScText,
} from '@surecart/components-react';
import { refundReasons } from '../../../util/refunds';
import ProductLineItem from '../../../ui/ProductLineItem';
import { formatDateTime } from '../../../util/time';

export default ({ chargeId, onRequestClose }) => {
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

	// get the refunds.
	const { records: refunds, hasResolved } = useEntityRecords(
		'surecart',
		'refund',
		{
			context: 'edit',
			charge_ids: [chargeId],
			per_page: 100,
			expand: [
				'refund_items',
				'refund_item.line_item',
				'line_item.price',
				'line_item.variant',
				'variant.image',
				'price.product',
				'product.featured_product_media',
				'product.product_medias',
				'product_media.media',
			],
		}
	);

	const renderContent = () => {
		if (!hasResolved) {
			return (
				<div
					css={css`
						display: flex;
						justify-content: center;
						align-items: center;
						height: 100%;
					`}
				>
					<ProgressBar />
				</div>
			);
		}

		if (!refunds?.length) {
			return (
				<div
					css={css`
						padding: var(--sc-drawer-body-spacing);
					`}
				>
					<ScEmpty icon="activity">
						{__('There are no refund history', 'surecart')}
					</ScEmpty>
				</div>
			);
		}

		return (
			<div>
				<ScTable>
					<ScTableCell slot="head" style={{ width: '200px' }}>
						{__('Product', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Date', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Amount Refunded', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Reason', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Status', 'surecart')}
					</ScTableCell>

					{(refunds || []).map(
						({
							amount,
							currency,
							updated_at,
							reason,
							refund_items,
						}) => (
							<ScTableRow>
								<ScTableCell>
									{refund_items?.data?.[0]?.line_item?.price
										?.product?.id ? (
										<>
											<ProductLineItem
												lineItem={
													refund_items?.data?.[0]
														?.line_item
												}
											/>

											{refund_items?.data?.length > 1 && (
												<div
													onMouseEnter={() =>
														setIsVisible(true)
													}
													onMouseLeave={() =>
														setIsVisible(false)
													}
													css={css`
														cursor: pointer;
													`}
												>
													{__('and', 'surecart')}
													<span
														style={{
															textDecoration:
																'underline',
														}}
														ref={anchor}
													>
														{sprintf(
															__(
																' %d more',
																'surecart'
															),
															refund_items.data
																.length - 1
														)}
													</span>
													{isVisible && (
														<Popover
															anchor={
																anchor.current
															}
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
																{refund_items.data
																	?.slice(1)
																	?.map(
																		(
																			item,
																			index
																		) => (
																			<div
																				key={
																					index
																				}
																				css={css`
																					padding: 0.5em
																						0px;
																					border-bottom: ${index !==
																					refund_items
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
																		)
																	)}
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
									)}
								</ScTableCell>
								<ScTableCell>
									{formatDateTime(updated_at * 1000)}
								</ScTableCell>
								<ScTableCell>
									<sc-text
										style={{
											'--font-weight':
												'var(--sc-font-weight-bold)',
										}}
									>
										-
										<ScFormatNumber
											type="currency"
											currency={currency || 'usd'}
											value={amount}
										/>
									</sc-text>
								</ScTableCell>
								<ScTableCell>
									<ScText
										css={css`
											color: var(--sc-color-gray-500);
										`}
									>
										{refundReasons?.[reason] ||
											__('Unknown', 'surecart')}
									</ScText>
								</ScTableCell>
								<ScTableCell>
									{renderRefundStatusBadge('succeeded')}
								</ScTableCell>
							</ScTableRow>
						)
					)}
				</ScTable>
			</div>
		);
	};

	return (
		<>
			<ScDrawer
				style={{ '--sc-drawer-size': '48rem' }}
				open={true}
				stickyHeader
				onScAfterHide={() => onRequestClose()}
				label={__('Refund History', 'surecart')}
			>
				{renderContent()}
			</ScDrawer>
		</>
	);
};
