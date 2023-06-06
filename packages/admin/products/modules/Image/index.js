/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { ScSkeleton } from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useState } from 'react';
import { ScBlockUi } from '@surecart/components-react';
import AddImage from './AddImage';
import ImageDisplay from './ImageDisplay';
import ConfirmDeleteImage from './ConfirmDeleteImage';
import AddUrlImage from './AddUrlImage';
import Error from '../../../components/Error';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';

const modals = {
	CONFIRM_DELETE_IMAGE: 'confirm_delete_image',
	ADD_IMAGE_FROM_URL: 'add_image_from_url',
};

export default ({ productId }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [error, setError] = useState();
	const [currentModal, setCurrentModal] = useState('');
	const [selectedImage, setSelectedImage] = useState();
	const { editEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { loading, fetching, saving, productMedia } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product-media',
				{
					product_ids: [productId],
					per_page: 100,
				},
			];

			const medias =
				select(coreStore).getEntityRecords(...queryArgs) || [];
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			// are we saving any product media?
			const saving = (
				select(coreStore)?.__experimentalGetEntitiesBeingSaved?.() || []
			).find((entity) => entity.name === 'product-media');

			// for all medias, merge with edits
			// we always show the edited version of the media.
			const productMedia = (medias || [])
				.map((media) => {
					return {
						...media,
						...select(coreStore).getRawEntityRecord(
							'surecart',
							'product-media',
							media?.id
						),
						...select(coreStore).getEntityRecordEdits(
							'surecart',
							'product-media',
							media?.id
						),
					};
				})
				// sort by position.
				.sort((a, b) => a?.position - b?.position);

			return {
				productMedia,
				loading: loading && !productMedia?.length,
				fetching: loading && productMedia?.length,
				saving,
			};
		},
		[productId]
	);

	const onDragStop = (oldIndex, newIndex) => {
		const result = arrayMove(productMedia, oldIndex, newIndex);
		// edit entity record to update indexes.
		(result || []).forEach(({ id, position }, index) => {
			if (index === position) return;
			editEntityRecord('surecart', 'product-media', id, {
				position: index,
			});
		});
	};

	const saveProductMedia = async (media) => {
		return saveEntityRecord(
			'surecart',
			'product-media',
			{
				product_id: productId,
				media_id: media.id,
			},
			{ throwOnError: true }
		);
	};

	const onAddMedia = async (medias) => {
		try {
			await Promise.all(medias.map((media) => saveProductMedia(media)));
			createSuccessNotice(__('Images updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	return (
		<Box title={__('Images', 'surecart')}>
			<Error error={error} setError={setError} margin="100px" />
			<SortableList
				css={css`
					display: grid;
					gap: 1em;
					grid-template-columns: ${loading || productMedia?.length
						? 'repeat(4, 1fr)'
						: '1fr'};
				`}
				onSortEnd={onDragStop}
			>
				{loading ? (
					[...Array(4)].map(() => {
						return (
							<ScSkeleton
								style={{
									aspectRatio: '1 / 1',
									'--border-radius':
										'var(--sc-border-radius-medium)',
								}}
							/>
						);
					})
				) : (
					<>
						{productMedia.map((pMedia) => (
							<SortableItem key={pMedia.id}>
								<div
									css={css`
										user-select: none;
										cursor: grab;
									`}
								>
									<ImageDisplay
										onDeleteImage={(image) => {
											setSelectedImage(image);
											setCurrentModal(
												modals.CONFIRM_DELETE_IMAGE
											);
										}}
										id={pMedia.id}
										isFeatured={pMedia?.position === 0}
										productMedia={pMedia}
									/>
								</div>
							</SortableItem>
						))}
						<AddImage
							existingMediaIds={(productMedia || []).map(
								(pMedia) => pMedia.media?.id
							)}
							onAddMedia={onAddMedia}
							onAddFromURL={() => {
								setCurrentModal(modals.ADD_IMAGE_FROM_URL);
							}}
						/>
					</>
				)}
			</SortableList>

			{(!!saving || !!fetching) && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}

			<ConfirmDeleteImage
				open={currentModal === modals.CONFIRM_DELETE_IMAGE}
				onRequestClose={() => {
					setSelectedImage();
					setCurrentModal('');
				}}
				selectedImage={selectedImage}
			/>

			<AddUrlImage
				open={currentModal === modals.ADD_IMAGE_FROM_URL}
				onRequestClose={() => {
					setCurrentModal('');
				}}
				productId={productId}
			/>
		</Box>
	);
};
