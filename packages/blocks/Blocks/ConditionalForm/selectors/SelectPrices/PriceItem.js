import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import FilterItem from '../../../../../admin/components/filters/FilterItem';
import { formatNumber } from '../../../../../admin/util';
import { intervalString } from '../../../../../admin/util/translations';

export default ({ id, ...props }) => {
	const { item, hasLoadedItem } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'price',
				id,
				{
					expand: ['product'],
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
			image={item?.product?.line_item_image}
			icon={'tag'}
			{...props}
		>
			<strong style={{ display: 'block' }}>{item?.product?.name}</strong>
			{!!item && (
				<span>
					{item?.name ? `${item?.name} - ` : ''}
					{formatNumber(item?.amount, item?.currency)}{' '}
					{intervalString(item, { showOnce: true })}
				</span>
			)}
		</FilterItem>
	);
};
