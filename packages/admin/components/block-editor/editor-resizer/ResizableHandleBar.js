/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { LEFT, RIGHT } from '@wordpress/keycodes';
import { VisuallyHidden } from '@wordpress/components';

const DELTA_DISTANCE = 20; // The distance to resize per keydown in pixels.

export default function ResizableHandleBar({ direction, resizeWidthBy }) {
	function handleKeyDown(event) {
		const { keyCode } = event;

		if (
			(direction === 'left' && keyCode === LEFT) ||
			(direction === 'right' && keyCode === RIGHT)
		) {
			resizeWidthBy(DELTA_DISTANCE);
		} else if (
			(direction === 'left' && keyCode === RIGHT) ||
			(direction === 'right' && keyCode === LEFT)
		) {
			resizeWidthBy(-DELTA_DISTANCE);
		}
	}

	return (
		<>
			<button
				className={`resizable-editor__drag-handle is-${direction}`}
				aria-label={__('Drag to resize', 'woocommerce')}
				aria-describedby={`resizable-editor__resize-help-${direction}`}
				onKeyDown={handleKeyDown}
				css={css`
					-webkit-appearance: none;
					appearance: none;
					background: none;
					border: 0;
					border-radius: 2px;
					bottom: 0;
					cursor: ew-resize;
					margin: auto 0;
					outline: none;
					padding: 0;
					position: absolute;
					top: 0;
					width: 12px;
					height: 100px;

					&.is-left {
						left: -16px;
					}

					&.is-right {
						right: -16px;
					}

					&:after {
						background: #949494;
						border-radius: 2px;
						bottom: 24px;
						content: "";
						left: 4px;
						position: absolute;
						right: 0;
						top: 24px;
						width: 4px;
					}
				`}
			/>
			<VisuallyHidden id={`resizable-editor__resize-help-${direction}`}>
				{__(
					'Use left and right arrow keys to resize the canvas.',
					'surecart'
				)}
			</VisuallyHidden>
		</>
	);
}
