/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { ScFormControl } from '@surecart/components-react';
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

	const renderContent = () => {
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
									<Button
										isPrimary
										onClick={() => setOpen(true)}
									>
										{__('Replace', 'surecart')}
									</Button>
								);
							}}
						></MediaLibrary>
						<Button isTertiary onClick={onRemoveMedia}>
							{__('Remove', 'surecart')}
						</Button>
					</div>
				</div>
			);
		}

		return (
			<ScFormControl
				label={__('Product Image', 'surecart')}
				showLabel={false}
			>
				<MediaLibrary
					onSelect={onSelectMedia}
					isPrivate={false}
					render={({ setOpen }) => {
						return (
							<Button isPrimary onClick={() => setOpen(true)}>
								{__('Add Image', 'surecart')}
							</Button>
						);
					}}
				></MediaLibrary>
			</ScFormControl>
		);
	};

	return (
		<Box title={__('Product Image', 'surecart')} loading={loading}>
			<ScFormControl
				label={__('Product Image', 'surecart')}
				showLabel={false}
			>
				{renderContent()}
			</ScFormControl>
		</Box>
	);
};
