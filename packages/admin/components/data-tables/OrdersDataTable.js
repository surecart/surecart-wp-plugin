import { __, _n } from '@wordpress/i18n';
import DataTable from '../DataTable';
import { addQueryArgs } from '@wordpress/url';

export default ({ data, isLoading, error, pagination, columns, empty }) => {
	const footer = (
		<div>
			{sprintf(__('%s Total', 'checkout_engine'), pagination?.total || 0)}
		</div>
	);

	return (
		<DataTable
			title={__('Orders', 'checkout_engine')}
			columns={columns}
			empty={empty || __('None found.', 'checkout-engine')}
			items={(data || []).map(
				({
					number,
					id,
					line_items,
					total_amount,
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
										'checkout_engine'
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
						actions: (
							<ce-button
								href={addQueryArgs('admin.php', {
									page: 'ce-orders',
									action: 'edit',
									id: id,
								})}
								size="small"
							>
								{__('View', 'checkout_engine')}
							</ce-button>
						),
					};
				}
			)}
			loading={isLoading}
			footer={footer}
		/>
	);
};
