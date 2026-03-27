/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScDivider } from '@surecart/components-react';
import { useSettings } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	Dropdown,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalInputControl as InputControl,
	__experimentalText as Text,
	ToggleControl,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	chevronDownSmall,
	copySmall as copyIcon,
	external,
} from '@wordpress/icons';
import { store as noticesStore } from '@wordpress/notices';

export default ({ product, updateProduct, loading }) => {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const updateMeta = (data) =>
		updateProduct({ metadata: { ...(product?.metadata || {}), ...data } });

	// logo width.
	const [logoWidth, setLogoWidth] = useEntityProp(
		'root',
		'site',
		'surecart_buy_link_logo_width'
	);

	const units = useCustomUnits({
		availableUnits: useSettings('spacing.units') || [
			'%',
			'px',
			'em',
			'rem',
			'vw',
		],
	});

	const menuCss = css`
		width: 100vw;
		max-width: 350px;
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
			<Dropdown
				popoverProps={{ placement: 'bottom-start' }}
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						variant="tertiary"
						isBusy={loading}
						iconPosition="right"
						icon={chevronDownSmall}
						onClick={onToggle}
						aria-expanded={isOpen}
						showTooltip={true}
						label={__('Instant Checkout Options', 'surecart')}
					>
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 8px;
							`}
						>
							<div
								css={css`
									width: 6px;
									height: 6px;
									background-color: ${backgroundColor()};
									border-radius: 999px;
								`}
							></div>
							{__('Instant Checkout', 'surecart')}
						</div>
					</Button>
				)}
				renderContent={() => (
					<div css={menuCss}>
						<ToggleControl
							label={__('Published', 'surecart')}
							help={__(
								'Instantly publish a shareable page for this product.',
								'surecart'
							)}
							__nextHasNoMarginBottom={true}
							checked={
								product?.metadata?.wp_buy_link_enabled ===
								'true'
							}
							onChange={(checked) =>
								updateMeta({
									wp_buy_link_enabled: checked
										? 'true'
										: 'false',
								})
							}
						/>
						<ToggleControl
							label={__('Test Mode', 'surecart')}
							help={__(
								'Change the instant checkout to test mode.',
								'surecart'
							)}
							__nextHasNoMarginBottom={true}
							checked={
								product?.metadata
									?.wp_buy_link_test_mode_enabled === 'true'
							}
							onChange={(checked) =>
								updateMeta({
									wp_buy_link_test_mode_enabled: checked
										? 'true'
										: 'false',
								})
							}
						/>
						<ScDivider />
						<ToggleControl
							label={__('Show store logo', 'surecart')}
							__nextHasNoMarginBottom={true}
							checked={
								product?.metadata?.wp_buy_link_logo_disabled !==
								'true'
							}
							onChange={(checked) =>
								updateMeta({
									wp_buy_link_logo_disabled: checked
										? 'false'
										: 'true',
								})
							}
						/>
						{product?.metadata?.wp_buy_link_logo_disabled !==
							'true' && (
							<>
								<UnitControl
									label={__('Width', 'surecart')}
									value={logoWidth}
									onChange={(width) => setLogoWidth(width)}
									units={units}
									__next40pxDefaultSize
								/>

								<ScDivider />
							</>
						)}
						<ToggleControl
							label={__('Show product image', 'surecart')}
							__nextHasNoMarginBottom={true}
							checked={
								product?.metadata
									?.wp_buy_link_product_image_disabled !==
								'true'
							}
							onChange={(checked) =>
								updateMeta({
									wp_buy_link_product_image_disabled: checked
										? 'false'
										: 'true',
								})
							}
						></ToggleControl>
						<ToggleControl
							label={__('Show product description', 'surecart')}
							__nextHasNoMarginBottom={true}
							checked={
								product?.metadata
									?.wp_buy_link_product_description_disabled !==
								'true'
							}
							onChange={(checked) =>
								updateMeta({
									wp_buy_link_product_description_disabled:
										checked ? 'false' : 'true',
								})
							}
						/>
						<ToggleControl
							label={__('Show coupon field', 'surecart')}
							__nextHasNoMarginBottom={true}
							checked={
								product?.metadata
									?.wp_buy_link_coupon_field_disabled !==
								'true'
							}
							onChange={(checked) =>
								updateMeta({
									wp_buy_link_coupon_field_disabled: checked
										? 'false'
										: 'true',
								})
							}
						/>
						<ToggleControl
							label={__('Show terms and conditions', 'surecart')}
							__nextHasNoMarginBottom={true}
							checked={
								product?.metadata
									?.wp_buy_link_terms_disabled !== 'true'
							}
							onChange={(checked) =>
								updateMeta({
									wp_buy_link_terms_disabled: checked
										? 'false'
										: 'true',
								})
							}
						/>

						<ToggleControl
							label={__('Custom thank you page', 'surecart')}
							__nextHasNoMarginBottom={true}
							checked={
								product?.metadata
									?.wp_buy_link_success_page_enabled ===
								'true'
							}
							onChange={(checked) =>
								updateMeta({
									wp_buy_link_success_page_enabled: checked
										? 'true'
										: 'false',
								})
							}
						/>
						{product?.metadata?.wp_buy_link_success_page_enabled ===
							'true' && (
							<InputControl
								label={__('URL', 'surecart')}
								placeholder="https://"
								value={
									product?.metadata
										?.wp_buy_link_success_page_url
								}
								onChange={(value) => {
									updateMeta({
										wp_buy_link_success_page_url: value,
									});
								}}
								__next40pxDefaultSize
								type="url"
							/>
						)}
						<ScDivider />
						<BaseControl
							__nextHasNoMarginBottom={true}
							label={__('Link', 'surecart')}
							css={css`
								overflow: hidden;
								padding: 5px;
							`}
						>
							<Flex justify="flex-start">
								<Text
									css={css`
										flex: 1 1 1px;
									`}
									truncate
									variant="muted"
								>
									{`${scData?.home_url}/${scData?.buy_page_slug}/${product?.slug}`}
								</Text>
								<FlexItem>
									<Button
										__next40pxDefaultSize
										icon={copyIcon}
										label={__('Copy Link', 'surecart')}
										onClick={() =>
											copy(
												`${scData?.home_url}/${scData?.buy_page_slug}/${product?.slug}`
											)
										}
									/>
								</FlexItem>
							</Flex>
						</BaseControl>
						<Button
							href={`${scData?.home_url}/${scData?.buy_page_slug}/${product?.slug}`}
							variant="primary"
							__next40pxDefaultSize
							iconPosition="right"
							css={css`
								justify-content: center !important;
								width: 100%;
							`}
							icon={external}
						>
							{product?.metadata?.wp_buy_link_enabled === 'true'
								? __('View', 'surecart')
								: __('Preview', 'surecart')}
						</Button>
					</div>
				)}
			/>
		</>
	);
};
