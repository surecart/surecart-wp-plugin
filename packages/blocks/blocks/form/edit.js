/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { CeCheckout } from '@checkout-engine/react';
import { ALLOWED_BLOCKS } from '../../blocks';
import { Fragment, useState } from '@wordpress/element';
import { parse } from '@wordpress/blocks';
import {
	PanelRow,
	PanelBody,
	Button,
	SelectControl,
} from '@wordpress/components';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import * as templates from '../../templates';
import Setup from '../checkout/components/Setup';

export default function edit( { clientId, attributes, setAttributes } ) {
	const { align, className, prices, font_size, choice_type } = attributes;
	const blockCount = useSelect( ( select ) =>
		select( blockEditorStore ).getBlockCount( clientId )
	);
	const [ template, setTemplate ] = useState( 'sections' );
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const changeTemplate = async () => {
		replaceInnerBlocks(
			clientId,
			createBlocksFromInnerBlocksTemplate(
				parse( templates[ template ] )
			),
			false
		);
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Products', 'checkout_engine' ) }>
					<PanelRow>
						<p>Products</p>
					</PanelRow>
				</PanelBody>
				<PanelBody title={ __( 'Form Template', 'checkout_engine' ) }>
					<PanelRow>
						<div>
							<SelectControl
								label={ __( 'Template' ) }
								value={ template }
								onChange={ ( name ) => setTemplate( name ) }
								options={ [
									{
										value: null,
										label: 'Select a Template',
										disabled: true,
									},
									{ value: 'sections', label: 'Sections' },
									{ value: 'simple', label: 'Simple' },
								] }
							/>
							<Button isPrimary onClick={ changeTemplate }>
								Change
							</Button>
						</div>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeCheckout
				keys={ ceData?.keys }
				css={ css`
					margin-top: 2em;
					font-size: ${ font_size }px;
				` }
				persistSession={ false }
				alignment={ align }
				className={ className }
				choiceType={ choice_type }
				prices={ prices }
			>
				<InnerBlocks
					style={ {
						'--global--spacing-vertical': '0',
					} }
					allowedBlocks={ ALLOWED_BLOCKS }
					renderAppender={
						blockCount ? undefined : InnerBlocks.ButtonBlockAppender
					}
				/>
			</CeCheckout>
		</Fragment>
	);
}
