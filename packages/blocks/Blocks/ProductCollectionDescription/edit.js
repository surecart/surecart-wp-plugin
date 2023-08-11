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
import { ScProductCollectionDescription } from '@surecart/components-react';

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
				<ScProductCollectionDescription
					style={{
						'--sc-product-collection-description-align': align,
					}}
				>
					{title}
				</ScProductCollectionDescription>
			</div>
		</>
	);
};
