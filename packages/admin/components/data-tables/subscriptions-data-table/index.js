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
	footer,
	page,
	setPage,
	...props
}) => {
	return (
		<DataTable
			title={__('Subscriptions', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map((subscription) => subscriptionItem(subscription))}
			error={error}
			loading={isLoading}
			updating={isFetching}
			footer={!!footer && footer}
			{...props}
		/>
	);
};
