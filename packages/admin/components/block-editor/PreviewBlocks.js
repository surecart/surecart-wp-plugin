/**
 * External dependencies.
 */
import { BlockEditorProvider, BlockList } from '@wordpress/block-editor';

export default function ({ blocks }) {
	return (
		<BlockEditorProvider
			value={blocks}
			settings={surecartBlockEditorSettings}
		>
			<div className="editor-styles-wrapper">
				<BlockList
					renderAppender={() => null}
					className="surecart-block-editor__block-list"
				/>
			</div>
		</BlockEditorProvider>
	);
}
