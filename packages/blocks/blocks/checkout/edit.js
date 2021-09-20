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

export default ( {
	className,
	clientId,
	isSelected,
	attributes,
	setAttributes,
} ) => {
	// these blocks are required in order to submit an order
	const requiredBlocks = [
		'checkout-engine/pricing-section',
		'checkout-engine/payment-section',
		'checkout-engine/submit',
	];

	return (
		<div
			className={ className }
			css={ css`
				font-size: 14px;
			` }
		>
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
									priceIds={ [
										'85109619-529d-47b3-98c3-ca90d22913e4',
										'dd514523-297b-4a86-b5ff-6db0a70d7e17',
										'ead419c4-18e6-43f8-85b4-09e4e2f87de0',
									] }
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
