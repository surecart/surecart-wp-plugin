import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import MediaDisplay from './MediaDisplay';

export default ({ id, onDownloaded, onRemove, isFeatured }) => {
	const media = useSelect((select) => {
		const queryArgs = ['surecart', 'product-media', id];
		return select(coreStore).getEditedEntityRecord(...queryArgs);
	});

	return (
		<MediaDisplay
			productMedia={media}
			onDeleteImage={onRemove}
			isFeatured={isFeatured}
			onDownloaded={onDownloaded}
		/>
	);
};
