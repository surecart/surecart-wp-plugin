import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { ScProductItemButton } from '@surecart/components-react';
import {
	Disabled,
	PanelBody,
	PanelRow,
	TextControl,
} from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Button Text', 'surecart')}
							value={attributes?.text}
							onChange={(newText) =>
								setAttributes({ text: newText })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<Disabled>
					<ScProductItemButton
						btnText={attributes?.text}
					></ScProductItemButton>
				</Disabled>
			</div>
		</>
	);
};
