/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			{__('Small', 'surecart')} / {__('Red', 'surecart')} /{' '}
			{__('Cotton', 'surecart')}
		</div>
	);
};
