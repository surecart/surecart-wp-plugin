import { __, _n } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import DataTable from '../../components/DataTable';
import { useEffect, useState } from '@wordpress/element';
import useDataApi from '../../hooks/useDataApi';
import { addQueryArgs } from '@wordpress/url';

export default () => {
	const { customerId } = useCustomerData();
	const [{ data: orders, isLoading, error, pagination }, fetchData] =
		useDataApi();

	useEffect(() => {
		if (customerId) {
			fetchData({
				path: 'checkout-engine/v1/orders',
				query: {
					customer_ids: [customerId],
					context: 'edit',
					status: ['paid'],
					expand: ['payment_method', 'line_items'],
				},
			});
		}
	}, [customerId]);

	const footer = (
		<div>
			{sprintf(__('%s Total', 'checkout_engine'), pagination?.total || 0)}
		</div>
	);

	return (
		<DataTable
			title={__('Orders', 'checkout_engine')}
			columns={{
				number: {
					label: __('Order Number', 'checkout_engine'),
				},
				items: {
					label: __('Items', 'checkout_engine'),
				},
				total: {
					label: __('Total', 'checkout_engine'),
				},
				status: {
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				actions: {
					width: '100px',
				},
			}}
			items={(orders || []).map(
				({ number, id, line_items, total_amount, status }) => {
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
								currency={'USD'}
								value={total_amount}
							></ce-format-number>
						),
						status: (
							<ce-session-status-badge
								status={status}
							></ce-session-status-badge>
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
