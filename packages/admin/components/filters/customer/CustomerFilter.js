import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import FilterItem from '../FilterItem';
import useAvatar from '../../../hooks/useAvatar';

export default (props) => {
	const { id } = props;
	const { item, hasLoadedItem } = useSelect(
		(select) => {
			return {
				item: select(coreStore).getEntityRecord(
					'surecart',
					'customer',
					id
				),
				hasLoadedItem: select(coreStore).hasFinishedResolution(
					'getEntityRecord',
					['surecart', 'customer', id]
				),
			};
		},
		[id]
	);

	const url = useAvatar({ email: item?.email });

	return (
		<FilterItem loading={!hasLoadedItem} imageUrl={url} {...props}>
			<strong style={{ display: 'block' }}>{item?.name}</strong>
			{item?.email}
		</FilterItem>
	);
};
