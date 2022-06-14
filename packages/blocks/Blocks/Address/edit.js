import { Fragment } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	TextControl,
	PanelBody,
	PanelRow,
	ToggleControl,
} from '@wordpress/components';
import { ScAddress } from '@surecart/components-react';

export default ({ className, attributes, setAttributes }) => {
	const { label, full } = attributes;

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
					<PanelRow>
						<ToggleControl
							label={__(
								'Always use collect a full address',
								'surecart'
							)}
							checked={full}
							onChange={(full) => setAttributes({ full })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScAddress {...blockProps}></ScAddress>
		</Fragment>
	);
};
