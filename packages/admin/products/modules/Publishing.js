/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScInput,
	ScFormControl,
	ScSwitch,
	ScButton,
	ScIcon,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

import Box from '../../ui/Box';

export default ({ product, updateProduct, loading }) => {
	const updateMeta = (data) =>
		updateProduct({ metadata: { ...(product?.metadata || {}), ...data } });

	return (
		<Box
			loading={loading}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					`}
				>
					{__('Publishing', 'surecart')}
				</div>
			}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-large);
				`}
			>
				<ScSwitch
					checked={product?.metadata?.wp_buy_link_enabled}
					onScChange={(e) =>
						updateMeta({ wp_buy_link_enabled: e.target.checked })
					}
				>
					{__('Instant Buy Link', 'surecart')}
					<span slot="description">
						{__(
							'Instantly get a link to a sharable page to buy this product.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				{!!product?.metadata?.wp_buy_link_enabled && (
					<>
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
						<ScFormControl label={__('Permalink', 'surecart')}>
							<a
								href={`${scData?.home_url}/buy/${product?.slug}`}
							>
								{`${scData?.home_url}/buy/${product?.slug}`}
							</a>
						</ScFormControl>
						<ScInput
							label={__('URL Slug')}
							help={__('The last part of the URL', 'surecart')}
							value={product?.slug}
							onScInput={(e) =>
								updateProduct({ slug: e.target.value })
							}
							required
						/>
						<div>
							<ScButton
								href={`${scData?.home_url}/buy/${product?.slug}`}
							>
								{__('View Page', 'surecart')}
								<ScIcon name="external-link" slot="suffix" />
							</ScButton>
						</div>
					</>
				)}
			</div>
		</Box>
	);
};
