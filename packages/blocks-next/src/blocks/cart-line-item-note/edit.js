/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScProductLineItemNote } from '@surecart/components-react';

export default () => {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<ScProductLineItemNote note={__('Your note here', 'surecart')} />
		</div>
	);
};
