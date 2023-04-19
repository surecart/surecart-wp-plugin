/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { ScSkeleton } from '@surecart/components-react';
import { select, useDispatch, useSelect } from '@wordpress/data';
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
	const { editEntityRecord } = useDispatch(coreStore);

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

			const media =
				select(coreStore).getEntityRecords(...queryArgs) || [];
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			// are we saving any prices?
			const saving = (media || []).some((price) =>
				select(coreStore).isSavingEntityRecord(
					'surecart',
					'product-media',
					price?.id
				)
			);

			console.log({ media });

			// const productMedia = (media || [])
			// 	.map((media) => {
			// 		return {
			// 			...media,
			// 			...select(coreStore).getRawEntityRecord(
			// 				'surecart',
			// 				'product-media',
			// 				media?.id
			// 			),
			// 			...select(coreStore).getEntityRecordEdits(
			// 				'surecart',
			// 				'product-media',
			// 				media?.id
			// 			),
			// 		};
			// 	})
			// 	// sort by position.
			// 	.sort((a, b) => a?.position - b?.position);

			// console.log({ productMedia });

			return {
				productMedia: media,
				loading: loading && !media?.length,
				fetching: loading && media?.length,
				saving,
			};
		},
		[productId]
	);

	const onDragStop = () => {
		try {
			const order = jQuery(container.current).sortable('toArray', {
				attribute: 'media-id',
			});
			order.forEach((id, position) => {
				if (!id) return;
				editEntityRecord('surecart', 'product-media', id, {
					position,
				});
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	useEffect(() => {
		jQuery(container.current).sortable({
			stop: () => onDragStop(),
			cancel: '.cancel-sortable',
		});
	}, []);

	// useEffect(() => {
	// 	if (!productMedia?.length) return;
	// 	const first = select(coreStore).getEntityRecord(
	// 		'surecart',
	// 		'product-media',
	// 		productMedia[0]?.id
	// 	);
	// 	if (first?.id) {
	// 		editEntityRecord('surecart', 'product-media', first.id, {
	// 			position: 3,
	// 		});

	// 		console.log(first, productMedia[0]);
	// 	}
	// }, [productMedia]);

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
			<Error error={error} setError={setError} margin="100px" />
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
