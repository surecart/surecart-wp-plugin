/**
 * External dependencies.
 */
import { BlockEditorProvider, BlockList } from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';

export default function ({ blocks }) {
	return (
		<Disabled>
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
		</Disabled>
	);
}
