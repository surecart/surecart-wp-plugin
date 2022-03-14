import { __, _n } from '@wordpress/i18n';
import ChargesDataTable from '../../components/data-tables/charges-data-table';

export default ({ charge, loading }) => {
	return (
		<ChargesDataTable
			title={__('Charge', 'checkout_engine')}
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
			data={[charge]}
			isLoading={loading}
		/>
	);
};
