/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import RevokeToggleButton from './RevokeToggleButton';
import { getFeaturedProductMediaAttributes } from '@surecart/components';
import { ScFlex } from '@surecart/components-react';

export default (purchase) => {
	const { id, quantity, revoked, variant, price } = purchase;
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
					<ScFlex
						css={css`
							width: max-content;
						`}
					>
						<span
							css={css`
								white-space: nowrap;
							`}
						>
							Qty: {quantity}
						</span>{' '}
						{revoked && (
							<sc-tag size="small" type="danger">
								{__('Revoked', 'surecart')}
							</sc-tag>
						)}
					</ScFlex>
					{variantLabel && (
						<span
							css={css`
								display: block;
							`}
						>
							{variantLabel}
						</span>
					)}
					{price?.name && <span>{price?.name}</span>}
				</span>
			</sc-line-item>
		),
		actions: <RevokeToggleButton purchase={purchase} />,
	};
};
