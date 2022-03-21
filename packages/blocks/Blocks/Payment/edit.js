/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CePayment } from '@surecart/components-react';

export default ({ className, attributes, setAttributes }) => {
	const { label, secure_notice } = attributes;

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
						<TextControl
							label={__('Secure Notice', 'surecart')}
							value={secure_notice}
							onChange={(secure_notice) =>
								setAttributes({ secure_notice })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CePayment
				className={className}
				label={label}
				secureNotice={secure_notice}
			></CePayment>
		</Fragment>
	);
};
