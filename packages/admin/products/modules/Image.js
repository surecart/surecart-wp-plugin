/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScFormControl, ScIcon } from '@surecart/components-react';
import Box from '../../ui/Box';
import MediaLibrary from '../../components/MediaLibrary';

export default ({ product, updateProduct, loading }) => {
	const onSelectMedia = (media) => {
		return updateProduct({
			image: media?.id,
			image_url: media?.url,
		});
	};

	const onRemoveMedia = (media) => {
		return updateProduct({
			image: null,
			image_url: null,
		});
	};

	const renderImage = () => {
		if (product?.image_url) {
			return (
				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<img
						src={product?.image_url}
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
					onSelect={onSelectMedia}
					isPrivate={false}
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
			loading={loading}
			footer={
				<ScFormControl
					label={__('Product Image', 'surecart')}
					showLabel={false}
				>
					{renderMediaLibrary()}
				</ScFormControl>
			}
		>
			{renderImage()}
		</Box>
	);
};
