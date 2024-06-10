import { ScTag } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default ({ id, slug, onToggle }) => {
	const { name } = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('taxonomy', slug, id) || {},
		[id]
	);

	return (
		<ScTag key={id} onScClear={onToggle} clearable>
			{name}
		</ScTag>
	);
};
