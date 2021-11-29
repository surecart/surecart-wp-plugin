/**
 * External dependencies
 */
// import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	return (
		<ce-order-confirmation>
			<ce-text
				tag="h2"
				style={ {
					'--font-size': 'var(--ce-font-size-x-large)',
					'--font-weight': 'var(--ce-font-weight-bold)',
					'--color': 'var(--ce-form-title-font-color)',
				} }
			>
				Order Details
			</ce-text>
			<ce-text
				style={ {
					'--font-size': 'var(--ce-font-size-medium)',
					'--font-weight': 'var(--ce-font-weight-normal)',
					'--color': 'var(--ce-color-gray-600)',
				} }
			>
				Thank you for your order!
			</ce-text>
			<InnerBlocks.Content />
		</ce-order-confirmation>
	);
}
