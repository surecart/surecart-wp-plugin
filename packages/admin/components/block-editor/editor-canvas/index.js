/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import {
	__unstableIframe as Iframe,
	__unstableUseMouseMoveTypingReset as useMouseMoveTypingReset,
	__unstableEditorStyles as EditorStyles,
} from '@wordpress/block-editor';

export default function EditorCanvas({
	children,
	enableResizing,
	settings,
	height = 600,
	...props
}) {
	const mouseMoveTypingRef = useMouseMoveTypingReset();
	return (
		<Iframe
			ref={mouseMoveTypingRef}
			name="editor-canvas"
			className="edit-site-visual-editor__editor-canvas"
			{...props}
			css={css`
				width: 100% !important;
				height: ${height + 20}px !important;
				padding: 5px;
			`}
		>
			<>
				<EditorStyles styles={settings?.styles} />
				<style>
					{
						// Forming a "block formatting context" to prevent margin collapsing.
						// @see https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
						`.is-root-container {
                            padding: 36px;
                            display: flow-root;
                        }
                        body { position: relative; }`
					}
				</style>
				{enableResizing && (
					<style>
						{
							// Some themes will have `min-height: 100vh` for the root container,
							// which isn't a requirement in auto resize mode.
							`.is-root-container { min-height: 0 !important; }`
						}
					</style>
				)}
				{children}
			</>
		</Iframe>
	);
}
