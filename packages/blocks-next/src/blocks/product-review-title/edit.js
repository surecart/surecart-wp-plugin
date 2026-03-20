/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context }) => {
	const blockProps = useBlockProps();
	const { review } = context;

	return (
		<div {...blockProps}>
			{review?.title || __('Review Title', 'surecart')}
		</div>
	);
};
