/**
 * WordPress dependencies.
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { label, type, columns } = attributes;
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return (
		<sc-price-choices
			label={label}
			type={type}
			columns={columns}
			{...innerBlocksProps}
		></sc-price-choices>
	);
};
