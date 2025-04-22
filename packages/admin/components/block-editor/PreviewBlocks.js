/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies.
 */
import {
	BlockEditorProvider,
	BlockList,
	__unstableIframe as Iframe,
	__unstableEditorStyles as EditorStyles,
} from '@wordpress/block-editor';
import { Disabled, Tooltip } from '@wordpress/components';

export default function ({ blocks }) {
	const styles = surecartBlockEditorSettings?.styles || [];

	return (
		<BlockEditorProvider
			value={blocks}
			settings={surecartBlockEditorSettings}
		>
			<div className="editor-styles-wrapper">
				<Tooltip
					text={__('Click to edit', 'surecart')}
					placement="bottom"
				>
					<Iframe
						name="editor-canvas"
						className="edit-site-visual-editor__editor-canvas"
						css={css`
							width: 100% !important;
							height: 100vh !important;
							max-height: 400px !important;
							zoom: 0.7;
						`}
					>
						<EditorStyles
							styles={[
								...styles,
								{
									css: `
                    /* Hide rich text placeholder */
                    [data-rich-text-placeholder] {
                      display: none;
                    }
                    /* Hide warning */
                    .wp-block.has-warning > div:first-child {
                      display: none !important;
                    }
                  `,
									__unstableType: 'plugin',
									isGlobalStyles: true,
								},
							]}
						/>
						<div style={{ cursor: 'pointer' }}>
							<Disabled>
								<div style={{ padding: '10px 20px' }}>
									<BlockList
										renderAppender={() => null}
										className="surecart-block-editor__block-list"
									/>
								</div>
							</Disabled>
						</div>
					</Iframe>
				</Tooltip>
			</div>
		</BlockEditorProvider>
	);
}
