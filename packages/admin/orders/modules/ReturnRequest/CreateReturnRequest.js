/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDrawer,
	ScForm,
	ScInput,
	ScBlockUi,
	ScFlex,
} from '@surecart/components-react';
import ReturnReasonsSelector from './ReturnReasonsSelector';
import { createErrorString } from '../../../util';
import ProductLineItem from '../../../ui/ProductLineItem';

export default ({
	fulfillmentItems,
	returnRequests,
	orderId,
	open,
	onRequestClose,
	onCreateSuccess,
}) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const [busy, setBusy] = useState(false);
	const [items, setItems] = useState([]);

	const getQtyReturned = (lineItemId) => {
		return (returnRequests || []).reduce(
			(total, returnRequest) =>
				total +
				(returnRequest?.return_items?.data || []).reduce(
					(total, returnItem) => {
						if (returnItem?.line_item?.id === lineItemId) {
							return total + returnItem?.quantity;
						}
						return total;
					},
					0
				),
			0
		);
	};

	useEffect(() => {
		setItems(
			(fulfillmentItems || [])
				.filter(
					({ id, fulfilled_quantity }) => {
						const qtyReturned = getQtyReturned(id);
						return fulfilled_quantity - qtyReturned > 0;
					}
				)
				.map(({ id, fulfilled_quantity, ...item }) => {
					const qtyReturned = getQtyReturned(id);
					return {
						...item,
						id,
						quantity: fulfilled_quantity - qtyReturned,
						fulfilled_quantity: fulfilled_quantity - qtyReturned,
						originalQuantity: fulfilled_quantity - qtyReturned,
						return_reason: 'unknown', // by default, set return reason to unknown
					};
				})
		);
	}, [fulfillmentItems]);

	const updateItems = (itemsIndex, data) => {
		setItems(
			items.map((item, index) => {
				if (index !== itemsIndex) {
					// This isn't the item we care about - keep it as-is
					return item;
				}

				// Otherwise, this is the one we want - return an updated value
				return {
					...item,
					...data,
				};
			})
		);
	};

	const submit = async () => {
		try {
			setBusy(true);
			await saveEntityRecord(
				'surecart',
				'return_request',
				{
					order: orderId,
					return_items: items
						.filter((item) => !!item.quantity)
						.map(({ id, quantity, return_reason, note }) => ({
							line_item: id,
							quantity,
							return_reason,
							note,
						})),
				},
				{
					throwOnError: true,
				}
			);
			onCreateSuccess();
			createSuccessNotice(__('Return created.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (error) {
			console.error(error);
			createErrorNotice(createErrorString(error), {
				type: 'snackbar',
			});
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScForm
			style={{
				'--sc-form-row-spacing': 'var(--sc-spacing-large)',
			}}
			onScSubmit={(e) => {
				e.stopImmediatePropagation();
				submit();
			}}
			onScSubmitForm={(e) => e.stopImmediatePropagation()}
		>
			<ScDrawer
				label={_n(
					'Return Item',
					'Return Items',
					items?.length,
					'surecart'
				)}
				stickyHeader={true}
				style={{ '--sc-drawer-size': '600px' }}
				open={open}
				onScRequestClose={onRequestClose}
			>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						height: 100%;
					`}
				>
					{(items || []).map((item, index) => {
						return (
							<div
								css={css`
									padding: var(--sc-spacing-x-large);
									border-bottom: 1px solid
										var(--sc-color-gray-300);
									display: grid;
									gap: 0.5em;
								`}
							>
								<ProductLineItem
									lineItem={item}
									showWeight={true}
									suffix={
										<ScInput
											label={__('Quantity', 'surecart')}
											showLabel={false}
											value={item.quantity}
											max={item.originalQuantity}
											type="number"
											min={0}
											onScInput={(e) => {
												updateItems(index, {
													quantity: parseInt(
														e.target.value
													),
												});
											}}
										>
											<span
												slot="suffix"
												css={css`
													opacity: 0.65;
												`}
											>
												{sprintf(
													__('of %d', 'surecart'),
													item?.originalQuantity
												)}
											</span>
										</ScInput>
									}
								/>
								{item?.quantity > 0 && (
									<ScFlex>
										<div
											css={css`
												margin-top: var(
													--sc-spacing-small
												);
												flex: 1;
											`}
										>
											<ReturnReasonsSelector
												returnRequest={item}
												onSelect={(value) => {
													updateItems(index, {
														return_reason: value,
													});
												}}
											/>
										</div>

										<div
											css={css`
												flex: 1;
											`}
										>
											{item?.return_reason ===
												'other' && (
													<ScInput
														label={__(
															'Reason',
															'surecart'
														)}
														value={item?.note}
														type="text"
														required
														css={css`
														margin-top: var(
															--sc-spacing-small
														);
													`}
														onScInput={(e) => {
															updateItems(index, {
																note: e.target
																	.value,
															});
														}}
													/>
												)}
										</div>
									</ScFlex>
								)}
							</div>
						);
					})}
				</div>

				<ScButton
					type="primary"
					slot="footer"
					submit
					busy={busy}
					disabled={!(items || []).some((item) => item?.quantity)}
				>
					{_n(
						'Return Item',
						'Return Items',
						items?.length,
						'surecart'
					)}
				</ScButton>
				<ScButton
					type="text"
					slot="footer"
					onClick={() => onRequestClose()}
				>
					{__('Cancel', 'surecart')}
				</ScButton>
				{busy && <ScBlockUi spinner />}
			</ScDrawer>
		</ScForm>
	);
};
