/**
 * External dependencies.
 */
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import LicensesDataTable from '../../components/data-tables/licenses-data-table';
import usePagination from '../../hooks/usePagination';
import { paginate } from '../../util/arrays';
import SimplePagination from '../../ui/SimplePagination';

export default ({ customerId }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(3);

	const { licenses, hasNext, loading } = useSelect(
		(select) => {
			if (!customerId) {
				return {
					licenses: [],
					loading: false,
				};
			}
			const entityData = [
				'surecart',
				'license',
				{
					customer_ids: customerId ? [customerId] : null,
					per_page: 100,
					expand: [
						'purchase',
						'purchase.price',
						'purchase.product',
						'purchase.variant',
						'product.featured_product_media',
						'product_media.media',
					],
				},
			];
			const licenses =
				select(coreStore)?.getEntityRecords?.(...entityData) || [];
			const { data, totalPages } = paginate(licenses, perPage, page);
			const hasNext = totalPages > page;
			return {
				licenses: data,
				hasNext,
				loading:
					!select(coreStore)?.hasFinishedResolution?.(
						'getEntityRecords',
						[...entityData]
					) && !licenses?.length,
			};
		},
		[customerId, page, perPage]
	);

	// We won't render anything if there are no licenses.
	if (!licenses?.length && page === 1 && !loading) {
		return null;
	}

	const { hasPagination } = usePagination({
		data: licenses,
		page,
		perPage,
	});

	return (
		<LicensesDataTable
			columns={{
				item: {
					label: __('Item', 'surecart'),
				},
				actions: {
					width: '100px',
				},
			}}
			data={licenses}
			isLoading={loading}
			after={
				hasPagination && (
					<SimplePagination
						page={page}
						setPage={setPage}
						hasNext={hasNext}
					/>
				)
			}
		/>
	);
};
