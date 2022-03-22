import { __, _n } from '@wordpress/i18n';
import SubscriptionsDataTable from '../../components/data-tables/subscriptions-data-table';

export default ({ subscription, loading }) => {
	return (
		<SubscriptionsDataTable
			columns={{
				status: {
					label: __('Status', 'surecart'),
					width: '100px',
				},
				product: {
					label: __('Product', 'surecart'),
				},
				plan: {
					label: __('Plan', 'surecart'),
				},
				created: {
					label: __('Created', 'surecart'),
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
