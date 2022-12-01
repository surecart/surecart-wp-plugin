import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import FilterItem from './FilterItem';

export default (props) => {
	const { id, name } = props;
	const { item, hasLoadedItem } = useSelect(
		(select) => {
			return {
				item: select(coreStore).getEntityRecord('surecart', name, id),
				hasLoadedItem: select(coreStore).hasFinishedResolution(
					'getEntityRecord',
					['surecart', name, id]
				),
			};
		},
		[id]
	);

	return (
		<FilterItem
			loading={!hasLoadedItem}
			imageUrl={item?.image_url}
			{...props}
		>
			<strong style={{ display: 'block' }}>{item?.name}</strong>
			{item?.email}
		</FilterItem>
	);
};
