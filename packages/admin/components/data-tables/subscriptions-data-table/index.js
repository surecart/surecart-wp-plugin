import { __, sprintf } from '@wordpress/i18n';
import DataTable from '../../DataTable';
import PaginationFooter from '../PaginationFooter';
import subscriptionItem from './subscription-item';

export default ({
	data,
	isLoading,
	error,
	pagination,
	empty,
	columns,
	isFetching,
	page,
	setPage,
	...props
}) => {
	return (
		<DataTable
			title={__('Subscriptions', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'checkout-engine')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map((subscription) => subscriptionItem(subscription))}
			loading={isLoading}
			error={error}
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
