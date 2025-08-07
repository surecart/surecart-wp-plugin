/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScSkeleton } from '@surecart/components-react';
import { isVideo } from '../../../util/attachments';

export default ({ media, settings = {} }) => {
	const videoRef = useRef(null);

	useEffect(() => {
		if (!isVideo(media) || !videoRef.current || !window.wp?.mediaelement)
			return;

		let player;
		try {
			player = window.wp.mediaelement.initialize(
				videoRef.current,
				window._wpmejsSettings
			);
		} catch (error) {
			console.warn('Failed to initialize MediaElement:', error);
		}

		return () => player?.remove?.();
	}, [media?.source_url]);

	const renderVideo = () => {
		return (
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: center;
					height: 100%;
					width: 100%;
					position: relative;
					aspect-ratio: ${settings?.aspect_ratio || '16/9'};

					.wp-video {
						width: 100% !important;
						height: auto !important;
					}

					.mejs-container {
						overflow: hidden;
						border-radius: var(--sc-border-radius-medium);
					}

					.mejs-video {
						border-radius: var(--sc-border-radius-medium);
					}
				`}
			>
				<video
					ref={videoRef}
					className="wp-video-shortcode"
					controls
					src={media?.source_url}
					preload="metadata"
				>
					<source
						type={media?.mime_type || media?.mime}
						src={media?.source_url}
					/>
				</video>
			</div>
		);
	};

	const renderImage = () => {
		return (
			<img
				src={
					media?.media_details?.sizes?.medium?.source_url ||
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
				justify-content: center;
				display: flex;
				align-items: center;
			`}
		>
			{renderMedia()}
		</div>
	);
};
