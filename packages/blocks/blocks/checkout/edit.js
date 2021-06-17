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

export default ( { className, clientId, isSelected } ) => {
	// these blocks are required in order to submit an order
	const requiredBlocks = {
		// needs an email field
		'checkout-engine/email': {
			props: {
				label: __( 'Email Address', 'checkout-engine' ),
			},
			priority: 0,
		},
		// needs a submit button
		'checkout-engine/submit': {
			props: {},
			priority: 9999,
		},
	};

	return (
		<div className={ className }>
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
							return <div>products</div>;
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
