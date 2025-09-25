/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

const styleMap = {
	parentheses: { prefix: '(', suffix: ')' },
	brackets: { prefix: '[', suffix: ']' },
};

export default ({ attributes, context: { show_value } }) => {
	const { className } = attributes;
	const blockProps = useBlockProps();

	if (!show_value) {
		return null;
	}

	const style = className?.replace('is-style-', '');

	const { prefix, suffix } = styleMap[style] || {};

	return (
		<div {...blockProps}>
			{prefix}
			{__('4.5', 'surecart')}
			{suffix}
		</div>
	);
};
