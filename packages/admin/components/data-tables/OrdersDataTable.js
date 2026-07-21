import DataTable from '../DataTable';
import {
	ScButton,
	ScFormatNumber,
	ScOrderStatusBadge,
	ScText,
} from '@surecart/components-react';
import { __, _n, sprintf } from '@wordpress/i18n';
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
				.map(({ checkout, number, id, created_at_date, status }) => {
					const { amount_due, currency } = checkout;
					const itemsCount = checkout?.delivered_items_count || 0;
					return {
						number: (
							<ScText
								truncate
								style={{
									'--font-weight':
										'var(--sc-font-weight-semibold)',
								}}
							>
								#{number || id}
							</ScText>
						),
						items: (
							<ScText
								truncate
								style={{
									'--color': 'var(--sc-color-gray-500)',
								}}
							>
								{sprintf(
									_n(
										'%s item',
										'%s items',
										itemsCount,
										'surecart'
									),
									itemsCount
								)}
							</ScText>
						),
						total: (
							<ScFormatNumber
								type="currency"
								currency={currency}
								value={amount_due}
							></ScFormatNumber>
						),
						status: <ScOrderStatusBadge status={status} />,
						date: created_at_date,
						actions: (
							<ScButton
								href={addQueryArgs('admin.php', {
									page: 'sc-orders',
									action: 'edit',
									id: id,
								})}
								size="small"
							>
								{__('View', 'surecart')}
							</ScButton>
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
