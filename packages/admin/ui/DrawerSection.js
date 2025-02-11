/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { ScCard, ScIcon } from '@surecart/components-react';
export default ({ title, children, style }) => {
	if (!children) {
		return null;
	}
	return (
		<div
			style={style}
			css={css`
				display: grid;
				gap: 1em;

				sc-divider {
					margin: 20px -20px;
				}
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: space-between;
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: var(--sc-spacing-medium);
					`}
				>
					<h3
						css={css`
							margin: 0;
							font-size: var(--sc-input-label-font-size-medium);
							color: var(--sc-input-label-color);
							font-weight: var(--sc-input-label-font-weight);
						`}
					>
						{__(title)}
					</h3>
				</div>
			</div>

			<ScCard>{children}</ScCard>
		</div>
	);
};
