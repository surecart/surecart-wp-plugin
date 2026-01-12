/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();
	return <span {...blockProps}>{__('Bump Name', 'surecart')}</span>;
};
