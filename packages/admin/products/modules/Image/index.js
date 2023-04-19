/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { ScSkeleton } from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect, useState, useRef } from 'react';
import { ScBlockUi } from '@surecart/components-react';
import AddImage from './AddImage';
import ImageDisplay from './ImageDisplay';
import ConfirmDeleteImage from './ConfirmDeleteImage';
import AddUrlImage from './AddUrlImage';
import Error from '../../../components/Error';

const modals = {
	CONFIRM_DELETE_IMAGE: 'confirm_delete_image',
	ADD_IMAGE_FROM_URL: 'add_image_from_url',
};

export default ({ productId }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const container = useRef();
	const [error, setError] = useState();
	const [currentModal, setCurrentModal] = useState('');
	const [selectedImage, setSelectedImage] = useState();

	const { loading, fetching, saving, productMedia } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product-media',
				{
					context: 'edit',
					product_ids: [productId],
					expand: ['media'],
				},
			];

			const productMedia =
				select(coreStore).getEntityRecords(...queryArgs) || [];
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			// are we saving any prices?
			const saving = (productMedia || []).some((price) =>
				select(coreStore).isSavingEntityRecord(
					'surecart',
					'product-media',
					price?.id
				)
			);

			return {
				productMedia,
				loading: loading && !productMedia?.length,
				fetching: loading && productMedia?.length,
				saving,
			};
		},
		[productId]
	);

	const onDragStop = (e) => {
		try {
			const order = jQuery(container.current).sortable('toArray', {
				attribute: 'media-id',
			});
			// $(node).sortable('cancel');
			order.forEach((id, index) => {
				if (!id) return;
				editEntityRecord('surecart', 'product-media', id, {
					position: index,
				});
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	// dispatchers.
	const { editEntityRecord } = useDispatch(coreStore);

	useEffect(() => {
		if (!container.current) return;
		jQuery(container.current).sortable({
			stop: onDragStop,
			cancel: '.cancel-sortable',
		});
	}, [container]);

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
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	return (
		<Box title={__('Images', 'surecart')}>
			<Error error={error} setError={setError} />
			<div
				css={css`
					display: grid;
					gap: 1em;
					grid-template-columns: repeat(4, 1fr);
				`}
				ref={container}
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
						{productMedia.map((pMedia, index) => (
							<ImageDisplay
								onDeleteImage={(image) => {
									setSelectedImage(image);
									setCurrentModal(
										modals.CONFIRM_DELETE_IMAGE
									);
								}}
								id={pMedia.id}
								key={pMedia.id}
								isFeatured={index === 0}
								productMedia={pMedia}
							/>
						))}
						<AddImage
							onAddMedia={onAddMedia}
							onAddFromURL={() => {
								setCurrentModal(modals.ADD_IMAGE_FROM_URL);
							}}
						/>
					</>
				)}
			</div>

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
