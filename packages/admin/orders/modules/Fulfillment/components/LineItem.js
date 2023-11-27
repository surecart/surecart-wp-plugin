/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({ className, media, children, suffix }) => {
	return (
		<div
			className={className}
			css={css`
				box-sizing: border-box;
				margin: 0px;
				min-width: 0px;
				display: flex;
				gap: 18px;
				justify-content: space-between;
				align-items: stretch;
				width: 100%;
				border-bottom: none;
				${!!media.url ? 'align-items: center' : ''};
				${!!media.url ? 'container-type: inline-size' : ''};
			`}
		>
			{!!media.url && (
				<img
					src={media.url}
					alt={media.alt}
					{...(media.title ? { title: media.title } : {})}
					css={css`
						width: var(--sc-product-line-item-image-size, 4em);
						height: var(--sc-product-line-item-image-size, 4em);
						object-fit: cover;
						border-radius: 4px;
						border: solid 1px
							var(--sc-input-border-color, var(--sc-input-border));
						display: block;
						box-shadow: var(--sc-input-box-shadow);
					`}
				/>
			)}

			<div
				css={css`
					flex: 1 1 0%;
				`}
			>
				<div
					css={css`
						box-sizing: border-box;
						margin: 0px;
						min-width: 0px;
						display: flex;
						gap: 6px;
						flex-direction: column;
						align-items: flex-start;
						justify-content: flex-start;
					`}
				>
					{children}
				</div>
			</div>

			<div>{suffix}</div>
		</div>
	);
};
