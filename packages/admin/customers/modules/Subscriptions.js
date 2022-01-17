import { __, _n } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import DataTable from '../../components/DataTable';
import { useEffect } from '@wordpress/element';
import useDataApi from '../../hooks/useDataApi';

export default () => {
	const { customerId } = useCustomerData();
	const [{ data, isLoading, error, pagination }, fetchData] = useDataApi();

	useEffect(() => {
		if (customerId) {
			fetchData({
				path: 'checkout-engine/v1/subscriptions',
				query: {
					customer_ids: [customerId],
					context: 'edit',
					expand: ['price'],
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
			title={__('Subscriptions', 'checkout_engine')}
			columns={{
				status: {
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				actions: {
					width: '100px',
				},
			}}
			items={(data || []).map(({ status }) => {
				return {
					status: (
						<ce-subscription-status-badge
							status={status}
						></ce-subscription-status-badge>
					),
					actions: (
						<ce-button size="small">
							{__('View', 'checkout_engine')}
						</ce-button>
					),
				};
			})}
			loading={isLoading}
			empty={__('No subscriptions found', 'checkout_engine')}
			footer={footer}
		/>
	);
};
