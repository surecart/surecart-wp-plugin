/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { label, type, columns, required } = attributes;
	return (
		<sc-price-choices label={label} type={type} columns={columns}>
			<div>
				<InnerBlocks.Content />
			</div>
		</sc-price-choices>
	);
};
