/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { show_label, show_for_zero_reviews, link_to_reviews } = attributes;
	const blockProps = useBlockProps({
		className: 'has-multiple-reviews',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show label text', 'surecart')}
						help={__(
							'Toggle off to hide the label text, e.g. "reviews".',
							'surecart'
						)}
						onChange={(value) =>
							setAttributes({ show_label: value })
						}
						checked={show_label}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show for zero reviews', 'surecart')}
						help={__(
							'Toggle off to hide the total rating if there are no reviews.',
							'surecart'
						)}
						onChange={(value) =>
							setAttributes({ show_for_zero_reviews: value })
						}
						checked={show_for_zero_reviews}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Link to reviews', 'surecart')}
						help={__(
							'Toggle on to link to the reviews section.',
							'surecart'
						)}
						onChange={(value) =>
							setAttributes({ link_to_reviews: value })
						}
						checked={link_to_reviews}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<span className="sc-review-count">42</span>
				&nbsp;
				{show_label && __('reviews', 'surecart')}
			</div>
		</>
	);
};
