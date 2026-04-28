/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
} from '@wordpress/components';
import { ScOrderConfirmationCustomer } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { title } = attributes;

	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Title', 'surecart')}
							value={title}
							onChange={(title) => setAttributes({ title })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ScOrderConfirmationCustomer>
					<RichText
						aria-label={__('Button text', 'surecart')}
						placeholder={__('Add text…', 'surecart')}
						value={title}
						onChange={(title) => setAttributes({ title })}
						withoutInteractiveFormatting
						slot="heading"
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</ScOrderConfirmationCustomer>
			</div>
		</Fragment>
	);
};
