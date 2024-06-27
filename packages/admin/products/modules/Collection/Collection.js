import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { ScSkeleton, ScTag } from '@surecart/components-react';

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
		return (
			<ScSkeleton style={{ width: '80px', height: '20px' }}></ScSkeleton>
		);
	}

	return (
		<ScTag onScClear={onRemove} clearable>
			{collection?.name}
		</ScTag>
	);
};
