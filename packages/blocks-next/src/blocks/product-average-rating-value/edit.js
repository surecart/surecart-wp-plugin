/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { TextControl } from '@wordpress/components';

export default ({ attributes, setAttributes, context: { show_value } }) => {
	const { prefix, suffix } = attributes;
	const blockProps = useBlockProps();

	if (!show_value) {
		return null;
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Prefix', 'surecart')}
						value={prefix}
						onChange={(value) => setAttributes({ prefix: value })}
					/>
					<TextControl
						label={__('Suffix', 'surecart')}
						value={suffix}
						onChange={(value) => setAttributes({ suffix: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{prefix}
				{__('4.5', 'surecart')}
				{suffix}
			</div>
		</>
	);
};
