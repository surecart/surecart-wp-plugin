/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';
/**
 * Component Dependencies
 */
import { ScDivider } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;

	const blockProps = useBlockProps({
		style: {
			padding: '10px 0',
		},
	});

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Text', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScDivider {...blockProps}>{text}</ScDivider>
		</Fragment>
	);
};
