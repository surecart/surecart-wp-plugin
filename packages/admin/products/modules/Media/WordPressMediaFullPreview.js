/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * Internal dependencies.
 */
import { ScSkeleton } from '@surecart/components-react';
import { isVideo } from '../../../util/attachments';

export default ({ media, settings = {} }) => {
	const renderVideo = () => {
		return (
			<video
				css={css`
					width: 100%;
					height: 100%;
					object-fit: cover;
					display: block;
					aspect-ratio: ${settings?.aspect_ratio || '16/9'};
				`}
				{...settings?.controls ? { controls: true } : {}}
				{...settings?.autoplay ? { autoplay: true } : {}}
				{...settings?.loop ? { loop: true } : {}}
				{...settings?.muted ? { muted: true } : {}}
				src={media?.source_url}
				preload="metadata"
			>
				<source
					type={media?.mime_type || media?.mime}
					src={media?.source_url}
				/>
			</video>
		);
	};

	const renderImage = () => {
		return (
			<img
				src={
					media?.media_details?.sizes?.large?.source_url ||
					media?.source_url
				}
				css={css`
					max-width: 100%;
					max-height: 100%;
					display: block;
					border-radius: var(--sc-border-radius-medium);
					pointer-events: none;
					margin: 0 auto;
					aspect-ratio: ${settings?.aspect_ratio || '3/4'};
					object-fit: cover;
				`}
				alt={media?.alt_text}
				{...(media?.title?.rendered
					? {
							title: media?.title?.rendered,
					  }
					: {})}
				loading="lazy"
			/>
		);
	};

	const renderMedia = () => {
		if (!media?.source_url) {
			return (
				<ScSkeleton
					style={{
						aspectRatio: '1 / 1',
						'--border-radius': 'var(--sc-border-radius-medium)',
					}}
				/>
			);
		}

		return isVideo(media) ? renderVideo() : renderImage();
	};

	return (
		<div
			className="media-display-preview"
			css={css`
				background: #f3f3f3;
				position: relative;
				border-radius: var(--sc-border-radius-medium);
				border: var(--sc-input-border);
				box-shadow: var(--sc-input-box-shadow);
				width: 100%;
				max-width: var(--sc-drawer-size);
				overflow: hidden;
			`}
		>
			{renderMedia()}
		</div>
	);
};
