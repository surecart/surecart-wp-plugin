/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDrawer,
	ScDivider,
	ScForm,
	ScIcon,
	ScInput,
	ScFormatNumber,
	ScFormControl,
	ScTooltip,
	ScBlockUi,
	ScSwitch,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __, _n, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from 'react';
import AddressDisplay from '../../../components/AddressDisplay';
import Tracking from './components/Tracking';
import LineItem from './components/LineItem';

export default ({
	items: fulfillmentItems,
	orderId,
	checkout,
	open,
	onRequestClose,
	onCreateSuccess,
}) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const copy = async () => {
		try {
			const { name, line_1, line_2, city, state, postal_code, country } =
				checkout?.shipping_address;
			const address = [
				name,
				line_1,
				line_2,
				city,
				state,
				country,
				postal_code,
			];
			await navigator.clipboard.writeText(
				address.filter((item) => !!item).join('\n ')
			);
			createSuccessNotice(__('Copied to clipboard.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (err) {
			console.error(err);
			createErrorNotice(__('Error copying to clipboard.', 'surecart'), {
				type: 'snackbar',
			});
		}
	};

	const [busy, setBusy] = useState(false);
	const [items, setItems] = useState([]);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [trackings, setTrackings] = useState([
		{
			number: '',
			url: '',
		},
	]);

	useEffect(() => {
		setItems(
			(fulfillmentItems || []).map(
				({ quantity, fulfilled_quantity, ...item }) => {
					return {
						...item,
						quantity: quantity - fulfilled_quantity,
						originalQuantity: quantity - fulfilled_quantity,
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
		if (!orderId) return;
		try {
			setBusy(true);
			await saveEntityRecord(
				'surecart',
				'fulfillment',
				{
					order: orderId,
					fulfillment_items: items
						.filter((item) => !!item.quantity)
						.map(({ id, quantity }) => ({
							line_item: id,
							quantity,
						})),
					trackings: trackings.filter(
						({ number, url }) => !!number && !!url
					),
					notifications_enabled: notificationsEnabled,
				},
				{
					throwOnError: true,
				}
			);
			onCreateSuccess();
			createSuccessNotice(__('Fulfillment created.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (error) {
			console.error(error);
			setBusy(false);
			createErrorNotice(
				error?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		}
	};

	const shippable = (fulfillmentItems || []).some(
		(item) => item?.price?.product?.shipping_enabled
	);

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
					'Fulfill Item',
					'Fulfill Items',
					items?.length,
					'surecart'
				)}
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
											css={css`
												max-width: 100px;
											`}
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

					<ScDivider />

					<div
						css={css`
							padding: var(--sc-spacing-x-large);
						`}
					>
						{shippable && (
							<Tracking
								trackings={trackings}
								setTrackings={setTrackings}
							/>
						)}
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
						{shippable ? (
							<ScFormControl label={true}>
								<div slot="label">
									{__('Shipping Address', 'surecart')}
									{location.protocol === 'https:' && (
										<ScTooltip
											text={__(
												'Copy Address',
												'surecart'
											)}
											type="text"
										>
											<ScButton
												type="link"
												onClick={copy}
												circle
											>
												<ScIcon name="clipboard" />
											</ScButton>
										</ScTooltip>
									)}
								</div>

								<AddressDisplay
									address={checkout?.shipping_address}
								/>
							</ScFormControl>
						) : (
							<div
								css={css`
									color: var(--sc-input-help-text-color);
								`}
							>
								{__('No shipping required.', 'surecart')}
							</div>
						)}
					</div>

					<ScDivider />

					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-medium);
							padding: var(--sc-spacing-x-large);
						`}
					>
						<ScSwitch
							checked={notificationsEnabled}
							onScChange={(e) =>
								setNotificationsEnabled(e.target.checked)
							}
						>
							{__('Notify customer of shipment', 'surecart')}
							<span slot="description">
								{__(
									'Send shipment details to your customer now',
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
						'Fulfill Item',
						'Fulfill Items',
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
