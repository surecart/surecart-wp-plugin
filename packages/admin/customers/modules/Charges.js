import { __, _n } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import PrevNextButtons from '../../ui/PrevNextButtons';
import usePagination from '../../hooks/usePagination';
import ChargesDataTable from '../../components/data-tables/charges-data-table';

export default ({ customerId }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);

	const { charges, updating, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'charge',
				{
					context: 'edit',
					customer_ids: [customerId],
					status: ['paid', 'failed'],
					expand: [
						'payment_method',
						'payment_method.card',
						'payment_intent',
						'checkout',
						'checkout.order',
					],
					page,
					per_page: perPage,
				},
			];
			const charges = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				charges,
				loading: loading && page === 1,
				updating: loading && page !== 1,
			};
		},
		[customerId, page, perPage]
	);

	const { hasPagination } = usePagination({
		data: charges,
		page,
		perPage,
	});

	return (
		<>
			<ChargesDataTable
				title={__('Charges', 'surecart')}
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
					order: {
						width: '100px',
					},
				}}
				data={charges}
				showTotal
				isLoading={loading}
				isFetching={updating}
				perPage={perPage}
				page={page}
				setPage={setPage}
				empty={
					page > 1
						? __('No more charges.', 'surecart')
						: __('None found.', 'surecart')
				}
				footer={
					hasPagination && (
						<PrevNextButtons
							data={charges}
							page={page}
							setPage={setPage}
							perPage={perPage}
							loading={updating}
						/>
					)
				}
			/>
		</>
	);
};
