/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon } from '@surecart/components-react';
import { __, sprintf } from '@wordpress/i18n';

export default ({
	title,
	value,
	previous,
	trend = 'up',
	selected,
	...props
}) => {
	const isUp = trend === 'up';

	return (
		<div
			css={css`
				background: ${selected
					? 'var(--sc-color-gray-100)'
					: 'transparent'};
				padding: 16px;
				border-radius: 10px;
				flex: 1;
				cursor: pointer;
				transition: background 0.2s ease;

				&:hover {
					background: var(--sc-color-gray-100);
				}

				&:focus-visible {
					outline: 1px solid var(--sc-color-primary-500);
				}
			`}
			tabIndex={0}
			{...props}
		>
			<div
				css={css`
					color: var(--sc-color-gray-600);
					margin-bottom: 8px;
				`}
			>
				{title}
			</div>
			<div
				css={css`
					font-size: 18px;
					font-weight: 600;
					color: var(--sc-color-gray-900);
					display: flex;
					align-items: center;
					gap: 6px;
					margin-bottom: 4px;
				`}
			>
				{value}
				<ScIcon
					name={isUp ? 'arrow-up-right' : 'arrow-down-right'}
					css={css`
						color: ${isUp
							? '#16A34A'
							: 'var(--sc-color-danger-500)'};
						font-size: 18px;
					`}
				/>
			</div>
			<div
				css={css`
					font-size: 12px;
					color: var(--sc-color-gray-500);
				`}
			>
				{sprintf(__('vs %s last period', 'surecart'), previous)}
			</div>
		</div>
	);
};
