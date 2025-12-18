/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { className, link_to_reviews, show_for_zero_reviews } =
		attributes || {};
	const blockProps = useBlockProps();

	const renderContent = () => {
		if (className?.includes('is-style-parentheses')) {
			return '(4.5)';
		} else if (className?.includes('is-style-slash')) {
			return '4.5 / 5.0';
		}

		return '4.5';
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Link to reviews', 'surecart')}
						help={__(
							'Toggle on to link to the reviews section.',
							'surecart'
						)}
						onChange={(link_to_reviews) =>
							setAttributes({ link_to_reviews })
						}
						checked={link_to_reviews}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show for zero reviews', 'surecart')}
						help={__(
							'Toggle on to show the average rating even if there are zero reviews.',
							'surecart'
						)}
						onChange={(show_for_zero_reviews) =>
							setAttributes({ show_for_zero_reviews })
						}
						checked={show_for_zero_reviews}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>{renderContent()}</div>
		</>
	);
};
