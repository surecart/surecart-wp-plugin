/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDrawer,
	ScDivider,
	ScDropdown,
	ScForm,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScProductLineItem,
	ScSwitch,
	ScTag,
	ScInput,
	ScFormatNumber,
} from '@surecart/components-react';
import { __, _n, sprintf } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { intervalString } from '../../../util/translations';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';

export default ({ items }) => {
	const [modal, setModal] = useState(false);
	const [tracking, setTracking] = useState([
		{
			tracking_number: '',
			carrier: '',
			tracking_link: '',
		},
	]);

	function updateTrackingItem(trackingIndex, data) {
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
	}

	return (
		<>
			<Box
				title={
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<ScIcon
							css={css`
								font-size: 22px;
								color: var(--sc-color-warning-500);
							`}
							name={'circle'}
						/>
						{__('Unfulfilled', 'surecart')}
						<ScTag
							css={css`
								font-size: 12px;
							`}
							pill
							type={'warning'}
						>
							{sprintf(
								_n(
									'%d Item',
									'%d Items',
									items?.length,
									'surecart'
								),
								items?.length
							)}
						</ScTag>
					</div>
				}
				header_action={
					<ScDropdown placement="bottom-end">
						<ScButton
							circle
							type="text"
							style={{
								'--button-color': 'var(--sc-color-gray-600)',
								margin: '-10px',
							}}
							slot="trigger"
						>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem>
								{__('Print packing slip', 'surecart')}
							</ScMenuItem>
							<ScMenuItem
								css={css`
									--sc-menu-item-color: var(
										--sc-color-danger-600
									);
								`}
							>
								{__('Cancel fulfillment', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				}
				footer={
					<ScButton type="default" onClick={() => setModal(true)}>
						{_n(
							'Fulfill and ship item',
							'Fulfill and ship items',
							items?.length,
							'surecart'
						)}
					</ScButton>
				}
			>
				{(items || []).map((item) => {
					return (
						<ScProductLineItem
							key={item.id}
							imageUrl={item?.price?.product?.image_url}
							name={item?.price?.product?.name}
							editable={false}
							removable={false}
							fees={item?.fees?.data}
							quantity={item.quantity}
							amount={item.subtotal_amount}
							currency={item?.price?.currency}
							trialDurationDays={item?.price?.trial_duration_days}
							interval={intervalString(item?.price)}
						></ScProductLineItem>
					);
				})}
			</Box>

			<ScForm
				style={{
					'--sc-form-row-spacing': 'var(--sc-spacing-large)',
				}}
			>
				<ScDrawer
					label={_n(
						'Fulfill and ship item',
						'Fulfill and ship items',
						items?.length,
						'surecart'
					)}
					style={{ '--sc-drawer-size': '600px' }}
					open={modal}
					onScRequestClose={() => setModal(false)}
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
							{(items || []).map((item) => {
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
													item?.price?.product
														?.image_url
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
															var(
																--sc-input-border
															)
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
															id: item?.price
																?.product?.id,
														}
													)}
												>
													{item?.price?.product?.name}
												</a>
											</div>
											<ScFormatNumber
												type="unit"
												value={
													item?.price?.product?.weight
												}
												unit={
													item?.price?.product
														?.weight_unit
												}
											/>
											{/* Add SKU and Variant here in the future. */}
										</div>

										<div>
											<ScInput
												label={__(
													'Quantity',
													'surecart'
												)}
												showLabel={false}
												value={item.quantity}
												max={item.quantity}
												type="number"
												css={css`
													max-width: 100px;
												`}
											>
												<span
													slot="suffix"
													css={css`
														opacity: 0.65;
													`}
												>
													{sprintf(
														__('of %d', 'surecart'),
														item?.quantity
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
								(
									{ tracking_number, tracking_link, carrier },
									index
								) => (
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
													gap: var(
														--sc-spacing-large
													);
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
														updateTrackingItem(
															index,
															{
																tracking_number:
																	e.target
																		.value,
															}
														)
													}
												/>
												<ScInput
													css={css`
														flex: 1;
													`}
													label={__(
														'Shipping carrier',
														'surecart'
													)}
													value={carrier}
													onScInput={(e) =>
														updateTrackingItem(
															index,
															{
																carrier:
																	e.target
																		.value,
															}
														)
													}
												/>
											</div>

											<ScInput
												label={__(
													'Tracking Link',
													'surecart'
												)}
												type="url"
												value={tracking_link}
												onScInput={(e) =>
													updateTrackingItem(index, {
														tracking_link:
															e.target.value,
													})
												}
											/>
										</div>
										{tracking?.length > 1 && (
											<ScButton
												type="text"
												circle
												onClick={() => {
													setTracking(
														tracking.filter(
															(_, i) =>
																i !== index
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
												tracking_link: '',
												tracking_number: '',
												carrier: '',
											},
										])
									}
								>
									<ScIcon name="plus" slot="prefix" />
									{__(
										'Add another tracking number',
										'surecart'
									)}
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

					<ScButton type="primary" slot="footer" submit>
						{_n(
							'Fulfill and ship item',
							'Fulfill and ship items',
							items?.length,
							'surecart'
						)}
					</ScButton>
					<ScButton
						type="text"
						slot="footer"
						onClick={() => setModal(false)}
					>
						{__('Cancel', 'surecart')}
					</ScButton>
				</ScDrawer>
			</ScForm>
		</>
	);
};
