/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();

	return (
		<span {...blockProps}>{__('Call to action text...', 'surecart')}</span>
	);
};
