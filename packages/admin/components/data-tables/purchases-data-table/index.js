import { __, _n } from '@wordpress/i18n';
import { translateInterval } from '../../../util/translations';
import DataTable from '../../DataTable';
import purchaseItem from './purchase-item';
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
			items={(data || [])
				.slice()
				.sort((a, b) => b.created_at - a.created_at)
				.map((purchase) => purchaseItem(purchase))}
			loading={isLoading}
			footer={footer}
		/>
	);
};
