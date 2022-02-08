import { __, sprintf } from '@wordpress/i18n';
import DataTable from '../../DataTable';
import subscriptionItem from './subscription-item';

export default ({ data, isLoading, error, pagination, empty, columns }) => {
	const footer = (
		<div>
			{sprintf(__('%s Total', 'checkout_engine'), pagination?.total || 0)}
		</div>
	);

	return (
		<DataTable
			title={__('Subscriptions', 'checkout_engine')}
			columns={columns}
			empty={empty || __('None found.', 'checkout-engine')}
			items={(data || [])
				.slice()
				.sort((a, b) => b.created_at - a.created_at)
				.map((subscription) => subscriptionItem(subscription))}
			loading={isLoading}
			error={error}
			footer={footer}
		/>
	);
};
