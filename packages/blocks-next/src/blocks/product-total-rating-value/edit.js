/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { ToggleControl } from '@wordpress/components';
import { PanelBody } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps();
	const { show_plus_sign } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						label={__('Show Plus Sign', 'surecart')}
						help={__(
							'Do you want to show a plus sign after the total reviews if greater than zero?',
							'surecart'
						)}
						checked={show_plus_sign}
						onChange={(show_plus_sign) => {
							setAttributes({ show_plus_sign });
						}}
					/>
				</PanelBody>
			</InspectorControls>

			<span {...blockProps}>200{show_plus_sign ? '+' : ''}</span>
		</>
	);
};
