/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import EditLicenseButton from './EditLicenseButton';

/**
 * Internal dependencies.
 */
import { getFeaturedProductMediaAttributes } from '@surecart/components';
import { ScFormatNumber, ScTag } from '@surecart/components-react';
import { intervalString } from '../../../util/translations';

export default (license) => {
	const { purchase } = license;
	const { id, variant, price } = purchase;
	const product = purchase.product;
	const media = getFeaturedProductMediaAttributes(product);
	const variantLabel = [
		variant?.option_1,
		variant?.option_2,
		variant?.option_3,
	]
		.filter(Boolean)
		.join(' / ');

	return {
		item: (
			<sc-line-item key={id}>
				{(!!media?.url || variant?.image_url) && (
					<img
						src={variant?.image_url || media.url}
						alt={media.alt}
						{...(media.title ? { title: media.title } : {})}
						slot="image"
					/>
				)}
				<span slot="title">{product?.name}</span>
				<span className="product__description" slot="description">
					{variantLabel && (
						<span
							css={css`
								display: block;
							`}
						>
							{variantLabel}
						</span>
					)}
					{price?.amount && (
						<>
							<ScFormatNumber
								type="currency"
								currency={price?.currency || 'usd'}
								value={
									!!price?.ad_hoc && ad_hoc_amount
										? ad_hoc_amount
										: price?.amount
								}
							/>
							{intervalString(price)}
						</>
					)}
					<ScTag type="info" style={{ minWidth: 'max-content' }}>
						{sprintf(
							__('%1s of %2s Activations Used'),
							parseInt(license?.activations_count || 0),
							parseInt(license?.activation_limit) || '∞'
						)}
					</ScTag>
				</span>
			</sc-line-item>
		),
		actions: <EditLicenseButton license={license} />,
	};
};
