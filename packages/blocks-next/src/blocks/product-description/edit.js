/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';
import { ToggleControl, RangeControl, PanelBody } from '@wordpress/components';

export default ({
	context: { postId },
	attributes: { truncateExcerpt, excerptLength, readMoreText, showReadMore },
	setAttributes,
}) => {
	const blockProps = useBlockProps();

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	const readMoreLink = (
		<RichText
			identifier="readMoreText"
			className="wp-block-post-excerpt__more-link"
			tagName="a"
			aria-label={__('“Read more” link text')}
			placeholder={__('Add "read more" link text')}
			value={readMoreText}
			onChange={(value) => setAttributes({ readMoreText: value })}
			withoutInteractiveFormatting
		/>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show excerpt')}
						checked={truncateExcerpt}
						onChange={(value) =>
							setAttributes({
								truncateExcerpt: value,
							})
						}
					/>
					{truncateExcerpt && (
						<>
							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={__('Max number of words')}
								value={excerptLength}
								onChange={(value) => {
									setAttributes({ excerptLength: value });
								}}
								min="10"
								max="100"
							/>
							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Show read more link')}
								checked={showReadMore}
								onChange={(value) =>
									setAttributes({
										showReadMore: value,
									})
								}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{product
					? product?.description
					: __(
							'Experience the next level of convenience with our innovative widget. Melding cutting-edge technology with user-friendly design, this product provides unparalleled functionality that caters to your lifestyle ',
							'surecart'
					  )}
				{showReadMore && readMoreLink}
			</div>
		</>
	);
};
