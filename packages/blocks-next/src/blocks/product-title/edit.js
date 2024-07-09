/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import HeadingLevelDropdown from '../../components/HeadingLebelDropdown';

export default ({
	attributes: { level, textAlign },
	setAttributes,
	context: { 'surecart/productId': productId },
}) => {
	const TagName                 = 0 === level ? 'p' : 'h' + level;

		const blockProps = useBlockProps(
			{
				className: classnames(
					{
						[`has - text - align - ${textAlign}`]: textAlign,
					}
				),
			}
		);

	let { record: product } = useEntityRecord(
		'postType',
		'sc_product',
		productId
	);

	return (
		< >
			< BlockControls group = "block" >
				< HeadingLevelDropdown
					selectedLevel = {level}
					onChange      = {(level) => setAttributes( { level } )}
				/ >
				< AlignmentControl
					value         = {textAlign}
					onChange      = {(nextAlign) => {
						setAttributes( { textAlign: nextAlign } );
						}}
				/ >
			< / BlockControls >

			< TagName {...blockProps} >
				{product ? .title ? .raw || __( 'Product Name', 'surecart' )}
			< / TagName >
		< / >
	);
};
