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
	PlainText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import HeadingLevelDropdown from './heading-level-dropdown';
import usePostProduct from '../../../admin/hooks/usePostProduct';

export default ({ attributes: { level, textAlign }, setAttributes }) => {
	const { product, editProduct } = usePostProduct();
	const TagName = 0 === level ? 'p' : 'h' + level;
	const userCanEdit = true; // TODO: Cannot make OPTIONS request to custom endpoint.

	const blockProps = useBlockProps({
		className: classnames({
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	const renderTitle = () => {
		// if (!product?.name) {
		// 	return (
		// 		<TagName {...blockProps}>
		// 			{__('Product Title', 'surecart')}
		// 		</TagName>
		// 	);
		// }

		// if (userCanEdit) {
		return (
			<PlainText
				tagName={TagName}
				placeholder={__('No Title', 'surecart')}
				value={product?.name}
				onChange={(name) => editProduct({ name })}
				__experimentalVersion={2}
				{...blockProps}
			/>
		);
		// }

		// return (
		// 	<TagName
		// 		{...blockProps}
		// 		dangerouslySetInnerHTML={{ __html: product?.name }}
		// 	/>
		// );
	};

	return (
		<>
			<BlockControls group="block">
				<HeadingLevelDropdown
					selectedLevel={level}
					onChange={(newLevel) => setAttributes({ level: newLevel })}
				/>
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>

			{renderTitle()}
		</>
	);
};
