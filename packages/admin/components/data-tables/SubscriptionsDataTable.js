import { __, _n } from '@wordpress/i18n';
import DataTable from '../DataTable';

export default ({ data, isLoading, error, pagination }) => {
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
