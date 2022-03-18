/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';
import { CeOrderConfirmationCustomer } from '@checkout-engine/components-react';

export default ({ attributes }) => {
	const { title } = attributes;

	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'checkout-engine')}>
					<PanelRow>
						<TextControl
							label={__('Title', 'checkout-engine')}
							value={title}
							onChange={(title) => setAttributes({ title })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<CeOrderConfirmationCustomer {...blockProps}>
				<RichText
					aria-label={__('Button text')}
					placeholder={__('Add text…')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					slot="heading"
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</CeOrderConfirmationCustomer>
		</Fragment>
	);
};
