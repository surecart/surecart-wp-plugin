import { __, _n } from '@wordpress/i18n';
import DataTable from '../DataTable';
import { addQueryArgs } from '@wordpress/url';
import PaginationFooter from './PaginationFooter';

export default ({
	data,
	isLoading,
	title,
	error,
	isFetching,
	page,
	setPage,
	pagination,
	columns,
	empty,
	...props
}) => {
	return (
		<DataTable
			title={title || __('Orders', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map(
					({
						number,
						id,
						line_items,
						total_amount,
						updated_at,
						status,
						currency,
					}) => {
						return {
							number: (
								<sc-text
									truncate
									style={{
										'--font-weight':
											'var(--sc-font-weight-semibold)',
									}}
								>
									{number || id}
								</sc-text>
							),
							items: (
								<sc-text
									truncate
									style={{
										'--color': 'var(--sc-color-gray-500)',
									}}
								>
									{sprintf(
										_n(
											'%s item',
											'%s items',
											line_items?.pagination?.count || 0,
											'surecart'
										),
										line_items?.pagination?.count || 0
									)}
								</sc-text>
							),
							total: (
								<sc-format-number
									type="currency"
									currency={currency}
									value={total_amount}
								></sc-format-number>
							),
							status: (
								<sc-order-status-badge
									status={status}
								></sc-order-status-badge>
							),
							date: (
								<sc-format-date
									type="timestamp"
									month="short"
									day="numeric"
									year="numeric"
									date={updated_at}
								></sc-format-date>
							),
							actions: (
								<sc-button
									href={addQueryArgs('admin.php', {
										page: 'sc-orders',
										action: 'edit',
										id: id,
									})}
									size="small"
								>
									{__('View', 'surecart')}
								</sc-button>
							),
						};
					}
				)}
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
