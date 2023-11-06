import { __ } from '@wordpress/i18n';
import RevokeToggleButton from './RevokeToggleButton';
import { getFeaturedProductMediaAttributes } from '@surecart/components';

export default (purchase) => {
	const { id, quantity, revoked } = purchase;
	const product = purchase.product;
	const media = getFeaturedProductMediaAttributes(product);

	return {
		item: (
			<sc-line-item key={id}>
				{!!media?.url && (
					<img
						src={media?.url}
						title={media.title}
						alt={media.alt}
						slot="image"
					/>
				)}
				<span slot="title">{product?.name}</span>
				<span className="product__description" slot="description">
					<span>Qty: {quantity}</span>{' '}
					{revoked && (
						<sc-tag size="small" type="danger">
							{__('Revoked', 'surecart')}
						</sc-tag>
					)}
				</span>
			</sc-line-item>
		),
		actions: <RevokeToggleButton purchase={purchase} />,
	};
};
