/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton, ScFormControl, ScIcon } from '@surecart/components-react';
import MediaLibrary from '../../components/MediaLibrary';

export default ({ label, collection, updateCollection, showLabel = false }) => {
	const onSelectMedia = (media) => {
		updateCollection({
			image_id: media?.id,
			image: media,
		});
	};

	const onRemoveMedia = () => {
		const confirmedRemoveImage = confirm(
			__('Are you sure you want to remove this image?', 'surecart')
		);
		if (!confirmedRemoveImage) return;
		return updateCollection({
			image_id: null,
			image: null,
		});
	};

	const renderContent = () => {
		if (collection?.image?.url) {
			return (
				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<img
						src={collection?.image?.url}
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
								render={({ setOpen }) => (
									<ScButton
										type="primary"
										onClick={() => setOpen(true)}
									>
										{__('Replace', 'surecart')}
									</ScButton>
								)}
							/>
							<ScButton onClick={onRemoveMedia}>
								{__('Remove', 'surecart')}
							</ScButton>
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
					render={({ setOpen }) => (
						<ScButton type="primary" onClick={() => setOpen(true)}>
							<ScIcon name="plus" slot="prefix" />
							{__('Add Image', 'surecart')}
						</ScButton>
					)}
				/>
			</ScFormControl>
		);
	};

	return (
		<ScFormControl label={label} showLabel={showLabel}>
			{renderContent()}
		</ScFormControl>
	);
};
