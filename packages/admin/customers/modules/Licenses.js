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
import PrevNextButtons from '../../ui/PrevNextButtons';

export default ({ customerId }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(3);

	const { licenses, loading } = useSelect(
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
					page,
					per_page: perPage,
					expand: [
						'purchase',
						'purchase.price',
						'purchase.product',
						'product.featured_product_media',
						'product_media.media',
					],
				},
			];
			return {
				licenses: select(coreStore)?.getEntityRecords?.(...entityData),
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[customerId, page, perPage]
	);

	// We won't render anything if there are no licenses.
	if (!licenses?.length && !loading) {
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
			footer={
				hasPagination && (
					<PrevNextButtons
						data={licenses}
						page={page}
						setPage={setPage}
						perPage={perPage}
						loading={loading}
					/>
				)
			}
		/>
	);
};
