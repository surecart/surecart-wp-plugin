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
import { ScOrderConfirmationCustomer } from '@surecart/components-react';

export default ({ attributes }) => {
	const { title } = attributes;

	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Title', 'surecart')}
							value={title}
							onChange={(title) => setAttributes({ title })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ScOrderConfirmationCustomer {...blockProps}>
				<RichText
					aria-label={__('Button text')}
					placeholder={__('Add text…')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					slot="heading"
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</ScOrderConfirmationCustomer>
		</Fragment>
	);
};
