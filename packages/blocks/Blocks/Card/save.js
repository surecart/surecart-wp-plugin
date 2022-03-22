/**
 * External dependencies
 */
// import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { borderless, title } = attributes;
	return (
		<sc-card borderless={borderless ? '1' : false}>
			{!!title.length && <span slot="title">{title}</span>}
			<InnerBlocks.Content />
		</sc-card>
	);
}
