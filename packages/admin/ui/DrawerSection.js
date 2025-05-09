/** @jsx jsx */
import { css, jsx, Global } from '@emotion/react';
export default ({
	title,
	children,
	style,
	suffix,
	description = '',
	highlight = false,
}) => {
	if (!children) {
		return null;
	}
	return (
		<>
			<Global
				styles={css`
					@keyframes gradientBorder {
						0% {
							background-position: 0% 0%;
						}
						25% {
							background-position: 100% 0%;
						}
						50% {
							background-position: 100% 100%;
						}
						75% {
							background-position: 0% 100%;
						}
						100% {
							background-position: 0% 0%;
						}
					}
				`}
			/>
			<div style={style}>
				<div
					css={css`
						display: grid;
						gap: var(
							--sc-input-label-margin,
							var(--sc-spacing-small)
						);
						margin-bottom: var(--sc-spacing-small);
					`}
				>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-x-small);
						`}
					>
						<div
							css={css`
								display: flex;
								align-items: center;
								justify-content: space-between;
								gap: var(--sc-spacing-x-small);
							`}
						>
							<h3
								css={css`
									margin: 0;
									font-size: var(
										--sc-input-label-font-size-medium
									);
									color: var(--sc-input-label-color);
									font-weight: var(
										--sc-input-label-font-weight
									);
								`}
							>
								{title}
							</h3>
							{suffix}
						</div>
						{!!description && (
							<p
								css={css`
									margin: 0;
									color: var(--sc-input-help-text-color);
									font-size: var(
										--sc-input-help-text-font-size-medium
									);
									font-weight: var(
										--sc-input-help-text-font-weight
									);
								`}
							>
								{description}
							</p>
						)}
					</div>

					<div
						css={css`
							padding: var(
								--sc-card-padding,
								var(--sc-spacing-large)
							);
							background: var(
								--sc-card-background-color,
								var(--sc-color-white)
							);
							border: 1px solid
								var(
									--sc-card-border-color,
									var(--sc-color-gray-300)
								);
							border-radius: var(--sc-input-border-radius-medium);
							box-shadow: var(--sc-shadow-small);
							${highlight &&
							css`
								position: relative;
								border: none;

								&::before {
									content: '';
									position: absolute;
									left: 0;
									top: 0;
									width: 100%;
									height: 100%;
									background: linear-gradient(
										90deg,
										#007cba 0%,
										#f1f5f7 50%,
										#007cba 100%
									);
									background-size: 200% 200%;
									animation: gradientBorder 6s linear infinite;
									mask: linear-gradient(#fff 0 0) content-box,
										linear-gradient(#fff 0 0);
									mask-composite: exclude;
									padding: 1px;
									border-radius: var(
										--sc-input-border-radius-medium
									);
									pointer-events: none;
								}
							`}

							> *:not(:last-child):after {
								content: '';
								display: block;
								height: 1px;
								background: var(--sc-input-border-color);
								margin: var(--sc-spacing-large)
									calc(
										var(
												--sc-card-padding,
												var(--sc-spacing-large)
											) * -1
									)
									var(--sc-spacing-large)
									calc(
										var(
												--sc-card-padding,
												var(--sc-spacing-large)
											) * -1
									);
							}
						`}
					>
						{children}
					</div>
				</div>
			</div>
		</>
	);
};
