/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __, _n, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDrawer,
	ScForm,
	ScInput,
	ScFormatNumber,
	ScBlockUi,
	ScFlex,
} from '@surecart/components-react';
import LineItem from './components/LineItem';
import ReturnReasonsSelector from './ReturnReasonsSelector';
import { createErrorString } from '../../../util';

export default ({
	fulfillmentItems,
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

	useEffect(() => {
		setItems(
			(fulfillmentItems || []).map(
				({ quantity, fulfilled_quantity, ...item }) => {
					return {
						...item,
						quantity: 0,
						originalQuantity: fulfilled_quantity,
						return_reason: 'unknown', // by default, set return reason to unknown
					};
				}
			)
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
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-medium);
							padding: var(--sc-spacing-x-large);
						`}
					>
						{(items || []).map((item, index) => {
							return (
								<LineItem
									key={index}
									imageUrl={item?.price?.product?.image_url}
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
									reason={
										item?.quantity > 0 && (
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
																return_reason:
																	value,
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
																updateItems(
																	index,
																	{
																		note: e
																			.target
																			.value,
																	}
																);
															}}
														/>
													)}
												</div>
											</ScFlex>
										)
									}
								>
									<a
										href={addQueryArgs('admin.php', {
											page: 'sc-products',
											action: 'edit',
											id: item?.price?.product?.id,
										})}
									>
										{item?.price?.product?.name}
									</a>
									<ScFormatNumber
										type="unit"
										value={item?.price?.product?.weight}
										unit={item?.price?.product?.weight_unit}
									/>
								</LineItem>
							);
						})}
					</div>
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
