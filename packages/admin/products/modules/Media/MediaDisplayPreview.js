/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon, ScSkeleton } from '@surecart/components-react';

export default ({ media }) => {
	const isVideo = media?.mime_type?.includes('video');

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
				`}
			>
				<video
					controls={false}
					css={css`
						max-width: 100%;
						max-height: 100%;
						object-fit: contain;
						border-radius: var(--sc-border-radius-medium);
						pointer-events: none;
					`}
					src={media?.source_url}
					muted
					loop
					playsInline
					{...(media?.thumb?.src
						? {
								poster: media?.thumb?.src,
						  }
						: {})}
				>
					<source
						type={media?.mime}
						src={media?.source_url}
					/>
				</video>
				<div
					css={css`
						position: absolute;
						color: var(--sc-color-white);
						background-color: rgba(0, 0, 0, 0.5);
						border-radius: 50%;
						padding: var(--sc-spacing-small);
						width: 45px;
						height: 45px;
						display: flex;
						justify-content: center;
						align-items: center;

						svg {
							fill: var(--sc-color-white) !important;
						}
					`}
				>
					<ScIcon
						css={css`
							width: 20px;
							height: 30px;
							color: var(--sc-color-white);
						`}
						name="play"
					/>
				</div>
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
					max-height: 200px;
					object-fit: contain;
					display: block;
					border-radius: var(--sc-border-radius-medium);
					pointer-events: none;
					margin: 0 auto;
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

	return (
		<div
			className="media-display-preview"
			css={css`
				background: #f3f3f3;
				position: relative;
				border-radius: var(--sc-border-radius-medium);
				border: var(--sc-input-border);
				box-shadow: var(--sc-input-box-shadow);
				height: auto;
				width: 100%;
			`}
		>
			{media?.source_url ? (
				isVideo ? renderVideo() : renderImage()
			) : (
				<ScSkeleton
					style={{
						aspectRatio: '1 / 1',
						'--border-radius': 'var(--sc-border-radius-medium)',
					}}
				/>
			)}
		</div>
	);
};
