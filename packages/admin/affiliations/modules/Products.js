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
import usePagination from '../../hooks/usePagination';
import ProductsDataTable from '../../components/data-tables/affiliates/products';

export default ({ affiliationId }) => {
	const [page, setPage] = useState(1);
	const perPage = 5;

	const { affiliationProducts, loading, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'affiliation-product',
				{
					context: 'edit',
					affiliation_ids: [affiliationId],
					page,
					per_page: perPage,
					expand: [
						'commission_structure',
						'product',
						'product.prices',
					],
				},
			];
			const affiliationProducts =
				select(coreStore).getEntityRecords(...queryArgs) || [];
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			return {
				affiliationProducts,
				loading: loading && page === 1,
				fetching: loading && page !== 1,
			};
		},
		[affiliationId, page]
	);

	console.log('affiliationProducts', affiliationProducts);

	const { hasPagination } = usePagination({
		data: affiliationProducts,
		page,
		perPage,
	});

	return (
		<ProductsDataTable
			title={__('Products', 'surecart')}
			columns={{
				product: {
					label: __('Product', 'surecart'),
					width: '200px',
				},
				discount_amount: {
					label: __('Discount Amount', 'surecart'),
				},
				subscription_commision: {
					label: __('Subscription Commission', 'surecart'),
				},
				lifetime_commision: {
					label: __('Lifetime Commission', 'surecart'),
				},
				action: {
					label: __('', 'surecart'),
					width: '80px',
				},
			}}
			data={affiliationProducts}
			isLoading={loading}
			isFetching={fetching}
			perPage={perPage}
			page={page}
			setPage={setPage}
			empty={
				page > 1
					? __('No more products.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				hasPagination && (
					<PrevNextButtons
						data={affiliationProducts}
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
