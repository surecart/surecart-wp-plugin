/**
 * External dependencies
 */
// import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { title, description, button_text } = attributes;
	return (
		<ce-order-confirmation>
			<InnerBlocks.Content />
		</ce-order-confirmation>
	);
}
