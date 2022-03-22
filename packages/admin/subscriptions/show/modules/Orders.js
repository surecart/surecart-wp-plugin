import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { addQueryArgs } from '@wordpress/url';
import { ScOrderStatusBadge } from '@surecart/components-react';

export default ({ order, loading }) => {
	if (!loading && !order) {
		return null;
	}

	return (
		<div>
			<DataTable
				loading={loading}
				title={__('Order', 'surecart')}
				columns={{
					amount: {
						label: __('Amount', 'surecart'),
					},
					status: {
						label: __('Status', 'surecart'),
					},
					created: {
						label: __('Created', 'surecart'),
					},
					number: {
						label: __('Number', 'surecart'),
					},
					actions: {
						width: '100px',
					},
				}}
				items={[
					{
						amount: (
							<sc-format-number
								type="currency"
								currency={order?.currency}
								value={order?.amount_due}
							></sc-format-number>
						),
						status: (
							<ScOrderStatusBadge
								status={order?.status}
							></ScOrderStatusBadge>
						),
						created: (
							<sc-format-date
								type="timestamp"
								date={order?.created_at}
								month="short"
								day="numeric"
								year="numeric"
							></sc-format-date>
						),
						number: order.number,
						actions: (
							<sc-button
								size="small"
								href={addQueryArgs('admin.php', {
									page: 'sc-orders',
									action: 'edit',
									id: order?.id,
								})}
							>
								View
							</sc-button>
						),
					},
				]}
			/>
		</div>
	);
};
