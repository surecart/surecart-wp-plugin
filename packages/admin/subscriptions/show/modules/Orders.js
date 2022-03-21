import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { addQueryArgs } from '@wordpress/url';
import { CeOrderStatusBadge } from '@checkout-engine/components-react';

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
							<ce-format-number
								type="currency"
								currency={order?.currency}
								value={order?.amount_due}
							></ce-format-number>
						),
						status: (
							<CeOrderStatusBadge
								status={order?.status}
							></CeOrderStatusBadge>
						),
						created: (
							<ce-format-date
								type="timestamp"
								date={order?.created_at}
								month="short"
								day="numeric"
								year="numeric"
							></ce-format-date>
						),
						number: order.number,
						actions: (
							<ce-button
								size="small"
								href={addQueryArgs('admin.php', {
									page: 'ce-orders',
									action: 'edit',
									id: order?.id,
								})}
							>
								View
							</ce-button>
						),
					},
				]}
			/>
		</div>
	);
};
