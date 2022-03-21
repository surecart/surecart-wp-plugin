import { __, _n } from '@wordpress/i18n';
import ChargesDataTable from '../../components/data-tables/charges-data-table';
import useEntities from '../../mixins/useEntities';
import { useEffect } from '@wordpress/element';
import useCurrentPage from '../../mixins/useCurrentPage';

export default ({ refunds }) => {
	return JSON.stringify(refunds);
	return (
		<ChargesDataTable
			title={__('Payment', 'surecart')}
			columns={{
				amount: {
					label: __('Amount', 'surecart'),
				},
				date: {
					label: __('Date', 'surecart'),
				},
				method: {
					label: __('Method', 'surecart'),
				},
				status: {
					label: __('Status', 'surecart'),
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
