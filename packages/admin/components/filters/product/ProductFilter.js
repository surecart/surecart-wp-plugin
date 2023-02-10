import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import FilterItem from '../FilterItem';

export default (props) => {
	const { id } = props;
	const { item, hasLoadedItem } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				id,
				{ expand: ['prices'] },
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
			{__('Any price', 'surecart')}
		</FilterItem>
	);
};
