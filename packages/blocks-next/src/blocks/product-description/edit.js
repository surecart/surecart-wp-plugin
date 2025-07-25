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
	attributes: {
		truncate_excerpt,
		excerpt_length,
		read_more_text,
		show_read_more,
	},
	setAttributes,
}) => {
	const blockProps = useBlockProps();

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	const readMoreLink = show_read_more && (
		<RichText
			identifier="read_more_text"
			className="wp-block-post-excerpt__more-link"
			tagName="a"
			aria-label={__('“Read more” link text')}
			placeholder={__('Add "read more" link text')}
			value={read_more_text}
			onChange={(value) => setAttributes({ read_more_text: value })}
			withoutInteractiveFormatting
		/>
	);

	const description =
		product?.description ||
		__(
			'Experience the next level of convenience with our innovative widget. Melding cutting-edge technology with user-friendly design, this product provides unparalleled functionality that caters to your lifestyle ',
			'surecart'
		);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Limit description length')}
						checked={truncate_excerpt}
						onChange={(value) =>
							setAttributes({
								truncate_excerpt: value,
							})
						}
					/>
					{truncate_excerpt && (
						<>
							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={__('Max number of words')}
								value={excerpt_length}
								onChange={(value) => {
									setAttributes({ excerpt_length: value });
								}}
								min="10"
								max="100"
							/>
							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Show read more link')}
								checked={show_read_more}
								onChange={(value) =>
									setAttributes({
										show_read_more: value,
									})
								}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div dangerouslySetInnerHTML={{ __html: description }} />
				{readMoreLink}
			</div>
		</>
	);
};
