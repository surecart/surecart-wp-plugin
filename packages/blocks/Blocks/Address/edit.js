import { Fragment } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { TextControl, PanelBody, PanelRow } from '@wordpress/components';
import { CeAddress } from '@surecart/components-react';

export default ({ className, attributes, setAttributes }) => {
	const { label } = attributes;

	const blockProps = useBlockProps({
		label,
	});

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeAddress {...blockProps}></CeAddress>
		</Fragment>
	);
};
