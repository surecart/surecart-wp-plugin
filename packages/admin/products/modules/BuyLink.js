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
	ScDivider,
	ScFormControl,
	ScInput,
} from '@surecart/components-react';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { BlockPreview } from '@wordpress/block-editor';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useDispatch } from '@wordpress/data';

export default ({ product, updateProduct, loading }) => {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const [drawer, setDrawer] = useState(false);
	const updateMeta = (data) =>
		updateProduct({ metadata: { ...(product?.metadata || {}), ...data } });

	const menuCss = css`
		position: relative;
		display: grid;
		gap: var(--sc-spacing-large);
		align-items: stretch;
		text-align: left;
		color: var(--sc-menu-item-color, var(--sc-color-gray-700));
		padding: var(--sc-spacing-x-large);
	`;

	const copy = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
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

	return (
		<>
			<ScDropdown
				placement="bottom-end"
				style={{ '--panel-width': '380px' }}
				onScHide={(e) => {
					console.log(e);
				}}
			>
				<ScButton slot="trigger" caret>
					<div
						slot="prefix"
						css={css`
							width: 6px;
							height: 6px;
							background-color: ${product?.metadata
								?.wp_buy_link_enabled === 'true'
								? 'var(--sc-color-success-500)'
								: 'var(--sc-color-gray-300)'};
							border-radius: 999px;
						`}
					></div>
					{__('Instant Buy Link', 'surecart')}
				</ScButton>
				<ScMenu>
					<div css={menuCss}>
						<ScSwitch
							checked={
								product?.metadata?.wp_buy_link_enabled ===
								'true'
							}
							onScChange={(e) =>
								updateMeta({
									wp_buy_link_enabled: e.target.checked
										? 'true'
										: 'false',
								})
							}
						>
							{__('Published', 'surecart')}

							<span slot="description">
								{__(
									'Instantly publish a shareable page for this product.',
									'surecart'
								)}
							</span>
						</ScSwitch>

						<ScSwitch
							checked={
								product?.metadata
									?.wp_buy_link_test_mode_enabled === 'true'
							}
							onScChange={(e) =>
								updateMeta({
									wp_buy_link_test_mode_enabled: e.target
										.checked
										? 'true'
										: 'false',
								})
							}
						>
							{__('Test Mode', 'surecart')}
							<span slot="description">
								{__(
									'Make test payments with this product.',
									'surecart'
								)}
							</span>
						</ScSwitch>

						<ScMenuDivider />

						<ScSwitch
							checked={
								product?.metadata
									?.wp_buy_link_product_image_disabled !==
								'true'
							}
							onScChange={(e) =>
								updateMeta({
									wp_buy_link_product_image_disabled: e.target
										.checked
										? 'false'
										: 'true',
								})
							}
						>
							{__('Show product image', 'surecart')}
						</ScSwitch>

						<ScSwitch
							checked={
								product?.metadata
									?.wp_buy_link_product_description_disabled !==
								'true'
							}
							onScChange={(e) =>
								updateMeta({
									wp_buy_link_product_description_disabled: e
										.target.checked
										? 'false'
										: 'true',
								})
							}
						>
							{__('Show product description', 'surecart')}
						</ScSwitch>
						<ScSwitch
							checked={
								product?.metadata
									?.wp_buy_link_coupon_field_disabled !==
								'true'
							}
							onScChange={(e) =>
								updateMeta({
									wp_buy_link_coupon_field_disabled: e.target
										.checked
										? 'false'
										: 'true',
								})
							}
						>
							{__('Show coupon field', 'surecart')}
						</ScSwitch>
						<ScDivider />
						<ScInput
							label={__('URL Slug', 'surecart')}
							help={__('The last part of the URL', 'surecart')}
							value={product?.slug}
							onScInput={(e) =>
								updateProduct({ slug: e.target.value })
							}
							required
						/>
						<ScInput
							label={__('Link', 'surecart')}
							readonly
							value={`${scData?.home_url}/buy/${product?.slug}`}
						>
							<ScButton
								type="text"
								slot="suffix"
								onClick={() =>
									copy(
										`${scData?.home_url}/buy/${product?.slug}`
									)
								}
							>
								<ScIcon name="copy" />
							</ScButton>
						</ScInput>
						<ScButton
							href={`${scData?.home_url}/buy/${product?.slug}`}
						>
							{product?.metadata?.wp_buy_link_enabled === 'true'
								? __('View Page', 'surecart')
								: __('Preview Page', 'surecart')}
							<ScIcon name="external-link" slot="suffix" />
						</ScButton>
					</div>
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
						<BlockPreview
							blocks={createBlocksFromInnerBlocksTemplate([
								['surecart/button', { placeholder: 'Summary' }],
							])}
							viewportWidth={800}
						/>
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
