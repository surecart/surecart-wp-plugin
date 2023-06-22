/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDrawer,
	ScDivider,
	ScForm,
	ScIcon,
	ScSwitch,
	ScInput,
	ScFormatNumber,
	ScFormControl,
	ScTooltip,
	ScBlockUi,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { __, _n, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';
import AddressDisplay from '../../../components/AddressDisplay';
import { update } from 'lodash';

export default ({
	items: fulfillmentItems,
	orderId,
	checkout,
	open,
	onRequestClose,
}) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [busy, setBusy] = useState(false);
	const [tracking, setTracking] = useState([
		{
			tracking_number: '',
			tracking_url: '',
		},
	]);

	const [items, setItems] = useState(
		(fulfillmentItems || []).map(({ quantity, ...item }) => {
			return {
				...item,
				quantity,
				originalQuantity: quantity,
			};
		})
	);

	const updateTrackingItem = (trackingIndex, data) => {
		setTracking(
			tracking.map((item, index) => {
				if (index !== trackingIndex) {
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
		if (!orderId) return;
		try {
			setBusy(true);
			await saveEntityRecord(
				'surecart',
				'fulfillment',
				{
					order: orderId,
					fulfillment_items: items.map(({ id, quantity }) => ({
						line_item: id,
						quantity,
					})),
				},
				{
					throwOnError: true,
				}
			);
			onRequestClose();
		} catch (error) {
			setBusy(false);
			console.error(error);
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
			onScSubmitForm={(e) => {
				e.stopImmediatePropagation();
			}}
		>
			<ScDrawer
				label={_n(
					'Fulfill item',
					'Fulfill items',
					items?.length,
					'surecart'
				)}
				style={{ '--sc-drawer-size': '600px' }}
				open={open}
				onScRequestClose={() => onRequestClose()}
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
								<div
									css={css`
										box-sizing: border-box;
										margin: 0px;
										min-width: 0px;
										display: flex;
										gap: 18px;
										justify-content: space-between;
										align-items: stretch;
										width: 100%;
										border-bottom: none;
										${item?.price?.product?.image_url
											? 'align-items: center'
											: ''};
										${item?.price?.product?.image_url
											? 'container-type: inline-size'
											: ''};
									`}
								>
									{!!item?.price?.product?.image_url && (
										<img
											src={
												item?.price?.product?.image_url
											}
											css={css`
												width: var(
													--sc-product-line-item-image-size,
													4em
												);
												height: var(
													--sc-product-line-item-image-size,
													4em
												);
												object-fit: cover;
												border-radius: 4px;
												border: solid 1px
													var(
														--sc-input-border-color,
														var(--sc-input-border)
													);
												display: block;
												box-shadow: var(
													--sc-input-box-shadow
												);
											`}
										/>
									)}

									<div
										css={css`
											flex: 1 1 0%;
										`}
									>
										<div
											css={css`
												box-sizing: border-box;
												margin: 0px;
												min-width: 0px;
												display: flex;
												gap: 6px;
												flex-direction: column;
												align-items: flex-start;
												justify-content: flex-start;
											`}
										>
											<a
												href={addQueryArgs(
													'admin.php',
													{
														page: 'sc-products',
														action: 'edit',
														id: item?.price?.product
															?.id,
													}
												)}
											>
												{item?.price?.product?.name}
											</a>
										</div>
										<ScFormatNumber
											type="unit"
											value={item?.price?.product?.weight}
											unit={
												item?.price?.product
													?.weight_unit
											}
										/>
										{/* Add SKU and Variant here in the future. */}
									</div>

									<div>
										<ScInput
											label={__('Quantity', 'surecart')}
											showLabel={false}
											value={item.quantity}
											max={item.quantity}
											type="number"
											css={css`
												max-width: 100px;
											`}
											onScInput={(e) => {
												setTimeout(() => {
													updateItems(index, {
														quantity: Math.min(
															e.target.value,
															item?.originalQuantity
														),
													});
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
									</div>
								</div>
							);
						})}
					</div>

					<ScDivider />

					<div
						css={css`
							padding: var(--sc-spacing-x-large);
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						{(tracking || []).map(
							({ tracking_number, tracking_url }, index) => (
								<div
									css={css`
										display: flex;
										gap: 1em;
										&:not(:first-child) {
											border-top: 1px solid
												var(--sc-color-gray-200);
											padding-top: var(
												--sc-spacing-large
											);
										}
									`}
								>
									<div
										css={css`
											display: grid;
											flex: 1;
											gap: var(--sc-spacing-large);
										`}
									>
										<div
											css={css`
												width: 100%;
												display: flex;
												gap: var(--sc-spacing-large);
												flex-wrap: wrap;
											`}
										>
											<ScInput
												css={css`
													flex: 1;
												`}
												label={__(
													'Tracking number',
													'surecart'
												)}
												value={tracking_number}
												onScInput={(e) =>
													updateTrackingItem(index, {
														tracking_number:
															e.target.value,
													})
												}
											/>
											<ScInput
												css={css`
													flex: 1;
												`}
												label={__(
													'Tracking Link',
													'surecart'
												)}
												type="url"
												value={tracking_url}
												onScInput={(e) =>
													updateTrackingItem(index, {
														tracking_url:
															e.target.value,
													})
												}
											/>
										</div>
									</div>
									{tracking?.length > 1 && (
										<ScButton
											type="text"
											circle
											onClick={() => {
												setTracking(
													tracking.filter(
														(_, i) => i !== index
													)
												);
											}}
										>
											<ScIcon name="trash" />
										</ScButton>
									)}
								</div>
							)
						)}

						<div>
							<ScButton
								type="link"
								onClick={() =>
									setTracking([
										...tracking,
										{
											tracking_url: '',
											tracking_number: '',
											carrier: '',
										},
									])
								}
							>
								<ScIcon name="plus" slot="prefix" />
								{__('Add another tracking number', 'surecart')}
							</ScButton>
						</div>
					</div>

					<ScDivider
						css={css`
							margin-top: auto;
						`}
					/>

					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-medium);
							padding: var(--sc-spacing-x-large);
						`}
					>
						<ScFormControl label={true}>
							<div slot="label">
								{__('Shipping Address', 'surecart')}
								<ScTooltip
									text={__('Copy Address', 'surecart')}
									type="text"
								>
									<ScButton type="link" circle>
										<ScIcon name="clipboard" />
									</ScButton>
								</ScTooltip>
							</div>
							<AddressDisplay
								address={checkout?.shipping_address}
							/>
						</ScFormControl>
					</div>

					<ScDivider />

					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-medium);
							padding: var(--sc-spacing-x-large);
						`}
					>
						<ScSwitch>
							{__('Notify customer of shipment', 'surecart')}
							<span slot="description">
								{__(
									'Send shipping details to your customer',
									'surecart'
								)}
							</span>
						</ScSwitch>
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
						'Fulfill item',
						'Fulfill items',
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
