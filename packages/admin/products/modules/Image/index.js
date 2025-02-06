/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { useState } from 'react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import AddImage from './AddImage';
import ConfirmDeleteImage from './ConfirmDeleteImage';
import Error from '../../../components/Error';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';
import WordPressMedia from './WordPressMedia';
import ProductMedia from './ProductMedia';
import { select } from '@wordpress/data';

const modals = {
	CONFIRM_DELETE_IMAGE: 'confirm_delete_image',
	ADD_IMAGE_FROM_URL: 'add_image_from_url',
};
export default ({ productId, product, updateProduct }) => {
	const [error, setError] = useState();
	const [currentModal, setCurrentModal] = useState('');
	const [selectedImage, setSelectedImage] = useState();
	const { createErrorNotice } = useDispatch(noticesStore);
	const { invalidateResolution } = useDispatch(coreStore);
	const { record: savedProduct } = useEntityRecord(
		'surecart',
		'product',
		productId
	);

	const onDragStop = (oldIndex, newIndex) =>
		updateProduct({
			gallery_ids: arrayMove(
				product?.gallery_ids || [],
				oldIndex,
				newIndex
			),
		});

	const onRemoveMedia = (id) =>
		updateProduct({
			gallery_ids: product?.gallery_ids.filter((itemId) => itemId !== id),
		});

	const onSwapMedia = (id, newId) => {
		// for some reason we need to select this again.
		const product = select(coreStore).getEditedEntityRecord(
			'surecart',
			'product',
			productId
		);

		const gallery_ids = [...(product?.gallery_ids || [])];
		// find the index of the old id
		const index = product?.gallery_ids.indexOf(id);
		gallery_ids[index] = newId;

		// if there is a duplicate image in the gallery, show an error
		if (new Set(gallery_ids).size !== gallery_ids.length) {
			createErrorNotice(
				__('This image is already in the gallery.', 'surecart'),
				{ type: 'snackbar' }
			);
			return;
		}

		updateProduct({
			gallery_ids,
		});
	};

	return (
		<Box title={__('Images', 'surecart')}>
			<Error error={error} setError={setError} margin="100px" />
			<SortableList
				css={css`
					display: grid;
					gap: 1em;
					grid-template-columns: ${product?.gallery_ids?.length
						? 'repeat(4, 1fr)'
						: '1fr'};
				`}
				draggedItemClassName="sc-dragging"
				onSortEnd={onDragStop}
			>
				{(product?.gallery_ids || []).map((id, index) => (
					<SortableItem key={id}>
						<div
							css={css`
								user-select: none;
								cursor: grab;
							`}
							key={id}
						>
							{typeof id === 'string' ? (
								<ProductMedia
									id={id}
									onRemove={() => onRemoveMedia(id)}
									onDownloaded={(newId) =>
										onSwapMedia(id, newId)
									}
									isFeatured={index === 0}
								/>
							) : (
								<WordPressMedia
									id={id}
									product={product}
									isNew={
										!savedProduct?.gallery_ids?.includes(id)
									}
									updateProduct={updateProduct}
									onRemove={() => onRemoveMedia(id)}
									onSelect={(media) =>
										onSwapMedia(id, media.id)
									}
									isFeatured={index === 0}
								/>
							)}
						</div>
					</SortableItem>
				))}
				<AddImage
					value={product?.gallery_ids || []}
					onClose={() =>
						(product?.gallery_ids || []).forEach(({ id }) =>
							invalidateResolution('getMedia', [id])
						)
					}
					onSelect={(media) => {
						const gallery_ids = (media || []).map(({ id }) => id);
						updateProduct({ gallery_ids });
					}}
				/>
			</SortableList>

			<ConfirmDeleteImage
				open={currentModal === modals.CONFIRM_DELETE_IMAGE}
				onRequestClose={() => {
					setSelectedImage();
					setCurrentModal('');
				}}
				selectedImage={selectedImage}
			/>
		</Box>
	);
};
