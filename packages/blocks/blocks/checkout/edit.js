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
								<CeCheckout>
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
