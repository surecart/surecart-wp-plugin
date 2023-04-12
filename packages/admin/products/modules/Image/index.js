/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect, useState } from 'react';
import { ScBlockUi } from '@surecart/components-react';
import AddImage from './AddImage';
import ImageDisplay from './ImageDisplay';
import ConfirmDeleteImage from './ConfirmDeleteImage';

const modals = {
	CONFIRM_DELETE_IMAGE: 'confirm_delete_image',
};
export default ({ product, updateProduct, loading }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [isSaving, setIsSaving] = useState(false);
	const [currentModal, setCurrentModal] = useState('');
	const [selectedImage, setSelectedImage] = useState();

	const { fetchingMedia, productMedia } = useSelect(
		(select) => {
			if (!product?.id) {
				return {
					productMedia: [],
					fetchingMedia: false,
				};
			}

			const queryArgs = [
				'surecart',
				'product-medias',
				{
					context: 'edit',
					product_ids: [product?.id],
					expand: ['media'],
				},
			];

			return {
				productMedia:
					select(coreStore).getEntityRecords(...queryArgs) || [],
				fetchingMedia: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[product?.id]
	);

	// dispatchers.
	const { editEntityRecord, deleteEntityRecord, saveEditedEntityRecord } =
		useDispatch(coreStore);

	const onDragStop = (e) => {
		const imgTags = e.target?.children || [];
		for (let i = 0; i < imgTags.length; i++) {
			if (!imgTags[i]?.getAttribute('media-id')) {
				continue;
			}
			editEntityRecord(
				'surecart',
				'product-medias',
				imgTags[i].getAttribute('media-id'),
				{
					position: i,
				}
			);
		}
	};

	useEffect(() => {
		jQuery(document).ready(function ($) {
			if (!!productMedia?.length) {
				$('#product-images-container').sortable({
					stop: onDragStop,
					cancel: '.cancel-sortable',
				});
			}
		});
	}, [productMedia]);

	const onSelectMedia = (media) => {
		return updateProduct({
			image: media?.id,
			image_url: media?.url,
		});
	};

	const saveProductMedia = async (media) => {
		return saveEntityRecord(
			'surecart',
			'product-medias',
			{
				product_id: product.id,
				media_id: media.id,
			},
			{ throwOnError: true }
		);
	};

	const onAddMedia = async (medias) => {
		setIsSaving(true);
		try {
			await Promise.all(medias.map((media) => saveProductMedia(media)));
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
		} finally {
			setIsSaving(false);
		}
	};

	const renderImages = () => {
		if (!!productMedia?.length) {
			return (
				<div
					css={css`
						display: grid;
						gap: 1em;
						grid-template-columns: repeat(2, 1fr);
					`}
					id="product-images-container"
				>
					{productMedia.map((pMedia) => (
						<ImageDisplay
							onDeleteImage={(image) => {
								setSelectedImage(image);
								setCurrentModal(modals.CONFIRM_DELETE_IMAGE);
							}}
							key={pMedia.id}
							productMedia={pMedia}
						/>
					))}
					<AddImage onAddMedia={onAddMedia} />
				</div>
			);
		}
	};

	return (
		<Box
			title={__('Product Image', 'surecart')}
			loading={loading || fetchingMedia}
		>
			{renderImages()}
			{isSaving && (
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
		</Box>
	);
};
