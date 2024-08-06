/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			{__(
				'Experience the next level of convenience with our innovative widget. Melding cutting-edge technology with user-friendly design, this product provides unparalleled functionality that caters to your lifestyle.',
				'surecart'
			)}
		</div>
	);
};
