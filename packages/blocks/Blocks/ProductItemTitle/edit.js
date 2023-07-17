import {
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { ScProductItemTitle } from '@surecart/components-react';

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
				<ScProductItemTitle
					style={{ '--sc-product-title-align': align }}
				>
					{title}
				</ScProductItemTitle>
			</div>
		</>
	);
};
