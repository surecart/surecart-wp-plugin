/**
 * WordPress dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { show_label, show_for_zero_reviews, style_variant } = attributes;
	const blockProps = useBlockProps();

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
					<SelectControl
						label={__('Style', 'surecart')}
						value={style_variant}
						options={[
							{
								value: 'default',
								label: __('Default', 'surecart'),
							},
							{
								value: 'plus-sign',
								label: __('Plus Sign', 'surecart'),
							},
						]}
						onChange={(value) =>
							setAttributes({ style_variant: value })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				42{style_variant === 'plus-sign' ? '+' : ''}
				&nbsp;
				{show_label && __('reviews', 'surecart')}
			</div>
		</>
	);
};
