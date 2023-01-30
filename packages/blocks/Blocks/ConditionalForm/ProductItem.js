import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { ScPriceRange } from '@surecart/components-react';
import FilterItem from '../../../admin/components/filters/FilterItem';

export default ({ id, ...props }) => {
	const { item, hasLoadedItem } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				id,
				{
					expand: ['prices'],
				},
			];
			return {
				item: select(coreStore).getEntityRecord(...queryArgs),
				hasLoadedItem: select(coreStore).hasFinishedResolution(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[id]
	);

	return (
		<FilterItem
			loading={!hasLoadedItem}
			imageUrl={item?.image_url}
			icon={'image'}
			{...props}
		>
			<strong style={{ display: 'block' }}>{item?.name}</strong>
			<ScPriceRange prices={item?.prices?.data || []} />
		</FilterItem>
	);
};
