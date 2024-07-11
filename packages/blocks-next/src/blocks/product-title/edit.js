/**
 * WordPress dependencies
 */
import { BlockControls, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import HeadingLevelDropdown from '../../components/HeadingLebelDropdown';

export default ({
	attributes: { level },
	setAttributes,
	context: { 'surecart/productId': productId },
}) => {
	const TagName = 0 === level ? 'p' : 'h' + level;

	const blockProps = useBlockProps();

	let { record: product } = useEntityRecord(
		'postType',
		'sc_product',
		productId
	);

	return (
		<>
			<BlockControls group="block">
				<HeadingLevelDropdown
					selectedLevel={level}
					onChange={(level) => setAttributes({ level })}
				/>
			</BlockControls>

			<TagName {...blockProps}>
				{product?.title?.raw || __('Product Name', 'surecart')}
			</TagName>
		</>
	);
};
