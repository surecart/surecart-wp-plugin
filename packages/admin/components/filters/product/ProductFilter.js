import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import FilterItem from '../FilterItem';
import { getFeaturedProductMediaAttributes } from '@surecart/components';

export default (props) => {
	const { id } = props;
	const { item, hasLoadedItem } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				id,
				{
					expand: [
						'prices',
						'featured_product_media',
						'product_media.media',
					],
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
			media={getFeaturedProductMediaAttributes(item)}
			icon={'image'}
			{...props}
		>
			<strong style={{ display: 'block' }}>{item?.name}</strong>
			{__('Any price', 'surecart')}
		</FilterItem>
	);
};
