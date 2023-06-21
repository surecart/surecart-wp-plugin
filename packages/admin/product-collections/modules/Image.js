/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScFormControl } from '@surecart/components-react';
import MediaLibrary from '../../components/MediaLibrary';

export default ({ label, productCollection, updateProductCollection, showLabel = false }) => {
	const onSelectMedia = (media) => {
		return updateProductCollection({
			media_id: media?.id,
			image_url: media?.url,
		});
	};

	const onRemoveMedia = (media) => {
		const r = confirm(
			__('Are you sure you want to remove this image?', 'surecart')
		);
		if (!r) return;
		return updateProductCollection({
			media_id: null,
			image_url: null,
		});
	};

	const renderContent = () => {
		if (productCollection?.image_url) {
			return (
				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<img
						src={productCollection?.image_url}
						alt="image"
						css={css`
							width: 100%;
							height: 100%;
							max-height: 8rem;
							object-fit: contain;
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
				</div>
			);
		}

		return (
			<ScFormControl label={label} showLabel={false}>
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

	return <ScFormControl label={label} showLabel={showLabel}>{renderContent()}</ScFormControl>;
};
