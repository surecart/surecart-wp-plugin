/**
 * Component Dependencies
 */
import { PrestoCheckout } from '@checkout-engine/react';
import { __ } from '@wordpress/i18n';
import FormBlocks from './components/form-blocks';
import { InnerBlocks } from '@wordpress/block-editor';

export default ( { className, clientId } ) => {
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
		<div className={ className } style={ { padding: '20px' } }>
			<PrestoCheckout>
				<InnerBlocks
					renderAppender={ InnerBlocks.ButtonBlockAppender }
					// template={ template }
					// templateLock={ isPremium ? false : 'insert' }
					// allowedBlocks={ allowed }
				/>
				{ /* <FormBlocks
					requiredBlocks={ requiredBlocks }
					clientId={ clientId }
				/> */ }
			</PrestoCheckout>
		</div>
	);
};
