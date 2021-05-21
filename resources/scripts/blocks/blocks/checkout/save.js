/**
 * External dependencies
 */
// import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( { className } ) {
	return (
		<div className={ className }>
			<div>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
