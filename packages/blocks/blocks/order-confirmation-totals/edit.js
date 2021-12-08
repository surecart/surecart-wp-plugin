/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelRow, PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from '../../blocks';
import { CeOrderConfirmation } from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
	const { title, description, button_text, button_enabled } = attributes;
	const blockProps = useBlockProps( {
		style: {
			maxWidth: 'var( --ast-content-width-size, 910px )',
			marginLeft: 'auto !important',
			marginRight: 'auto !important',
		},
	} );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<ToggleControl
							checked={ button_enabled }
							label={ __(
								'Enable dashboard button',
								'checkout_engine'
							) }
							onChange={ ( button_enabled ) =>
								setAttributes( { button_enabled } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ce-order-confirmation-totals></ce-order-confirmation-totals>
		</div>
	);
};
