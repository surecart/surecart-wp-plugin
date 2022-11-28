/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { label, type, columns } = attributes;
	const blockProps = useBlockProps.save();
	return (
		<sc-price-choices
			label={label}
			type={type}
			columns={columns}
			{...blockProps}
		>
			<div>
				<InnerBlocks.Content />
			</div>
		</sc-price-choices>
	);
};
