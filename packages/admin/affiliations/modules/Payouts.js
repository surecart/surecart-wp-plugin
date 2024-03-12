/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import PrevNextButtons from '../../ui/PrevNextButtons';
import PayoutsDataTable from '../../components/data-tables/affiliates/PayoutsDataTable';
import usePagination from '../../hooks/usePagination';

export default ({ affiliationId }) => {
	const [page, setPage] = useState(1);
	const perPage = 5;

	const { payouts, loading, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'payout',
				{
					context: 'edit',
					affiliation_ids: [affiliationId],
					page,
					per_page: perPage,
				},
			];
			const payouts = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				payouts,
				loading: loading && page === 1,
				fetching: loading && page !== 1,
			};
		},
		[affiliationId, page]
	);

	const { hasPagination } = usePagination({
		data: payouts,
		page,
		perPage,
	});

	return (
		<PayoutsDataTable
			title={__('Payouts', 'surecart')}
			columns={{
				status: {
					label: __('Status', 'surecart'),
				},
				// TODO: Add the column when API is ready.
				// payout_email: {
				// 	label: __('Payout Email', 'surecart'),
				// },
				total_commission_amount: {
					label: __('Commission', 'surecart'),
				},
				end_date: {
					label: __('Period End', 'surecart'),
					width: '100px',
				},
				date: {
					label: __('Date', 'surecart'),
					width: '100px',
				},
			}}
			data={payouts}
			isLoading={loading}
			isFetching={fetching}
			perPage={perPage}
			page={page}
			setPage={setPage}
			empty={
				page > 1
					? __('No more payouts.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				hasPagination && (
					<PrevNextButtons
						data={payouts}
						page={page}
						setPage={setPage}
						perPage={perPage}
						loading={fetching}
					/>
				)
			}
		/>
	);
};
