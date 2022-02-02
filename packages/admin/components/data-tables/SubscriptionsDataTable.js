import { __, _n } from '@wordpress/i18n';
import DataTable from '../DataTable';
import { addQueryArgs } from '@wordpress/url';
import { CeFormatDate } from '@checkout-engine/components-react';

export default ({ data, isLoading, error, pagination, empty }) => {
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
				product: {
					label: __('Product', 'checkout_engine'),
				},
				created: {
					label: __('Created', 'checkout_engine'),
				},
				actions: {
					width: '100px',
				},
			}}
			empty={empty || __('None found.', 'checkout-engine')}
			items={(data || []).map(({ id, status, price, created_at }) => {
				return {
					status: (
						<ce-subscription-status-badge
							status={status}
						></ce-subscription-status-badge>
					),
					product: (
						<a
							href={addQueryArgs('admin.php', {
								page: 'ce-products',
								action: 'edit',
								id: id,
							})}
						>
							{price?.product?.name} - {price?.name}
						</a>
					),
					created: (
						<CeFormatDate
							date={created_at}
							month="long"
							day="numeric"
							year="numeric"
							type="timestamp"
						></CeFormatDate>
					),
					actions: (
						<ce-button
							href={addQueryArgs('admin.php', {
								page: 'ce-subscriptions',
								action: 'edit',
								id: id,
							})}
							size="small"
						>
							{__('View', 'checkout_engine')}
						</ce-button>
					),
				};
			})}
			loading={isLoading}
			footer={footer}
		/>
	);
};
