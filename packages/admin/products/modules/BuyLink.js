/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScSwitch,
	ScMenu,
	ScMenuDivider,
	ScDropdown,
	ScIcon,
	ScDivider,
	ScInput,
} from '@surecart/components-react';
import { useSetting } from '@wordpress/block-editor';
import {
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { ScFormControl } from '@surecart/components-react';

export default ({ product, updateProduct, loading }) => {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const updateMeta = (data) =>
		updateProduct({ metadata: { ...(product?.metadata || {}), ...data } });

	const units = useCustomUnits({
		availableUnits: useSetting('spacing.units') || [
			'%',
			'px',
			'em',
			'rem',
			'vw',
		],
	});

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

	const backgroundColor = () => {
		if (product?.metadata?.wp_buy_link_enabled !== 'true') {
			return 'var(--sc-color-gray-300)';
		}
		if (product?.metadata?.wp_buy_link_test_mode_enabled === 'true') {
			return 'var(--sc-color-warning-500)';
		}
		return 'var(--sc-color-success-500)';
	};

	return (
		<>
			<ScDropdown
				placement="bottom-end"
				style={{ '--panel-width': '380px' }}
			>
				<ScButton slot="trigger" busy={loading} caret>
					<div
						slot="prefix"
						css={css`
							width: 6px;
							height: 6px;
							background-color: ${backgroundColor()};
							border-radius: 999px;
						`}
					></div>
					{__('Instant Checkout', 'surecart')}
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
								product?.metadata?.wp_buy_link_logo_disabled !==
								'true'
							}
							onScChange={(e) =>
								updateMeta({
									wp_buy_link_logo_disabled: e.target.checked
										? 'false'
										: 'true',
								})
							}
						>
							{__('Show store logo', 'surecart')}
						</ScSwitch>

						{product?.metadata?.wp_buy_link_logo_disabled !==
							'true' && (
							<>
								<ScFormControl
									label={__('Width')}
									css={css`
										.components-input-control {
											border-radius: var(
												--sc-input-border-radius-medium
											);
										}
									`}
								>
									<UnitControl
										value={
											!product?.metadata
												?.wp_buy_link_logo_width
												? 180
												: product?.metadata
														?.wp_buy_link_logo_width
										}
										onChange={(wp_buy_link_logo_width) =>
											updateMeta({
												wp_buy_link_logo_width,
											})
										}
										units={units}
									/>
								</ScFormControl>
								<ScDivider />
							</>
						)}

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
						<ScSwitch
							checked={
								product?.metadata
									?.wp_buy_link_terms_disabled !== 'true'
							}
							onScChange={(e) =>
								updateMeta({
									wp_buy_link_terms_disabled: e.target.checked
										? 'false'
										: 'true',
								})
							}
						>
							{__('Require terms and conditions', 'surecart')}
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
							value={`${scData?.home_url}/${scData?.buy_page_slug}/${product?.slug}`}
						>
							<ScButton
								type="text"
								slot="suffix"
								onClick={() =>
									copy(
										`${scData?.home_url}/${scData?.buy_page_slug}/${product?.slug}`
									)
								}
							>
								<ScIcon name="copy" />
							</ScButton>
						</ScInput>
						<ScButton
							href={`${scData?.home_url}/${scData?.buy_page_slug}/${product?.slug}`}
						>
							{product?.metadata?.wp_buy_link_enabled === 'true'
								? __('View', 'surecart')
								: __('Preview', 'surecart')}
							<ScIcon name="external-link" slot="suffix" />
						</ScButton>
					</div>
				</ScMenu>
			</ScDropdown>
		</>
	);
};
