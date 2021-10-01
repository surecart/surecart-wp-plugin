/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
// import { InnerBlocks } from '@wordpress/block-editor';
// import { InspectorControls } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import {
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { CeFormSection } from '@checkout-engine/react';

export default ( {
	className,
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) => {
	const { label, description } = attributes;

	const hasChildBlocks = useSelect(
		( select ) => {
			const { getBlockOrder } = select( blockEditorStore );
			return getBlockOrder( clientId ).length > 0;
		},
		[ clientId ]
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Title', 'checkout-engine' ) }
							value={ label }
							onChange={ ( label ) => setAttributes( { label } ) }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __( 'Description', 'checkout-engine' ) }
							value={ description }
							onChange={ ( description ) =>
								setAttributes( { description } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<CeFormSection label={ label } className={ className }>
				<RichText
					slot="label"
					aria-label={ __( 'Label' ) }
					placeholder={ __( 'Add a title' ) }
					value={ label }
					onChange={ ( value ) => setAttributes( { label: value } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
				{ ( isSelected || description ) && (
					<RichText
						slot="description"
						aria-label={ __( 'Description' ) }
						placeholder={ __( 'Add a description' ) }
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						withoutInteractiveFormatting
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
				) }
				<InnerBlocks
					renderAppender={
						hasChildBlocks
							? undefined
							: InnerBlocks.ButtonBlockAppender
					}
					allowedBlocks={ [
						'checkout-engine/submit',
						'checkout-engine/email',
						'checkout-engine/input',
					] }
				/>
			</CeFormSection>
		</Fragment>
	);
};
