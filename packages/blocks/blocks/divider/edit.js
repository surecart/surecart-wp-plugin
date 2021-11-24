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
import { CeDivider } from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
	const { text } = attributes;

	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Text', 'checkout-engine' ) }
							value={ text }
							onChange={ ( text ) => setAttributes( { text } ) }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeDivider { ...blockProps }>{ text }</CeDivider>
		</Fragment>
	);
};
