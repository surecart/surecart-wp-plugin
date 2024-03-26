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
import PromotionsDataTable from '../../components/data-tables/affiliates/PromotionsDataTable';
import usePagination from '../../hooks/usePagination';

export default ({ affiliationId }) => {
	const [page, setPage] = useState(1);
	const perPage = 5;

	const { promotions, loading, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'promotion',
				{
					context: 'edit',
					affiliation_ids: [affiliationId],
					page,
					per_page: perPage,
					expand: ['coupon'],
				},
			];
			const promotions = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				promotions,
				loading: loading && page === 1,
				fetching: loading && page !== 1,
			};
		},
		[affiliationId, page]
	);

	const { hasPagination } = usePagination({
		data: promotions,
		page,
		perPage,
	});

	return (
		<PromotionsDataTable
			title={__('Promotion Codes', 'surecart')}
			columns={{
				code: {
					label: __('Code', 'surecart'),
				},
				status: {
					label: __('Status', 'surecart'),
				},
				uses: {
					label: __('Uses', 'surecart'),
				},
				view: {
					label: __('', 'surecart'),
				},
			}}
			data={promotions}
			isLoading={loading}
			isFetching={fetching}
			perPage={perPage}
			page={page}
			setPage={setPage}
			empty={
				page > 1
					? __('No more promotions.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				hasPagination && (
					<PrevNextButtons
						data={promotions}
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
