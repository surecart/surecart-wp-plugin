import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ productId }) => {
	const { active, archived, updating, saving, deleting, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'price',
				{ context: 'edit', product_ids: [productId], per_page: 100 },
			];

			// get all prices for this product.
			const prices = select(coreStore).getEntityRecords(...queryArgs);

			// are we loading prices?
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			// are we saving any prices?
			const saving = (prices || []).some((price) =>
				select(coreStore).isSavingEntityRecord(
					'surecart',
					'price',
					price?.id
				)
			);

			const deleting = (prices || []).some((price) =>
				select(coreStore)?.isDeletingEntityRecord?.(
					'surecart',
					'price',
					price?.id
				)
			);

			// for all prices, merge with edits
			// we always show the edited version of the price.
			const editedPrices = (prices || [])
				.map((price) => {
					return {
						...price,
						...select(coreStore).getRawEntityRecord(
							'surecart',
							'price',
							price?.id
						),
						...select(coreStore).getEntityRecordEdits(
							'surecart',
							'price',
							price?.id
						),
					};
				})
				// sort by position.
				.sort((a, b) => a?.position - b?.position);

			return {
				active: (editedPrices || []).filter((price) => !price.archived),
				archived: (editedPrices || []).filter(
					(price) => price.archived
				),
				loading: loading && !prices?.length,
				deleting,
				saving,
				updating: (loading && prices?.length) || saving || deleting,
			};
		},
		[productId]
	);

	return {
		active,
		archived,
		updating,
		deleting,
		saving,
		loading,
	};
};
