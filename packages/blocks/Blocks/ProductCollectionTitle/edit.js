/**
 * External dependencies.
 */
import {
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import { ScProductCollectionTitle } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { title, align } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={align}
					onChange={(value) => setAttributes({ align: value })}
				/>
			</BlockControls>
			<div {...blockProps}>
				<ScProductCollectionTitle
					style={{ '--sc-product-collection-title-align': align }}
				>
					{title}
				</ScProductCollectionTitle>
			</div>
		</>
	);
};
