/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { ScProduct } from '@surecart/components-react';
import StyleProvider from '../components/StyleProvider';

export default ({ attributes, setAttributes }) => {
	const { column_gap, media_width, media_position, sticky_content } =
		attributes;

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps);

	return (
		<StyleProvider>
			<div
				css={css`
					// prevents issues with our shadow dom.
					[data-type*='surecart/'] {
						pointer-events: all !important;
					}
					.wp-block,
					.block-editor-inserter {
						pointer-events: all !important;
					}
				`}
			>
				<ScProduct {...innerBlocksProps} />
			</div>
		</StyleProvider>
	);
};
