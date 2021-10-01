/** @jsx jsx */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Component Dependencies
 */
import { CeCheckout } from '@checkout-engine/react';
import { TabPanel } from '@wordpress/components';

/**
 * React components
 */
import FormBlocks from './components/form-blocks';

import { css, jsx } from '@emotion/core';
import Options from './components/Options';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, FontSizePicker } from '@wordpress/components';

export default ( { clientId, isSelected, attributes, setAttributes } ) => {
	// these blocks are required in order to submit an order
	const requiredBlocks = [ 'checkout-engine/submit' ];

	const { choices, className, align, font_size } = attributes;

	return (
		<div
			className={ className }
			css={ css`
				font-size: 14px;
			` }
		>
			<InspectorControls>
				<PanelBody title={ __( 'Size', 'checkout-engine' ) }>
					<PanelRow>
						<FontSizePicker
							fontSizes={ [
								{
									name: __( 'Small' ),
									slug: 'small',
									size: 14,
								},
								{
									name: __( 'Medium' ),
									slug: 'big',
									size: 16,
								},
								{
									name: __( 'Big' ),
									slug: 'big',
									size: 18,
								},
							] }
							value={ font_size }
							fallbackFontSize={ 16 }
							onChange={ ( font_size ) => {
								setAttributes( { font_size } );
							} }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<TabPanel
				tabs={ [
					{
						name: 'form',
						title: __( 'Form', 'checkout-engine' ),
					},
					{
						name: 'products',
						title: __( 'Products', 'checkout-engine' ),
					},
				] }
			>
				{ ( tab ) => {
					switch ( tab.name ) {
						case 'products':
							return (
								<Options
									attributes={ attributes }
									setAttributes={ setAttributes }
								/>
							);
						default:
							return (
								<CeCheckout
									keys={ ceData?.keys }
									css={ css`
										margin-top: 2em;
										font-size: ${ font_size }px;
									` }
									alignment={ align }
									className={ className }
									choices={ choices }
								>
									<FormBlocks
										isSelected={ isSelected }
										requiredBlocks={ requiredBlocks }
										clientId={ clientId }
									/>
								</CeCheckout>
							);
					}
				} }
			</TabPanel>
		</div>
	);
};
