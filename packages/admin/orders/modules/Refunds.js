import { __, _n } from '@wordpress/i18n';
import ChargesDataTable from '../../components/data-tables/charges-data-table';
import useEntities from '../../mixins/useEntities';
import { useEffect } from '@wordpress/element';
import useCurrentPage from '../../mixins/useCurrentPage';

export default ({ refunds }) => {
	return JSON.stringify(refunds);
	return (
		<ChargesDataTable
			title={__('Payment', 'checkout_engine')}
			columns={{
				amount: {
					label: __('Amount', 'checkout_engine'),
				},
				date: {
					label: __('Date', 'checkout_engine'),
				},
				method: {
					label: __('Method', 'checkout_engine'),
				},
				status: {
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				refund: {
					width: '100px',
				},
			}}
			showTotal
			data={charges}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
