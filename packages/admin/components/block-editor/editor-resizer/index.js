/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useRef, useCallback } from '@wordpress/element';
import { ResizableBox } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import ResizableHandleBar from './ResizableHandleBar';

// Removes the inline styles in the drag handles.
const HANDLE_STYLES_OVERRIDE = {
	position: undefined,
	userSelect: undefined,
	cursor: undefined,
	width: undefined,
	height: undefined,
	top: undefined,
	right: undefined,
	bottom: undefined,
	left: undefined,
	enableResizing: true,
};

export default function EditorResizer({
	enableResizing = true,
	height,
	children,
}) {
	const [width, setWidth] = useState('100%');
	const resizableRef = useRef();
	const resizeWidthBy = useCallback((deltaPixels) => {
		if (resizableRef.current) {
			setWidth(
				(resizableRef.current.offsetWidth + deltaPixels).toString()
			);
		}
	}, []);
	return (
		<ResizableBox
			ref={(api) => {
				resizableRef.current = api?.resizable;
			}}
			size={{
				width: enableResizing ? width : '100%',
				height: enableResizing && height ? height : '100%',
			}}
			onResizeStop={(event, direction, element) => {
				setWidth(element.style.width);
			}}
			minWidth={300}
			maxWidth="100%"
			maxHeight="100%"
			minHeight={height}
			enable={{
				right: enableResizing,
				left: enableResizing,
			}}
			showHandle={enableResizing}
			resizeRatio={2}
			handleComponent={{
				left: (
					<ResizableHandleBar
						direction="left"
						resizeWidthBy={resizeWidthBy}
					/>
				),
				right: (
					<ResizableHandleBar
						direction="right"
						resizeWidthBy={resizeWidthBy}
					/>
				),
			}}
			handleClasses={undefined}
			handleStyles={{
				left: HANDLE_STYLES_OVERRIDE,
				right: HANDLE_STYLES_OVERRIDE,
			}}
			css={css`
				box-sizing: border-box;
				background-color: #fff;
				height: 100%;
				justify-content: center;
				display: flex;
				position: relative;
			`}
		>
			<div
				css={css`
					height: 100%;
					width: 100%;
				`}
			>
				{children}
			</div>
		</ResizableBox>
	);
}
