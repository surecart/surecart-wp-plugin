/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelRow,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { CeCard } from '@checkout-engine/components-react';

export default ( { attributes, setAttributes, isSelected } ) => {
	const { borderless, title } = attributes;
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
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
						<ToggleControl
							label={ __( 'Borderless', 'checkout-engine' ) }
							checked={ borderless }
							onChange={ ( borderless ) =>
								setAttributes( { borderless } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<CeCard
				borderless={ borderless }
				css={ css`
					.wp-block {
						margin-top: 30px !important;
						margin-bottom: 30px !important;
					}
				` }
			>
				{ ( isSelected || !! title ) && (
					<RichText
						slot="title"
						aria-label={ __( 'Card Title' ) }
						placeholder={ __( 'Add title…' ) }
						value={ title }
						onChange={ ( title ) => setAttributes( { title } ) }
						withoutInteractiveFormatting
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
				) }
				<InnerBlocks />
			</CeCard>
		</div>
	);
};
