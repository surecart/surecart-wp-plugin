/** @jsx jsx */
import { css, jsx } from '@emotion/core';

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
import ReferralItemsDataTable from '../../components/data-tables/affiliates/ReferralItemsDataTable';

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
						'price.product',
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
		<ReferralItemsDataTable
			title={__('Purchases', 'surecart')}
			columns={{
				purchase: {
					label: __('Item', 'surecart'),
				},
				quantity: {
					label: __('Quantity', 'surecart'),
					width: '75px',
				},
				commission_amount: {
					label: (
						<div
							css={css`
								display: flex;
								justify-content: flex-end;
							`}
						>
							{__('Commission', 'surecart')}
						</div>
					),
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
