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

export default ({ referralId, loading }) => {
	const [page, setPage] = useState(1);
	const perPage = 5;

	const { referralItems, loadingItems } = useSelect(
		(select) => {
			if (!referralId) {
				return {
					referrals: [],
					loading: false,
				};
			}
			const queryArgs = [
				'surecart',
				'referral-item',
				{
					context: 'edit',
					referral_ids: [referralId],
					page,
					per_page: perPage,
					expand: [
						'line_item',
						'line_item.price',
						'line_item.product',
						'product.featured_product_media',
						'line_item.variant',
					],
				},
			];

			return {
				referralItems: select(coreStore).getEntityRecords(...queryArgs),
				loadingItems:
					select(coreStore).isResolving(
						'getEntityRecords',
						queryArgs
					) && page === 1,
			};
		},
		[referralId, page, perPage]
	);

	const { hasPagination } = usePagination({
		data: referralItems,
		page,
		perPage,
	});

	return (
		<ReferralsDataTable
			title={__('Referral Items', 'surecart')}
			columns={{
				purchase: {
					label: __('Purchase', 'surecart'),
				},
				commission_amount: {
					label: __('Commission', 'surecart'),
				},
				date: {
					label: __('Date', 'surecart'),
					width: '100px',
				},
			}}
			data={referralItems}
			isLoading={loading || loadingItems}
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
						data={referralItems}
						page={page}
						setPage={setPage}
						perPage={perPage}
					/>
				)
			}
		/>
	);
};
