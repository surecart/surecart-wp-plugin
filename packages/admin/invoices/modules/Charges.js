import { __, _n } from '@wordpress/i18n';
import ChargesDataTable from '../../components/data-tables/charges-data-table';

export default ({ charge, loading }) => {
	return (
		<ChargesDataTable
			title={__('Charge', 'surecart')}
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
			data={[charge]}
			isLoading={loading}
		/>
	);
};
