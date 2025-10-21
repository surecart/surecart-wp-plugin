/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ context: { show_value } }) => {
	const blockProps = useBlockProps();

	// If we preview the block, then get show_value as undefined as context is not passed,
	// for that case we still need to show the value, just for preview purpose.
	if (typeof show_value !== 'undefined' && !show_value) {
		return null;
	}

	return <div {...blockProps}>4.5</div>;
};
