/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({ className, imageUrl, children, suffix, reason }) => {
	return (
		<div
			css={css`
				padding: var(--sc-spacing-x-large);
				border-bottom: 1px solid var(--sc-color-gray-300);
			`}
		>
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
					${!!imageUrl ? 'align-items: center' : ''};
					${!!imageUrl ? 'container-type: inline-size' : ''};
				`}
			>
				{!!imageUrl && (
					<img
						src={imageUrl}
						css={css`
							width: var(--sc-product-line-item-image-size, 4em);
							height: var(--sc-product-line-item-image-size, 4em);
							object-fit: cover;
							border-radius: 4px;
							border: solid 1px
								var(
									--sc-input-border-color,
									var(--sc-input-border)
								);
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
			{reason}
		</div>
	);
};
