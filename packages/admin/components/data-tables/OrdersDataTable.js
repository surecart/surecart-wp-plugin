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
			empty={empty || __('None found.', 'checkout-engine')}
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
								<ce-text
									truncate
									style={{
										'--font-weight':
											'var(--ce-font-weight-semibold)',
									}}
								>
									{number || id}
								</ce-text>
							),
							items: (
								<ce-text
									truncate
									style={{
										'--color': 'var(--ce-color-gray-500)',
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
								</ce-text>
							),
							total: (
								<ce-format-number
									type="currency"
									currency={currency}
									value={total_amount}
								></ce-format-number>
							),
							status: (
								<ce-order-status-badge
									status={status}
								></ce-order-status-badge>
							),
							date: (
								<ce-format-date
									type="timestamp"
									month="short"
									day="numeric"
									year="numeric"
									date={updated_at}
								></ce-format-date>
							),
							actions: (
								<ce-button
									href={addQueryArgs('admin.php', {
										page: 'ce-orders',
										action: 'edit',
										id: id,
									})}
									size="small"
								>
									{__('View', 'surecart')}
								</ce-button>
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
