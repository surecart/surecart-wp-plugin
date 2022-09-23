import { __ } from '@wordpress/i18n';
import useEntity from '../../../hooks/useEntity';
import FilterItem from './FilterItem';

export default (props) => {
	const { id, name } = props;
	const { item, hasLoadedItem } = useEntity(name, id);

	return (
		<FilterItem
			loading={!hasLoadedItem}
			imageUrl={item?.image_url}
			{...props}
		>
			<strong>{item?.name}</strong>
		</FilterItem>
	);
};
