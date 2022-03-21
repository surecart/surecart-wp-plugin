import { __ } from '@wordpress/i18n';
import RevokeToggleButton from './RevokeToggleButton';
import { select } from '@wordpress/data';
import { store } from '../../../store/data';

export default (purchase) => {
	const { id, quantity, revoked } = purchase;
	const product = select(store).selectRelation(
		'purchase',
		purchase?.id,
		'product'
	);

	return {
		item: (
			<sc-line-item key={id}>
				{!!product?.image_url && (
					<img src={product?.image_url} slot="image" />
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
