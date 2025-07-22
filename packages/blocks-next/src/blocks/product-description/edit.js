/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';

export default ({ context: { postId } }) => {
	const blockProps = useBlockProps();

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	if (product) {
		return (
			<div
				{...blockProps}
				dangerouslySetInnerHTML={{ __html: product?.description }}
			/>
		);
	}

	return (
		<div {...blockProps}>
			{__(
				'Experience the next level of convenience with our innovative widget. Melding cutting-edge technology with user-friendly design, this product provides unparalleled functionality that caters to your lifestyle.',
				'surecart'
			)}
		</div>
	);
};
