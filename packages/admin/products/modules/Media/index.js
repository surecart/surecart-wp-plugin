/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { useState } from 'react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import AddMedia from './AddMedia';
import EditMedia from './EditMedia';
import ConfirmDeleteMedia from './ConfirmDeleteMedia';
import Error from '../../../components/Error';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';
import WordPressMedia from './WordPressMedia';
import ProductMedia from './ProductMedia';
import { select } from '@wordpress/data';
import {
	normalizeGalleryItem,
	getGalleryItemId,
	createGalleryItem,
	updateGalleryItem,
} from '../../../util/attachments';

const modals = {
	CONFIRM_DELETE_MEDIA: 'confirm_delete_media',
	EDIT_MEDIA: 'edit_media',
};
export default ({ productId, product, updateProduct }) => {
	const [error, setError] = useState();
	const [currentModal, setCurrentModal] = useState('');
	const [selectedMedia, setSelectedMedia] = useState();
	const { createErrorNotice } = useDispatch(noticesStore);
	const { invalidateResolution } = useDispatch(coreStore);
	const { record: savedProduct } = useEntityRecord(
		'surecart',
		'product',
		productId
	);

	const updateGalleryIds = (gallery_ids) => {
		updateProduct({
			gallery_ids,
			metadata: {
				...(product?.metadata || {}),
				gallery_ids,
			},
		});
	};

	const onDragStop = (oldIndex, newIndex) =>
		updateGalleryIds(
			arrayMove(product?.gallery_ids || [], oldIndex, newIndex)
		);

	const onRemoveMedia = (id) =>
		updateGalleryIds(
			(product?.gallery_ids || []).filter((item) => getGalleryItemId(item) !== id)
		);

	const onSwapMedia = (oldId, newId) => {
		// for some reason we need to select this again.
		const product = select(coreStore).getEditedEntityRecord(
			'surecart',
			'product',
			productId
		);

		const gallery_ids = [...(product?.gallery_ids || [])];
		// find the index of the old id
		const index = gallery_ids.findIndex((item) => getGalleryItemId(item) === oldId);
		
		if (index === -1) return;

		// Get the existing item and preserve its properties while updating the ID
		const existingItem = gallery_ids[index];
		if (typeof existingItem === 'object' && existingItem !== null) {
			gallery_ids[index] = { ...existingItem, id: newId };
		} else {
			gallery_ids[index] = newId;
		}

		// if there is a duplicate media in the gallery, show an error.
		const ids = gallery_ids.map(getGalleryItemId);
		if (new Set(ids).size !== ids.length) {
			createErrorNotice(
				__('This media is already in the gallery.', 'surecart'),
				{ type: 'snackbar' }
			);
			return;
		}

		updateGalleryIds(gallery_ids);
	};

	return (
		<Box title={__('Media', 'surecart')}>
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
				{(product?.gallery || []).map((item, index) => {
					const itemId = getGalleryItemId(item);
					return (
						<SortableItem key={itemId}>
							<div
								css={css`
									user-select: none;
									cursor: grab;
								`}
								key={itemId}
							>
								{typeof itemId === 'string' ? (
									<ProductMedia
										id={itemId}
										onRemove={() => onRemoveMedia(itemId)}
										onDownloaded={(newId) =>
											onSwapMedia(itemId, newId)
										}
										isFeatured={index === 0}
									/>
								) : (
									<WordPressMedia
										id={itemId}
										item={item}
										product={product}
										isNew={
											!savedProduct?.gallery_ids?.some(savedItem => 
												getGalleryItemId(savedItem) === itemId
											)
										}
										updateProduct={updateProduct}
										onRemove={() => onRemoveMedia(itemId)}
										onSelect={(media) =>
											onSwapMedia(itemId, media.id)
										}
										isFeatured={index === 0}
										onEditMedia={(media) => {
											setSelectedMedia({
												...media,
												...(typeof item === 'object' ? item : {}),
											});
											setCurrentModal(modals.EDIT_MEDIA);
										}}
										onUpdateItem={(updatedItem) => {
											const gallery_ids = [...(product?.gallery_ids || [])];
											const updateIndex = gallery_ids.findIndex(galleryItem => 
												getGalleryItemId(galleryItem) === itemId
											);
											if (updateIndex !== -1) {
												gallery_ids[updateIndex] = updatedItem;
												updateGalleryIds(gallery_ids);
											}
										}}
									/>
								)}
							</div>
						</SortableItem>
					);
				})}
				<AddMedia
					value={product?.gallery_ids || []}
					onClose={() =>
						(product?.gallery_ids || []).forEach((item) => {
							const id = getGalleryItemId(item);
							if (typeof id === 'number') {
								invalidateResolution('getMedia', [id]);
							}
						})
					}
					onSelect={(media) => {
						const gallery_ids = (media || []).map(({ id }) => createGalleryItem(id));
						updateGalleryIds(gallery_ids);
					}}
				/>
			</SortableList>

			<ConfirmDeleteMedia
				open={currentModal === modals.CONFIRM_DELETE_MEDIA}
				onRequestClose={() => {
					setSelectedMedia();
					setCurrentModal('');
				}}
				selectedMedia={selectedMedia}
			/>

			<EditMedia
				media={selectedMedia}
				setMedia={(updatedMedia) => {
					setSelectedMedia(updatedMedia);
				}}
				onSave={(updatedItem) => {
					// Update the gallery with the new item data
					const gallery_ids = [...(product?.gallery_ids || [])];
					const updateIndex = gallery_ids.findIndex(item => 
						getGalleryItemId(item) === getGalleryItemId(selectedMedia)
					);
					
					if (updateIndex !== -1) {
						gallery_ids[updateIndex] = updatedItem;
						updateGalleryIds(gallery_ids);
					}
					
					// Invalidate cache for the media
					invalidateResolution('getMedia', [getGalleryItemId(updatedItem)]);
					setCurrentModal('');
					setSelectedMedia(null);
				}}
				open={currentModal === modals.EDIT_MEDIA}
				product={product}
				onRequestClose={() => {
					setCurrentModal('');
					setSelectedMedia(null);
				}}
			/>
		</Box>
	);
};
