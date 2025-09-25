/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes, context: { show_value } }) => {
	const blockProps = useBlockProps();

	if (!show_value) {
		return null;
	}

	return <div {...blockProps}>{__('4.5', 'surecart')}</div>;
};
