import { __, _n } from '@wordpress/i18n';
import DataTable from '../../DataTable';
import purchaseItem from './purchase-item';

export default ({
	data,
	isLoading,
	error,
	pagination,
	isFetching,
	columns,
	empty,
	page,
	setPage,
	...props
}) => {
	return (
		<DataTable
			title={__('Purchases', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map((purchase) => purchaseItem(purchase))}
			loading={isLoading}
			{...props}
		/>
	);
};
