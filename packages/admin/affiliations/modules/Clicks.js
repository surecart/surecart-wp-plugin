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
import ClicksDataTable from '../../components/data-tables/affiliates/ClicksDataTable';
import PrevNextButtons from '../../ui/PrevNextButtons';
import usePagination from '../../hooks/usePagination';

export default ({ affiliationId }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(5);

	const { clicks, loading, updating } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'click',
				{
					context: 'edit',
					affiliation_ids: [affiliationId],
					page,
					per_page: perPage,
				},
			];
			const clicks = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				clicks,
				loading: loading && page === 1,
				updating: loading && page !== 1,
			};
		},
		[affiliationId, page, perPage]
	);

	const { hasPagination } = usePagination({
		data: clicks,
		page,
		perPage,
	});

	return (
		<ClicksDataTable
			title={__('Clicks', 'surecart')}
			columns={{
				url: {
					label: __('Landing Url', 'surecart'),
				},
				referrer: {
					label: __('Referrer', 'surecart'),
				},
				date: {
					label: __('Date', 'surecart'),
					width: '100px',
				},
			}}
			data={clicks}
			isLoading={loading}
			isFetching={updating}
			perPage={perPage}
			page={page}
			setPage={setPage}
			empty={
				page > 1
					? __('No more clicks.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				hasPagination && (
					<PrevNextButtons
						data={clicks}
						page={page}
						setPage={setPage}
						perPage={perPage}
						loading={updating}
					/>
				)
			}
		/>
	);
};
