import { __, _n } from '@wordpress/i18n';
import DataTable from '../DataTable';
import { addQueryArgs } from '@wordpress/url';

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
	footer,
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
				.map(({ checkout, number, id, created_at }) => {
					const { line_items, total_amount, currency, status } =
						checkout;
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
								date={created_at}
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
				})}
			loading={isLoading}
			updating={isFetching}
			footer={!!footer && footer}
			{...props}
		/>
	);
};
