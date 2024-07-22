/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from 'react';
import AddImage from './AddImage';
import ConfirmDeleteImage from './ConfirmDeleteImage';
import Error from '../../../components/Error';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';
import WordPressMedia from './WordPressMedia';
import ProductMedia from './ProductMedia';

const modals = {
	CONFIRM_DELETE_IMAGE: 'confirm_delete_image',
	ADD_IMAGE_FROM_URL: 'add_image_from_url',
};
export default ({ post }) => {
	const [error, setError] = useState();
	const [currentModal, setCurrentModal] = useState('');
	const [selectedImage, setSelectedImage] = useState();
	const { editEntityRecord } = useDispatch(coreStore);

	const onDragStop = (oldIndex, newIndex) => {
		const gallery = arrayMove(post?.gallery || [], oldIndex, newIndex);
		editEntityRecord('postType', 'sc_product', post?.id, { gallery });
	};

	const onRemoveMedia = (id) => {
		const gallery = post?.gallery.filter((item) => item.id !== id);
		editEntityRecord('postType', 'sc_product', post?.id, { gallery });
	};

	return (
		<Box title={__('Images', 'surecart')}>
			<Error error={error} setError={setError} margin="100px" />
			<SortableList
				css={css`
					display: grid;
					gap: 1em;
					grid-template-columns: ${post?.gallery?.length
						? 'repeat(4, 1fr)'
						: '1fr'};
				`}
				draggedItemClassName="sc-dragging"
				onSortEnd={onDragStop}
			>
				{(post?.gallery || []).map(({ id }, index) => (
					<SortableItem key={id}>
						<div
							css={css`
								user-select: none;
								cursor: grab;
							`}
						>
							{typeof id === 'string' ? (
								<ProductMedia
									id={id}
									onRemove={() => onRemoveMedia(id)}
									isFeatured={index === 0}
								/>
							) : (
								<WordPressMedia
									id={id}
									onRemove={() => onRemoveMedia(id)}
									isFeatured={index === 0}
								/>
							)}
						</div>
					</SortableItem>
				))}
				<AddImage
					value={(post?.gallery || []).map(({ id }) => id)}
					onSelect={(media) => {
						const mediaIds = (media || []).map(({ id }) => ({
							id,
						}));

						// Update the media ids.
						editEntityRecord('postType', 'sc_product', post?.id, {
							gallery: mediaIds,
						});
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
