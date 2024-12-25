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
	ScButton,
	ScDrawer,
	ScEmpty,
	ScFormatDate,
	ScFormatNumber,
	ScIcon,
	ScSkeleton,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScTag,
	ScText,
} from '@surecart/components-react';
import { refundReasons } from '../../../util/refunds';
import ProductLineItem from '../../../ui/ProductLineItem';
import useRefund from '../../hooks/useRefund';

export default ({ chargeId, onRequestClose, open }) => {
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

	const { refunds, loading } = useRefund(chargeId);

	// don't render anything if loading.
	if (loading || !refunds?.length) {
		return null;
	}

	const renderContent = () => {
		if (loading) {
			return (
				<div
					css={css`
						display: grid;
						gap: 0.5em;
						padding: var(--sc-drawer-body-spacing);
					`}
				>
					<ScSkeleton style={{ width: '40%' }}></ScSkeleton>
					<ScSkeleton style={{ width: '60%' }}></ScSkeleton>
					<ScSkeleton style={{ width: '30%' }}></ScSkeleton>
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
									<ScFormatDate
										date={updated_at}
										month="long"
										day="numeric"
										year="numeric"
										hour="numeric"
										minute="numeric"
										type="timestamp"
									/>
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
				open={open}
				stickyHeader
				onScAfterHide={() => onRequestClose()}
			>
				<span
					slot="header"
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: var(--sc-drawer-header-spacing);
						border-bottom: var(--sc-drawer-border);
					`}
				>
					{__('Refund History', 'surecart')}

					<ScButton
						type="text"
						size="small"
						onClick={() => onRequestClose()}
					>
						<ScIcon class="cart__close" name="x"></ScIcon>
					</ScButton>
				</span>
				{renderContent()}
			</ScDrawer>
		</>
	);
};
