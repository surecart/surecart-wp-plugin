import DataTable from '../DataTable';
import {
	ScButton,
	ScFormatDate,
	ScFormatNumber,
	ScOrderStatusBadge,
	ScText,
} from '@surecart/components-react';
import { __, _n } from '@wordpress/i18n';
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
					const { line_items, amount_due, currency, status } =
						checkout;
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
										line_items?.pagination?.count || 0,
										'surecart'
									),
									line_items?.pagination?.count || 0
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
						status: (
							<ScOrderStatusBadge
								status={status}
							></ScOrderStatusBadge>
						),
						date: (
							<ScFormatDate
								type="timestamp"
								month="short"
								day="numeric"
								year="numeric"
								date={created_at}
							></ScFormatDate>
						),
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
