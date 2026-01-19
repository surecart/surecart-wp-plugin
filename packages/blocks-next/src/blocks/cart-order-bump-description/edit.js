/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			{__('Order bump description will appear here...', 'surecart')}
		</div>
	);
};
