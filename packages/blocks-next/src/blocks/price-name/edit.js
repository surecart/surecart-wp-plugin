import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';

export default ({ context }) => {
	const blockProps = useBlockProps();
	const { name } = context['surecart/price'];

	const { record: product } = useEntityRecord(
		'postType',
		'sc_product',
		context?.postId
	);

	return (
		<div {...blockProps}>
			{name || product?.title?.raw || __('Price Name', 'surecart')}
		</div>
	);
};
