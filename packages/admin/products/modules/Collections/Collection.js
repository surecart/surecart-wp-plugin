import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { ScTag } from '@surecart/components-react';

export default ({ id, onRemove }) => {
	const collection = useSelect(
		(select) =>
			select(coreStore).getEntityRecord(
				'surecart',
				'product-collection',
				id
			),
		[id]
	);

	if (!collection?.name) {
		return null;
	}

	return (
		<ScTag onScClear={onRemove} clearable>
			{collection?.name}
		</ScTag>
	);
};
