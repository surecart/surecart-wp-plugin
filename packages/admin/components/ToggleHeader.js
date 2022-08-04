/** @jsx jsx */
import { css, jsx } from '@emotion/core';
const { __ } = wp.i18n;
import { ScButton } from '@surecart/components-react';

export default ({
	isOpen,
	setIsOpen,
	children,
	buttons,
	type,
	className,
	collapsible = true,
}) => {
	return (
		<div
			className={className}
			css={css`
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-radius: 8px;
				border: 1px solid transparent;
				${type === 'warning'
					? `background-color: var(--sc-color-warning-50);
        border-color: var(--sc-color-warning-200);
        color: var(--sc-color-warning-700);`
					: ``}
			`}
		>
			<div
				onClick={() => setIsOpen && setIsOpen(!isOpen)}
				css={css`
					cursor: pointer;
					flex: 1;
					user-select: none;
					display: inline-block;
					color: var(--sc-input-label-color);
					font-weight: var(--sc-input-label-font-weight);
					text-transform: var(--sc-input-label-text-transform, none);
					letter-spacing: var(--sc-input-label-letter-spacing, 0);
				`}
			>
				{children}
			</div>
			<div
				css={css`
					display: flex;
					align-items: center;
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
					`}
				>
					{!!buttons && buttons}
				</div>
				{collapsible && (
					<ScButton
						type="text"
						circle
						onClick={() => setIsOpen && setIsOpen(!isOpen)}
					>
						<svg
							css={css`
								transition: transform 250ms ease;
								transform: rotate(${isOpen ? '180deg' : '0'});
							`}
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					</ScButton>
				)}
			</div>
		</div>
	);
};
