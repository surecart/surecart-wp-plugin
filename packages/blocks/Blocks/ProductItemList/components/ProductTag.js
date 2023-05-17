import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { ScTag } from '@surecart/components-react';

export default ({ id, onClear }) => {
	const { product, loading } = useSelect((select) => {
		const queryArgs = ['surecart', 'product', id];
		return {
			product: select(coreStore).getEntityRecord(...queryArgs),
			loading: select(coreStore).isResolving(
				'getEntityRecord',
				queryArgs
			),
		};
	});
	return (
		<ScTag clearable onScClear={onClear}>
			{product?.name}
		</ScTag>
	);
};
