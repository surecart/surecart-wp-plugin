/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	InspectorControls,
	InnerBlocks,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

export default ( { attributes, setAttributes } ) => {
	const { title, description } = attributes;

	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Title', 'checkout-engine' ) }
							value={ title }
							onChange={ ( title ) => setAttributes( { title } ) }
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

			<ce-heading
				{ ...blockProps }
				style={ {
					marginBottom: 'var(--ce-spacing-large)',
					paddingBottom: 'var(--ce-spacing-large)',
				} }
			>
				<RichText
					aria-label={ __( 'Title', 'checkout_engine' ) }
					placeholder={ __( 'Add your title...', 'checkout_engine' ) }
					value={ title }
					onChange={ ( title ) => setAttributes( { title } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
				<span slot="description">
					<RichText
						aria-label={ __( 'Description', 'checkout_engine' ) }
						placeholder={ __(
							'Add your description...',
							'checkout_engine'
						) }
						value={ description }
						onChange={ ( description ) =>
							setAttributes( { description } )
						}
						withoutInteractiveFormatting
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
				</span>

				<div slot="end">
					<InnerBlocks />
				</div>
			</ce-heading>
		</Fragment>
	);
};
