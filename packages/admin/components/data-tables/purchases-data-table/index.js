import { __, _n } from '@wordpress/i18n';
import DataTable from '../../DataTable';
import PaginationFooter from '../PaginationFooter';
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
			footer={
				pagination ? (
					<PaginationFooter
						showing={data?.length}
						total={pagination?.total}
						total_pages={pagination?.total_pages}
						page={page}
						isFetching={isFetching}
						setPage={setPage}
					/>
				) : null
			}
			{...props}
		/>
	);
};
