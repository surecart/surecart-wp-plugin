/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import {
	BlockEditorProvider,
	BlockList,
	__unstableEditorStyles as EditorStyles,
} from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';

export default function ({ blocks }) {
	return (
		<Disabled>
			<BlockEditorProvider
				value={blocks}
				settings={surecartBlockEditorSettings}
			>
				<div
					className="editor-styles-wrapper"
					css={css`
						[data-rich-text-placeholder] {
							display: none;
						}
					`}
				>
					<EditorStyles
						styles={surecartBlockEditorSettings?.styles}
					/>
					<BlockList
						renderAppender={() => null}
						className="surecart-block-editor__block-list"
					/>
				</div>
			</BlockEditorProvider>
		</Disabled>
	);
}
