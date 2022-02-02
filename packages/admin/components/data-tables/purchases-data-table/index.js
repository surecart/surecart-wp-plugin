import { __, _n } from '@wordpress/i18n';
import DataTable from '../../DataTable';
import RevokeToggleButton from './RevokeToggleButton';

export default ({
	data,
	isLoading,
	error,
	pagination,
	columns,
	empty,
	onUpdatePurchase,
}) => {
	const footer = (
		<div>
			{sprintf(__('%s Total', 'checkout_engine'), pagination?.total || 0)}
		</div>
	);

	return (
		<DataTable
			title={__('Purchases', 'checkout_engine')}
			columns={columns}
			empty={empty || __('None found.', 'checkout-engine')}
			items={(data || []).map((purchase) => {
				const { id, product, quantity, revoked } = purchase;
				return {
					item: (
						<ce-line-item key={id}>
							{!!product?.image_url && (
								<img src={product?.image_url} slot="image" />
							)}
							<span slot="title">
								{product?.name}
								{product?.recurring &&
									translateInterval(
										product?.price?.amount,
										product?.price?.recurring_interval
									)}
							</span>
							<span
								class="product__description"
								slot="description"
							>
								<span>Qty: {quantity}</span>{' '}
								{revoked && (
									<ce-tag size="small" type="danger">
										{__('Revoked', 'checkout_engine')}
									</ce-tag>
								)}
							</span>
						</ce-line-item>
					),
					actions: (
						<RevokeToggleButton
							purchase={purchase}
							onUpdatePurchase={onUpdatePurchase}
						/>
					),
				};
			})}
			loading={isLoading}
			footer={footer}
		/>
	);
};
