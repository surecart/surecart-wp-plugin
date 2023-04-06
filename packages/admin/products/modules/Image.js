/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScFormControl, ScIcon } from '@surecart/components-react';
import Box from '../../ui/Box';
import MediaLibrary from '../../components/MediaLibrary';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from 'react';
import { ScBlockUi } from '@surecart/components-react';
import $ from 'jquery';

export default ({ product, updateProduct, loading }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [isSaving, setIsSaving] = useState(false);
	const imageContainerRef = useRef(null);

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

	useEffect(() => {
		if (!!imageContainerRef && !!productMedia?.length) {
			const productImageList = $(imageContainerRef.current);
			productImageList.sortable();
			$('#product-images-container').hide(200);

			return () => {
				productImageList.sortable('destroy');
			};
		}
	}, [imageContainerRef]);

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

	const onRemoveMedia = (media) => {
		return updateProduct({
			image: null,
			image_url: null,
		});
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
					ref={imageContainerRef}
					id="product-images-container"
				>
					{productMedia.map((pMedia) => (
						<img
							key={pMedia.id}
							src={pMedia?.media?.url}
							alt="product image"
							css={css`
								max-width: 100%;
								width: 380px;
								aspect-ratio: 1/1;
								object-fit: cover;
								height: auto;
								display: block;
								border-radius: var(--sc-border-radius-medium);
								background: #f3f3f3;
							`}
						/>
					))}
				</div>
			);
		}
	};

	const renderMediaLibrary = () => {
		if (product?.image_url) {
			return (
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<MediaLibrary
						onSelect={onSelectMedia}
						isPrivate={false}
						render={({ setOpen }) => {
							return (
								<>
									<ScButton onClick={() => setOpen(true)}>
										<ScIcon
											name="repeat"
											slot="prefix"
										></ScIcon>
										{__('Replace', 'surecart')}
									</ScButton>
									<ScButton
										css={css`
											color: var(--sc-color-gray-600);
										`}
										type="text"
										onClick={onRemoveMedia}
									>
										{__('Remove', 'surecart')}
									</ScButton>
								</>
							);
						}}
					></MediaLibrary>
				</div>
			);
		} else {
			return (
				<MediaLibrary
					onSelect={onAddMedia}
					isPrivate={false}
					isMultiSelect={true}
					render={({ setOpen }) => {
						return (
							<ScButton onClick={() => setOpen(true)}>
								<ScIcon name="plus" slot="prefix"></ScIcon>
								{__('Add Image', 'surecart')}
							</ScButton>
						);
					}}
				></MediaLibrary>
			);
		}
	};

	return (
		<Box
			title={__('Product Image', 'surecart')}
			loading={loading || fetchingMedia}
			footer={
				<ScFormControl
					label={__('Product Image', 'surecart')}
					showLabel={false}
				>
					{renderMediaLibrary()}
				</ScFormControl>
			}
		>
			{renderImages()}
			{isSaving && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</Box>
	);
};
