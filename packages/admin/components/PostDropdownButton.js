/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { Button } from '@wordpress/components';

export default ({
	children,
	isOpen,
	onClick,
	title,
	ariaLabel,
	icon,
	...rest
}) => {
	return (
		<Button
			css={css`
				height: auto;
				text-align: right;
				white-space: normal !important;
				word-break: break-word;
			`}
			variant="tertiary"
			aria-expanded={isOpen}
			aria-label={ariaLabel || title}
			onClick={onClick}
			{...rest}
		>
			{children || title}
			{icon || (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					width="18"
					height="18"
					style={{
						fill: 'none',
						color: 'var(--sc-color-gray-300)',
						marginLeft: '6px',
						flex: '1 0 18px',
					}}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
					/>
				</svg>
			)}
		</Button>
	);
};
