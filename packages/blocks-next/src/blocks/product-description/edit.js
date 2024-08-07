/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';

export default ({ context: { postId } }) => {
	const blockProps = useBlockProps();

	const {
		record: {
			meta: { product },
		},
	} = useEntityRecord('postType', 'sc_product', postId);

	return (
		<div {...blockProps}>
			{product
				? product?.description
				: __(
						'Experience the next level of convenience with our innovative widget. Melding cutting-edge technology with user-friendly design, this product provides unparalleled functionality that caters to your lifestyle.',
						'surecart'
				  )}
		</div>
	);
};
