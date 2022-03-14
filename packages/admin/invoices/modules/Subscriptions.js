import { __, _n } from '@wordpress/i18n';
import SubscriptionsDataTable from '../../components/data-tables/subscriptions-data-table';

export default ({ subscription, loading }) => {
	return (
		<SubscriptionsDataTable
			columns={{
				status: {
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				product: {
					label: __('Product', 'checkout_engine'),
				},
				plan: {
					label: __('Plan', 'checkout_engine'),
				},
				created: {
					label: __('Created', 'checkout_engine'),
				},
				view: {
					width: '100px',
				},
			}}
			data={[subscription]}
			isLoading={loading}
		/>
	);
};
