/**
 * WordPress dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { ToggleControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { show_label } = attributes;
	const blockProps = useBlockProps();
	const totalReviews = 200; // Placeholder for total reviews.

	return (
		<div {...blockProps}>
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
				</PanelBody>
			</InspectorControls>
			<span className="sc-total-reviews-count">{totalReviews}</span>
			&nbsp;
			{show_label &&
				(totalReviews <= 1
					? __('review', 'surecart')
					: __('reviews', 'surecart'))}
		</div>
	);
};
