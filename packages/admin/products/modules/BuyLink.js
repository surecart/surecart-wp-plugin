/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDrawer,
	ScColumns,
	ScColumn,
	ScDashboardModule,
	ScSwitch,
	ScMenu,
	ScMenuItem,
	ScMenuDivider,
	ScDropdown,
	ScIcon,
	ScForm,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

export default ({ product, updateProduct, loading }) => {
	const [drawer, setDrawer] = useState(false);
	const updateMeta = (data) =>
		updateProduct({ metadata: { ...(product?.metadata || {}), ...data } });

	return (
		<>
			<ScDropdown placement="bottom-end">
				<ScButton slot="trigger" caret>
					<div
						slot="prefix"
						css={css`
							width: 6px;
							height: 6px;
							background-color: ${product?.metadata
								?.wp_buy_link_enabled
								? 'var(--sc-color-success-500)'
								: 'var(--sc-color-gray-300)'};
							border-radius: 999px;
						`}
					></div>
					{__('Instant Buy Link', 'surecart')}
				</ScButton>
				<ScMenu>
					<div
						css={css`
							position: relative;
							display: flex;
							align-items: stretch;
							text-align: left;
							color: var(
								--sc-menu-item-color,
								var(--sc-color-gray-700)
							);
							padding: var(--sc-spacing-xx-small)
								var(--sc-spacing-x-large);
						`}
					>
						<ScSwitch
							checked={product?.metadata?.wp_buy_link_enabled}
							onScChange={(e) =>
								updateMeta({
									wp_buy_link_enabled: e.target.checked,
								})
							}
						>
							{__('Enabled', 'surecart')}
						</ScSwitch>
					</div>
					{!!product?.metadata?.wp_buy_link_enabled && (
						<>
							<ScMenuDivider />
							<ScMenuItem onClick={() => setDrawer(true)}>
								<ScIcon name="sliders" slot="prefix" />
								{__('Edit Settings', 'surecart')}
							</ScMenuItem>
						</>
					)}
				</ScMenu>
			</ScDropdown>

			<ScDrawer
				style={{ '--sc-drawer-size': '100%' }}
				open={drawer}
				onScRequestClose={() => setDrawer(false)}
			>
				<span slot="label">{__('Edit Buy Page', 'surecart')}</span>
				<ScColumns
					is-stacked-on-mobile="1"
					style={{
						gap: 0,
						backgroundColor: 'var(--sc-color-gray-100)',
						height: '100%',
					}}
				>
					<ScColumn
						className="is-layout-constrained is-horizontally-aligned-right has-background"
						style={{
							padding: 'var(--sc-spacing-xxxx-large)',
							backgroundColor: '#fff',
							'--sc-column-content-width': '420px',
							'--sc-form-row-spacing': '25px',
						}}
					>
						<ScDashboardModule
							heading={__('Options', 'surecart')}
							style={{
								'--sc-dashboard-module-spacing':
									'var(--sc-form-row-spacing)',
							}}
						>
							<ScForm>
								<ScSwitch
									checked={
										product?.metadata
											?.wp_buy_link_product_image_disabled !==
										'true'
									}
									onScChange={
										(e) => {}
										// updateMeta({
										// 	wp_buy_link_product_image_disabled: e
										// 		.target.checked
										// 		? 'false'
										// 		: 'true',
										// })
									}
								>
									{__('Show product image', 'surecart')}
								</ScSwitch>
								<ScSwitch
									checked={
										product?.metadata
											?.wp_buy_link_product_image_disabled !==
										'true'
									}
									onScChange={
										(e) => {}
										// updateMeta({
										// 	wp_buy_link_product_image_disabled: e
										// 		.target.checked
										// 		? 'false'
										// 		: 'true',
										// })
									}
								>
									{__('Show product image', 'surecart')}
								</ScSwitch>
							</ScForm>
						</ScDashboardModule>
					</ScColumn>
					<ScColumn
						className="is-layout-constrained is-horizontally-aligned-left has-ast-global-color-5-background-color has-background"
						style={{
							padding: 'var(--sc-spacing-xxxx-large)',
							'--sc-column-content-width': '550px',
							'--sc-form-row-spacing': '30px',
						}}
					>
						{/* <div>
							<sc-columns
								is-stacked-on-mobile="1"
								is-full-height="1"
								style="gap:0"
							>
								<sc-column
									class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-right has-background"
									style={{
										backgroundColor: '#fafafa',
										padding: 'var(--sc-spacing-xxxx-large)',
										'--sc-column-content-width': '550px',
										'--sc-form-row-spacing': '25px',
									}}
								>
									{product?.image?.url && (
										<figure>
											<img
												decoding="async"
												src={product?.image?.url}
												alt={product?.name}
												style={{
													borderRadius:
														'var(--sc-border-radius-medium)',
												}}
											/>
										</figure>
									)}

									<sc-text
										style={{
											'--font-size':
												'var(--sc-font-size-xx-large)',
											'--font-weight':
												'var(--sc-font-weight-bold)',
										}}
									>
										{product?.name}
									</sc-text>

									<div
										dangerouslySetInnerHTML={
											product?.description
										}
									></div>

									{product?.prices?.data?.length && (
										<sc-price-choices
											type="radio"
											columns="1"
											class="wp-block-surecart-price-selector"
										>
											{(product?.prices?.data || []).map(
												(price) => {
													<sc-price-choice
														price-id={price?.id}
														type="radio"
														show-label
														show-price
														show-control
													></sc-price-choice>;
												}
											)}
										</sc-price-choices>
									)}
								</sc-column>

								<sc-column
									class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-left has-ast-global-color-5-background-color has-background"
									style={{
										padding: 'var(--sc-spacing-xxxx-large)',
										'--sc-column-content-width': '550px',
										'--sc-form-row-spacing': '25px',
									}}
								>
									<sc-customer-email
										class=""
										label="Email"
										placeholder="Your email address"
										required
										autocomplete="email"
										inputmode="email"
									></sc-customer-email>

									<sc-customer-name
										label="Name"
										placeholder="Your name"
										required
										class="wp-block-surecart-name"
									></sc-customer-name>

									<sc-order-shipping-address
										label="Address"
										full
										required="true"
										default-country="US"
										name-placeholder="Name or Company Name"
										country-placeholder="Country"
										city-placeholder="City"
										line-1-placeholder="Address"
										line-2-placeholder="Address Line 2"
										postal-code-placeholder="Postal Code/Zip"
										state-placeholder="State/Province/Region"
									></sc-order-shipping-address>

									<sc-payment></sc-payment>

									<sc-order-summary
										closed-text="Order Summary"
										open-text="Order Summary"
										class="wp-block-surecart-totals"
									>
										<sc-order-coupon-form label="Add Coupon Code">
											Apply
										</sc-order-coupon-form>
										<sc-line-item-total
											total="subtotal"
											class="wp-block-surecart-subtotal"
										>
											<span slot="description">
												Subtotal
											</span>
										</sc-line-item-total>
										<sc-line-item-tax class="wp-block-surecart-tax-line-item"></sc-line-item-tax>
										<sc-line-item-total
											total="total"
											size="large"
											show-currency="1"
											class="wp-block-surecart-total"
										>
											<span slot="title">Total</span>
											<span slot="subscription-title">
												Total Due Today
											</span>
										</sc-line-item-total>
									</sc-order-summary>
									<sc-order-submit
										type="primary"
										full="true"
										size="large"
										icon="lock"
										show-total="true"
										class="wp-block-surecart-submit"
									>
										{__('Purchase', 'surecart')}
									</sc-order-submit>
								</sc-column>
							</sc-columns>
						</div> */}
					</ScColumn>
				</ScColumns>
				<ScButton type="primary" slot="footer">
					{__('Update Page', 'surecart')}
				</ScButton>
				<ScButton
					type="text"
					slot="footer"
					onClick={() => setDrawer(false)}
				>
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScDrawer>
		</>
	);
};
