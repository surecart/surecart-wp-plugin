/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import PrevNextButtons from '../../ui/PrevNextButtons';
import ReferralsDataTable from '../../components/data-tables/affiliates/ReferralsDataTable';
import usePagination from '../../hooks/usePagination';

export default ({ affiliationId }) => {
	const [page, setPage] = useState(1);
	const perPage = 5;

	const { referrals, loading, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'referral',
				{
					context: 'edit',
					affiliation_ids: [affiliationId],
					expand: ['checkout', 'checkout.order'],
					page,
					per_page: perPage,
				},
			];
			const referrals = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				referrals,
				loading: loading && page === 1,
				fetching: loading && page !== 1,
			};
		},
		[affiliationId, page]
	);

	const { hasPagination } = usePagination({
		data: referrals,
		page,
		perPage,
	});

	return (
		<ReferralsDataTable
			title={__('Referrals', 'surecart')}
			columns={{
				status: {
					label: __('Status', 'surecart'),
				},
				description: {
					label: __('Description', 'surecart'),
				},
				order: {
					label: __('Order', 'surecart'),
				},
				commission_amount: {
					label: __('Commission', 'surecart'),
				},
				date: {
					label: __('Date', 'surecart'),
					width: '100px',
				},
				view: {
					width: '50px',
				},
			}}
			data={referrals}
			isLoading={loading}
			isFetching={fetching}
			perPage={perPage}
			page={page}
			setPage={setPage}
			empty={
				page > 1
					? __('No more referrals.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				hasPagination && (
					<PrevNextButtons
						data={referrals}
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
