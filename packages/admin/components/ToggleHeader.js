/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon } from '@surecart/components-react';
import { SortableKnob } from 'react-easy-sort';

export default ({
	isOpen,
	setIsOpen,
	children,
	buttons,
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
				border-radius: var(--sc-border-radius-medium);
			`}
		>
			<div
				onClick={() => setIsOpen && setIsOpen(!isOpen)}
				css={css`
					display: flex;
					gap: var(--sc-spacing-small);
					cursor: pointer;
					flex: 1;
					user-select: none;
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
						onClick={() => setIsOpen && setIsOpen(!isOpen)}
						css={css`
							margin-left: 10px;
						`}
					>
						{__('Edit', 'surecart')}
					</ScButton>
				)}
			</div>
		</div>
	);
};
