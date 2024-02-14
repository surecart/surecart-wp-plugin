/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import PurchasesDataTable from '../../components/data-tables/purchases-data-table';
import SimplePagination from '../../ui/SimplePagination';
import usePagination from '../../hooks/usePagination';
import { paginate } from '../../util/arrays';

export default ({ customerId }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(5);

	const { purchases, hasNext, loading } = useSelect(
		(select) => {
			if (!customerId) {
				return {
					purchases: [],
					loading: true,
				};
			}
			const entityData = [
				'surecart',
				'purchase',
				{
					customer_ids: customerId ? [customerId] : null,
					per_page: 100,
					expand: [
						'product',
						'product.featured_product_media',
						'product_media.media',
						'variant',
						'price',
					],
				},
			];

			const purchases =
				select(coreStore)?.getEntityRecords?.(...entityData) || [];
			const { data, totalPages } = paginate(purchases, perPage, page);
			const hasNext = totalPages > page;
			return {
				purchases: data,
				hasNext,
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[customerId, page, perPage]
	);

	const { hasPagination } = usePagination({
		data: purchases,
		page,
		perPage,
	});

	return (
		<PurchasesDataTable
			columns={{
				item: {
					label: __('Item', 'surecart'),
				},
				actions: {
					width: '100px',
				},
			}}
			data={purchases}
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
