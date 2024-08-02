import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import ImageDisplay from './ImageDisplay';

export default ({ id, onRemove, isFeatured }) => {
	const media = useSelect((select) => {
		const queryArgs = ['surecart', 'product-media', id];
		return select(coreStore).getEditedEntityRecord(...queryArgs);
	});

	return (
		<ImageDisplay
			productMedia={media}
			onDeleteImage={onRemove}
			isFeatured={isFeatured}
		/>
	);
};
